import createHttpError from "http-errors"
import tzlookup from "tz-lookup"
import { offsetHours } from "../utils/index.ts"
import { config } from "../config/index.ts"
import type { GeoLookup, PlaceDetail, PlaceSuggestion } from "../types/index.ts"

interface GoogleResponse {
    status: string
    errorMessage?: string
}

interface AddressComponent {
    long_name: string
    types: string[]
}

interface GeocodeResult {
    place_id: string
    address_components: AddressComponent[]
    geometry: { location: { lat: number; lng: number } }
}

interface GeocodeResponse extends GoogleResponse {
    results: GeocodeResult[]
}

interface AutocompleteResponse extends GoogleResponse {
    predictions: {
        place_id: string
        description: string
        structured_formatting?: {
            main_text: string
            secondary_text?: string
        }
    }[]
}

/**
 * Google does not always fill `locality` — city-states, some UK towns and a
 * few Asian metros use a different component. First match wins.
 */
const CITY_TYPES = [
    "locality",
    "postal_town",
    "administrative_area_level_3",
    "administrative_area_level_2",
    "administrative_area_level_1",
]

const STATE_TYPES = [
    "administrative_area_level_1",
    "administrative_area_level_2",
    "locality",
]

const GOOGLE_MAPS_API = "https://maps.googleapis.com/maps/api"

export class GeoService {
    async lookup(
        city: string,
        state: string,
        country: string,
        birthDate: string,
        birthTime: string,
    ): Promise<GeoLookup> {
        const { lat, lon } = await this.geocode(`${city}, ${state}, ${country}`)

        return { lat, lon, ...this.timezone(lat, lon, birthDate, birthTime) }
    }

    /**
     * Resolved offline: the coordinate gives an IANA zone, and the zone plus the
     * birth instant gives the offset that was actually in force — historical
     * daylight-saving and wartime shifts included, since that is what the tz
     * database encodes.
     */
    private timezone(
        lat: number,
        lon: number,
        birthDate: string,
        birthTime: string,
    ) {
        let timezoneId: string
        try {
            timezoneId = tzlookup(lat, lon)
        } catch {
            throw createHttpError(
                422,
                "Could not determine a time zone for that birthplace",
            )
        }

        const wallClockAsUtc = Date.parse(`${birthDate}T${birthTime}:00Z`)

        if (Number.isNaN(wallClockAsUtc)) {
            throw createHttpError(422, "Birth date or time is not a real date")
        }

        // The wall clock is first read as though it were UTC, which lands within
        // a day of the truth. One correction picks an offset, a second re-checks
        // it on the correct side of any DST switch. Only the repeated hour of a
        // fall-back is genuinely ambiguous, and either answer is defensible.
        const firstPass = offsetHours(timezoneId, wallClockAsUtc)
        const tzone = offsetHours(
            timezoneId,
            wallClockAsUtc - firstPass * 3_600_000,
        )

        return { tzone, timezoneId }
    }

    /** Hours that `zone` is ahead of UTC at the given instant. */
    /** City suggestions for a partial query — the birth-place picker. */
    async searchPlaces(query: string): Promise<PlaceSuggestion[]> {
        const data = await this.get<AutocompleteResponse>(
            "place/autocomplete",
            { input: query, types: "(cities)" },
        )

        if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
            throw this.googleError("places autocomplete", data)
        }

        return data.predictions.map((prediction) => ({
            placeId: prediction.place_id,
            description: prediction.description,
            main:
                prediction.structured_formatting?.main_text ??
                prediction.description,
            secondary: prediction.structured_formatting?.secondary_text ?? "",
        }))
    }

    /** Turns a picked suggestion into the city/state/country a profile needs. */
    async resolvePlace(placeId: string): Promise<PlaceDetail> {
        const data = await this.get<GeocodeResponse>("geocode", {
            place_id: placeId,
        })

        if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
            throw this.googleError("geocoding", data)
        }

        const result = data.results[0]

        if (!result) {
            throw createHttpError(404, "That place could not be found")
        }

        const country = this.pick(result.address_components, ["country"])

        if (!country) {
            throw createHttpError(
                422,
                "That place has no country and cannot be used as a birthplace",
            )
        }

        const city = this.pick(result.address_components, CITY_TYPES) ?? country
        const state = this.pick(result.address_components, STATE_TYPES) ?? city

        return {
            placeId: result.place_id,
            city,
            state,
            country,
            lat: result.geometry.location.lat,
            lon: result.geometry.location.lng,
        }
    }

    private pick(
        components: AddressComponent[],
        wanted: string[],
    ): string | null {
        for (const type of wanted) {
            const match = components.find((component) =>
                component.types.includes(type),
            )
            if (match) {
                return match.long_name
            }
        }
        return null
    }

    private async geocode(address: string) {
        const data = await this.get<GeocodeResponse>("geocode", { address })

        if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
            throw this.googleError("geocoding", data)
        }

        const location = data.results[0]?.geometry.location

        if (!location) {
            throw createHttpError(
                400,
                "Could not find the location for the given city, state and country",
            )
        }

        return { lat: location.lat, lon: location.lng }
    }

    // e.g. REQUEST_DENIED when the key is not enabled for that API
    private googleError(api: string, data: GoogleResponse) {
        const detail = data.errorMessage
            ? `${data.status}: ${data.errorMessage}`
            : data.status
        return createHttpError(502, `Google Maps ${api} failed (${detail})`)
    }

    private async get<T>(
        endpoint: string,
        params: Record<string, string>,
    ): Promise<T> {
        const url = new URL(`${GOOGLE_MAPS_API}/${endpoint}/json`)
        url.search = new URLSearchParams({
            ...params,
            key: config.GOOGLE_MAPS_API_KEY,
        }).toString()

        const response = await fetch(url)

        if (!response.ok) {
            throw createHttpError(502, "Google Maps API request failed")
        }

        return (await response.json()) as T
    }
}
