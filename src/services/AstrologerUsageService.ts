import type { Model, Types } from "mongoose"
import createHttpError from "http-errors"
import type {
    AstrologerSession,
    AstrologerSessionDocument,
} from "../models/AstrologerSession.ts"
import type { User } from "../models/User.ts"
import type { ElevenLabsService } from "./ElevenLabsService.ts"
import { minutesLeft, type BillingService } from "./BillingService.ts"

// a signed URL dies after 15 minutes; past this nobody can still connect
const NEVER_CONNECTED_MS = 20 * 60 * 1000
/** Below this there is not enough left to open a conversation. */
export const MIN_SESSION_SECONDS = 10

/**
 * Meters astrologer conversations. ElevenLabs is the clock: a finished
 * conversation's recorded duration is charged, and while one is still
 * running its elapsed time is held back from the balance.
 */
export class AstrologerUsageService {
    constructor(
        private sessionModel: Model<AstrologerSession>,
        private userModel: Model<User>,
        private elevenLabs: ElevenLabsService,
        private billing: BillingService,
        /** Pause between looks at a conversation ElevenLabs is still processing. */
        private retryMs = 1500,
    ) {}

    /** Seconds the user may talk for right now. */
    async available(userId: string): Promise<number> {
        await this.settlePending(userId)
        const [user, open] = await Promise.all([
            this.userModel.findById(userId).select("billing.minutes"),
            this.sessionModel.find({ user: userId, settled: false }),
        ])
        const now = Date.now()
        const held = open.reduce(
            (sum, s) =>
                sum +
                Math.min(
                    s.maxSeconds,
                    Math.ceil((now - s.createdAt.getTime()) / 1000),
                ),
            0,
        )
        return Math.max(0, minutesLeft(user?.billing).total - held)
    }

    async open(userId: string, conversationId: string, maxSeconds: number) {
        return this.sessionModel.create({
            user: userId,
            conversationId,
            maxSeconds,
        })
    }

    /** The client hung up: charge now if ElevenLabs has the duration ready. */
    async end(userId: string, sessionId: string, attempts = 4) {
        const session = await this.sessionModel.findOne({
            _id: sessionId,
            user: userId,
        })
        if (!session) {
            throw createHttpError(404, "Session does not exist")
        }
        for (let i = 0; i < attempts && !session.settled; i++) {
            if (i > 0) {
                await new Promise((r) => setTimeout(r, this.retryMs))
            }
            if (await this.settle(session)) {
                break
            }
        }
        const fresh = await this.sessionModel.findById(session._id)
        return {
            settled: !!fresh?.settled,
            chargedSeconds: fresh?.chargedSeconds ?? 0,
        }
    }

    /** Anything left open by a closed tab is charged the next time we look. */
    async settlePending(userId: string | Types.ObjectId) {
        const open = await this.sessionModel.find({
            user: userId,
            settled: false,
        })
        for (const session of open) {
            await this.settle(session)
        }
    }

    /** True once the session has been charged (possibly zero). */
    private async settle(session: AstrologerSessionDocument) {
        const conversation = await this.elevenLabs.conversation(
            session.conversationId,
        )
        let seconds: number
        if (!conversation) {
            if (Date.now() - session.createdAt.getTime() < NEVER_CONNECTED_MS) {
                return false
            }
            seconds = 0
        } else if (
            conversation.status === "done" ||
            conversation.status === "failed"
        ) {
            seconds = Math.max(
                0,
                Math.ceil(conversation.metadata?.call_duration_secs ?? 0),
            )
        } else {
            return false
        }

        // claim it first, so two settlers cannot both charge it
        const claimed = await this.sessionModel.findOneAndUpdate(
            { _id: session._id, settled: false },
            { $set: { settled: true, chargedSeconds: seconds } },
        )
        if (claimed && seconds > 0) {
            await this.billing.debit(session.user, seconds)
        }
        session.settled = true
        return true
    }
}
