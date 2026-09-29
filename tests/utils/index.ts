import request from "supertest"
import type { Express } from "express"
import { UserModel } from "../../src/models/User.ts"

export const userData = {
    firstName: "harshal",
    lastName: "chauhan",
    email: "harshal@gmail.com",
    password: "1234567890",
}

export const profileData = {
    firstName: "harshal",
    lastName: "chauhan",
    birthDate: "1995-08-15",
    birthTime: "14:30",
    city: "Ahmedabad",
    state: "Gujarat",
    country: "India",
}

export const geoData = {
    lat: 23.022505,
    lon: 72.5713621,
    tzone: 5.5,
    timezoneId: "Asia/Kolkata",
}

/** What a paying account looks like: a live plan, spare profile slots, minutes. */
export async function grantPlan(email = userData.email) {
    await UserModel.updateOne(
        { email },
        {
            $set: {
                "billing.customerId": `cus_test_${email}`,
                "billing.plan": {
                    subscriptionId: "sub_test_plan",
                    tier: "starter",
                    status: "active",
                },
                "billing.profiles": {
                    subscriptionId: "sub_test_profiles",
                    quantity: 10,
                    status: "active",
                },
                "billing.minutes": { allowance: 900, used: 0, topup: 0 },
            },
        },
    )
}

// registers the user and returns the `accessToken=...` cookie to send back;
// the account is subscribed unless `subscribed` is false
export async function registerAndGetCookie(
    app: Express,
    data = userData,
    subscribed = true,
): Promise<string> {
    const response = await request(app).post("/auth/register").send(data)
    if (subscribed) {
        await grantPlan(data.email)
    }

    const cookies = (response.headers as unknown as { "set-cookie": string[] })[
        "set-cookie"
    ]

    return (
        cookies.find((c) => c.startsWith("accessToken="))?.split(";")[0] ?? ""
    )
}
