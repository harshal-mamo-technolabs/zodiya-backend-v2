import { type NextFunction, type Request, type Response } from "express"
import { validationResult } from "express-validator"
import type { Logger } from "winston"
import type { AuthRequest } from "../types/index.ts"
import type { BillingService } from "../services/BillingService.ts"
import { getAuthUserId } from "../utils/index.ts"
import { config } from "../config/index.ts"
import {
    CURRENCY,
    MAX_PACK_QUANTITY,
    MINUTE_PACKS,
    PLANS,
    PLAN_TIERS,
    PROFILE_SLOT,
    TRIAL,
    type BillingKind,
    type PlanTier,
} from "../constants/billing.ts"

export default class BillingController {
    constructor(
        private billing: BillingService,
        private logger: Logger,
    ) {}

    /** Public: the pricing page reads prices from here, not from the bundle. */
    catalog(_req: Request, res: Response) {
        res.status(200).json({
            publishableKey: config.STRIPE_PUBLIC_KEY,
            currency: CURRENCY,
            plans: PLAN_TIERS.map((t) => {
                const { tier, name, amount, months, minutes } = PLANS[t]
                return { tier, name, amount, months, minutes }
            }),
            trial: {
                tier: TRIAL.tier,
                amount: TRIAL.amount,
                days: TRIAL.days,
                minutes: TRIAL.minutes,
            },
            profileSlot: {
                amount: PROFILE_SLOT.amount,
                included: PROFILE_SLOT.included,
            },
            minutePacks: MINUTE_PACKS,
            maxPackQuantity: MAX_PACK_QUANTITY,
        })
    }

    async status(req: AuthRequest, res: Response, next: NextFunction) {
        await this.run(req, res, next, (userId) => this.billing.status(userId))
    }

    async subscribe(req: AuthRequest, res: Response, next: NextFunction) {
        const { plan, trial } = req.body as { plan: PlanTier; trial?: boolean }
        await this.run(req, res, next, async (userId) => {
            const step = await this.billing.subscribe(userId, plan, !!trial)
            this.logger.info("Checkout started", { userId, plan, trial })
            return step
        })
    }

    async changePlan(req: AuthRequest, res: Response, next: NextFunction) {
        const { plan } = req.body as { plan: PlanTier }
        await this.run(req, res, next, async (userId) => {
            const step = await this.billing.changePlan(userId, plan)
            this.logger.info("Plan change requested", { userId, plan })
            return step
        })
    }

    async cancel(req: AuthRequest, res: Response, next: NextFunction) {
        await this.run(req, res, next, (userId) =>
            this.billing.setCancelAtPeriodEnd(userId, true),
        )
    }

    async resume(req: AuthRequest, res: Response, next: NextFunction) {
        await this.run(req, res, next, (userId) =>
            this.billing.setCancelAtPeriodEnd(userId, false),
        )
    }

    async addProfileSlot(req: AuthRequest, res: Response, next: NextFunction) {
        await this.run(req, res, next, (userId) =>
            this.billing.addProfileSlot(userId),
        )
    }

    async buyMinutes(req: AuthRequest, res: Response, next: NextFunction) {
        const { pack, quantity } = req.body as {
            pack: string
            quantity?: number
        }
        await this.run(req, res, next, (userId) =>
            this.billing.buyMinutes(userId, pack, quantity ?? 1),
        )
    }

    async payOpen(req: AuthRequest, res: Response, next: NextFunction) {
        const { kind } = req.body as { kind: BillingKind }
        await this.run(req, res, next, (userId) =>
            this.billing.payOpen(userId, kind),
        )
    }

    async card(req: AuthRequest, res: Response, next: NextFunction) {
        await this.run(req, res, next, async (userId) => ({
            card: await this.billing.card(userId),
        }))
    }

    async cardSetup(req: AuthRequest, res: Response, next: NextFunction) {
        await this.run(req, res, next, (userId) =>
            this.billing.cardSetup(userId),
        )
    }

    async saveCard(req: AuthRequest, res: Response, next: NextFunction) {
        const { setupIntentId } = req.body as { setupIntentId: string }
        await this.run(req, res, next, async (userId) => ({
            card: await this.billing.saveCard(userId, setupIntentId),
        }))
    }

    async invoices(req: AuthRequest, res: Response, next: NextFunction) {
        await this.run(req, res, next, (userId) =>
            this.billing.invoices(userId),
        )
    }

    async sync(req: AuthRequest, res: Response, next: NextFunction) {
        const { paymentIntentId } = req.body as { paymentIntentId?: string }
        await this.run(req, res, next, (userId) =>
            this.billing.sync(userId, paymentIntentId),
        )
    }

    /** Stripe → us. The body is the raw buffer; the signature is checked first. */
    async webhook(req: Request, res: Response, next: NextFunction) {
        try {
            const event = this.billing.constructEvent(
                req.body as Buffer,
                req.headers["stripe-signature"] as string | undefined,
            )
            await this.billing.handleEvent(event)
            this.logger.info("Stripe event handled", {
                id: event.id,
                type: event.type,
            })
            res.status(200).json({ received: true })
        } catch (e) {
            // a non-2xx makes Stripe retry, which is what a failure should do
            next(e)
        }
    }

    private async run(
        req: AuthRequest,
        res: Response,
        next: NextFunction,
        work: (userId: string) => Promise<unknown>,
    ) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() })
            return
        }
        try {
            res.status(200).json(await work(getAuthUserId(req)))
        } catch (e) {
            next(e)
        }
    }
}
