import { jest } from "@jest/globals"
import { config } from "../../src/config/index.ts"
import { HelpScoutService } from "../../src/services/HelpScoutService.ts"

const conversation = {
    id: 123,
    mailboxId: 350186,
    primaryCustomer: { email: "customer@example.com" },
}

describe("Help Scout Inbox API", () => {
    const fetchMock = jest.fn<typeof fetch>()
    beforeEach(() => {
        fetchMock.mockReset()
        jest.spyOn(globalThis, "fetch").mockImplementation(fetchMock)
        jest.replaceProperty(config, "HELPSCOUT_MAILBOX_APP_ID", "app-id")
        jest.replaceProperty(
            config,
            "HELPSCOUT_MAILBOX_APP_SECRET",
            "app-secret",
        )
    })
    afterEach(() => jest.restoreAllMocks())

    it("keeps credentials server-side and reuses the OAuth token", async () => {
        fetchMock
            .mockResolvedValueOnce(
                Response.json({
                    access_token: "server-token",
                    expires_in: 172800,
                }),
            )
            .mockResolvedValueOnce(Response.json(conversation))
            .mockResolvedValueOnce(Response.json(conversation))
        const service = new HelpScoutService()
        expect(await service.conversation("123")).toEqual(conversation)
        expect(await service.conversation("123")).toEqual(conversation)
        expect(fetchMock).toHaveBeenCalledTimes(3)
        expect(fetchMock).toHaveBeenNthCalledWith(
            2,
            "https://api.helpscout.net/v2/conversations/123",
            expect.objectContaining({
                headers: { Authorization: "Bearer server-token" },
                redirect: "error",
            }),
        )
    })
    it("rejects an incomplete conversation instead of trusting caller-provided email", async () => {
        fetchMock
            .mockResolvedValueOnce(
                Response.json({
                    access_token: "server-token",
                    expires_in: 172800,
                }),
            )
            .mockResolvedValueOnce(
                Response.json({ id: 123, mailboxId: 350186 }),
            )
        await expect(
            new HelpScoutService().conversation("123"),
        ).rejects.toThrow("incomplete conversation")
    })
    it("fails closed if Help Scout is unavailable", async () => {
        fetchMock.mockResolvedValueOnce(new Response(null, { status: 500 }))
        await expect(
            new HelpScoutService().conversation("123"),
        ).rejects.toThrow("Could not authenticate")
    })
    it("verifies agent access to the configured inbox across all pages", async () => {
        jest.replaceProperty(config, "HELPSCOUT_INBOX_ID", "350186")
        fetchMock
            .mockResolvedValueOnce(
                Response.json({ access_token: "token", expires_in: 172800 }),
            )
            .mockResolvedValueOnce(
                Response.json({
                    _embedded: {
                        users: [{ id: 1, type: "user", role: "user" }],
                    },
                    page: { totalPages: 2 },
                }),
            )
            .mockResolvedValueOnce(
                Response.json({
                    _embedded: {
                        users: [{ id: 456, type: "user", role: "user" }],
                    },
                    page: { totalPages: 2 },
                }),
            )
        await expect(
            new HelpScoutService().authorizeAgent("456"),
        ).resolves.toBeUndefined()
        expect(fetchMock).toHaveBeenNthCalledWith(
            3,
            "https://api.helpscout.net/v2/users?mailbox=350186&page=2",
            expect.any(Object),
        )
    })
    it("denies agents outside the inbox and light users", async () => {
        fetchMock
            .mockResolvedValueOnce(
                Response.json({ access_token: "token", expires_in: 172800 }),
            )
            .mockResolvedValueOnce(
                Response.json({
                    _embedded: {
                        users: [{ id: 456, type: "user", role: "light user" }],
                    },
                }),
            )
        await expect(
            new HelpScoutService().authorizeAgent("456"),
        ).rejects.toThrow("does not have access")
    })
    it("reads verified email addresses from Help Scout instead of the browser", async () => {
        fetchMock
            .mockResolvedValueOnce(
                Response.json({ access_token: "token", expires_in: 172800 }),
            )
            .mockResolvedValueOnce(
                Response.json({
                    id: 789,
                    _embedded: {
                        emails: [{ value: " Customer@Example.com " }],
                    },
                }),
            )
        await expect(
            new HelpScoutService().customerEmails("789"),
        ).resolves.toEqual(["customer@example.com"])
    })
    it("rejects a mismatched customer identity returned by the API", async () => {
        fetchMock
            .mockResolvedValueOnce(
                Response.json({ access_token: "token", expires_in: 172800 }),
            )
            .mockResolvedValueOnce(
                Response.json({
                    id: 790,
                    _embedded: { emails: [{ value: "customer@example.com" }] },
                }),
            )
        await expect(
            new HelpScoutService().customerEmails("789"),
        ).rejects.toThrow("incomplete customer")
    })

    it("requires Inbox API credentials", async () => {
        jest.replaceProperty(config, "HELPSCOUT_MAILBOX_APP_SECRET", "")
        await expect(
            new HelpScoutService().conversation("123"),
        ).rejects.toThrow("not configured")
        expect(fetchMock).not.toHaveBeenCalled()
    })
})
