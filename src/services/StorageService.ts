import {
    DeleteObjectsCommand,
    GetObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import createHttpError from "http-errors"
import { config } from "../config/index.ts"
import logger from "../config/logger.ts"

/** Everything stored for one user's palm readings sits under this prefix. */
export const palmPrefix = (userId: string) => `meridian/palm/${userId}/`

const SIGNED_URL_SECONDS = 3600

/**
 * Private files in S3. The bucket is shared with other projects (and may be
 * public-read), so keys are unguessable and only presigned URLs leave the server.
 */
export class StorageService {
    private s3: S3Client | null = null

    get configured(): boolean {
        return Boolean(
            config.AWS_ACCESS_KEY_ID &&
            config.AWS_SECRET_ACCESS_KEY &&
            config.AWS_BUCKET_NAME,
        )
    }

    /** Throws 503 storage_not_configured when the AWS settings are missing. */
    assertConfigured() {
        this.client()
    }

    private client(): S3Client {
        if (!this.configured) {
            throw createHttpError(
                503,
                "Palm photo storage is not configured on the server.",
                { code: "storage_not_configured" },
            )
        }
        this.s3 ??= new S3Client({
            region: config.AWS_REGION,
            followRegionRedirects: true,
            credentials: {
                accessKeyId: config.AWS_ACCESS_KEY_ID,
                secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
            },
        })
        return this.s3
    }

    /** Runs one S3 call; its details go to our logs, the client sees 503. */
    private async call<T>(op: string, fn: (s3: S3Client) => Promise<T>) {
        const s3 = this.client()
        try {
            return await fn(s3)
        } catch (e) {
            const err = e as {
                name?: string
                message?: string
                $metadata?: { httpStatusCode?: number }
            }
            logger.error("S3 request failed", {
                op,
                name: err.name,
                status: err.$metadata?.httpStatusCode,
                message: err.message,
            })
            throw createHttpError(
                503,
                "Photo storage is unavailable right now. Please try again.",
                { code: "storage_unavailable" },
            )
        }
    }

    async put(key: string, body: Buffer, contentType: string) {
        await this.call("put", (s3) =>
            s3.send(
                new PutObjectCommand({
                    Bucket: config.AWS_BUCKET_NAME,
                    Key: key,
                    Body: body,
                    ContentType: contentType,
                    ServerSideEncryption: "AES256",
                }),
            ),
        )
    }

    async get(key: string): Promise<Buffer> {
        return await this.call("get", async (s3) => {
            const res = await s3.send(
                new GetObjectCommand({
                    Bucket: config.AWS_BUCKET_NAME,
                    Key: key,
                }),
            )
            if (!res.Body) {
                throw new Error("empty body")
            }
            return Buffer.from(await res.Body.transformToByteArray())
        })
    }

    /** Signed locally: no request to S3. */
    async signedUrl(key: string): Promise<string> {
        return await this.call("sign", (s3) =>
            getSignedUrl(
                s3,
                new GetObjectCommand({
                    Bucket: config.AWS_BUCKET_NAME,
                    Key: key,
                }),
                { expiresIn: SIGNED_URL_SECONDS },
            ),
        )
    }

    async remove(keys: string[]) {
        if (keys.length === 0) {
            return
        }
        await this.call("remove", async (s3) => {
            const res = await s3.send(
                new DeleteObjectsCommand({
                    Bucket: config.AWS_BUCKET_NAME,
                    Delete: {
                        Objects: keys.map((Key) => ({ Key })),
                        Quiet: true,
                    },
                }),
            )
            if (res.Errors?.length) {
                throw new Error(
                    `${String(res.Errors.length)} objects not deleted`,
                )
            }
        })
    }

    /** Every object under the prefix, a page (up to 1000 keys) at a time. */
    async removePrefix(prefix: string) {
        let token: string | undefined
        do {
            const page = await this.call("list", (s3) =>
                s3.send(
                    new ListObjectsV2Command({
                        Bucket: config.AWS_BUCKET_NAME,
                        Prefix: prefix,
                        ContinuationToken: token,
                    }),
                ),
            )
            await this.remove(
                (page.Contents ?? []).flatMap((o) => (o.Key ? [o.Key] : [])),
            )
            token = page.IsTruncated ? page.NextContinuationToken : undefined
        } while (token)
    }
}
