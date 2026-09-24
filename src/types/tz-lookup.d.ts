declare module "tz-lookup" {
    /**
     * IANA zone name for a coordinate, e.g. "Asia/Kolkata".
     * Throws if the latitude or longitude is out of range.
     */
    export default function tzlookup(lat: number, lon: number): string
}
