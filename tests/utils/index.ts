import request from "supertest"
import type { Express } from "express"

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

// registers the user and returns the `accessToken=...` cookie to send back
export async function registerAndGetCookie(
    app: Express,
    data = userData,
): Promise<string> {
    const response = await request(app).post("/auth/register").send(data)

    const cookies = (response.headers as unknown as { "set-cookie": string[] })[
        "set-cookie"
    ]

    return (
        cookies.find((c) => c.startsWith("accessToken="))?.split(";")[0] ?? ""
    )
}
