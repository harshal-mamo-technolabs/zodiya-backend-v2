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
    it("requires Inbox API credentials", async () => {
        jest.replaceProperty(config, "HELPSCOUT_MAILBOX_APP_SECRET", "")
        await expect(
            new HelpScoutService().conversation("123"),
        ).rejects.toThrow("not configured")
        expect(fetchMock).not.toHaveBeenCalled()
    })
})
