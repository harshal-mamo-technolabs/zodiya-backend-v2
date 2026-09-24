import { type Request } from "express"
import type {
    AspectType,
    Body,
    Element,
    HouseSystem,
    InterpretedBody,
    Language,
    Modality,
    NumerologyNumber,
    NumerologyValue,
    ChallengeValue,
    DigitValue,
    PinnacleValue,
    TarotCardId,
    TarotRank,
    TarotSpread,
    TarotSuit,
    Lunation,
    NatalPoint,
    TransitAspect,
    TransitBody,
    TransitTextGroup,
    TransitTone,
    Relationship,
    SynastryBand,
    SynastryPairKey,
    SynastrySection,
    HoroscopeCategory,
    HoroscopePeriod,
    MoodBand,
    MoonPhase,
    SignRelation,
    ZodiacSign,
} from "../constants/index.ts"

export interface UserRegisterData {
    firstName: string
    lastName: string
    email: string
    password: string
}

export interface RegisterUserRequest extends Request {
    body: UserRegisterData
}

export interface UserLoginData {
    email: string
    password: string
}

export interface LoginUserRequest extends Request {
    body: UserLoginData
}

export interface AuthRequest extends Request {
    auth?: {
        sub: string
        role: string
    }
}

export interface AuthCookie {
    accessToken?: string
    refreshToken?: string
}

export interface ProfileData {
    firstName: string
    lastName: string
    birthDate: string
    /** Optional at the edge; defaults to DEFAULT_BIRTH_TIME on create. */
    birthTime?: string
    city: string
    state: string
    country: string
    relationship?: Relationship
    avatar?: string
}

/** Fields a PATCH /profiles/:id may change; every key optional. */
export interface ProfilePatch extends Partial<ProfileData> {
    birthName?: string
}

export interface CreateProfileRequest extends AuthRequest {
    body: ProfileData
}

export interface PlaceSuggestion {
    placeId: string
    /** Full "City, State, Country" label as Google writes it. */
    description: string
    /** The city on its own, for the primary line of a suggestion row. */
    main: string
    /** The rest of the label, for the secondary line. */
    secondary: string
}

export interface PlaceDetail {
    placeId: string
    city: string
    state: string
    country: string
    lat: number
    lon: number
}

export interface GeoLookup {
    lat: number
    lon: number
    tzone: number
    timezoneId: string
}

export interface BirthMoment {
    birthDate: string
    /** Local wall clock, HH:mm. Empty falls back to DEFAULT_BIRTH_TIME. */
    birthTime?: string | undefined
    lat: number
    lon: number
    /** UTC offset in hours at the birth instant, e.g. 5.5 */
    tzone: number
}

export interface SignPosition {
    sign: ZodiacSign
    /** 0 = Aries … 11 = Pisces */
    signIndex: number
    /** Whole degrees within the sign, 0–29 */
    degree: number
    /** Arcminutes within the degree, 0–59 */
    minute: number
}

export interface Placement extends SignPosition {
    body: Body
    /** Ecliptic longitude, 0–360 — what the chart wheel is drawn from. */
    lon: number
    /** Degrees per day; negative means retrograde. */
    speed: number
    retrograde: boolean
    /** 1–12 */
    house: number
}

export interface ChartPoint extends SignPosition {
    lon: number
}

export interface ChartAngles {
    asc: ChartPoint
    mc: ChartPoint
    desc: ChartPoint
    ic: ChartPoint
    /** Right ascension of the midheaven, degrees. */
    ramc: number
    /** True obliquity of the ecliptic, degrees. */
    obliquity: number
}

export interface HouseCusp extends SignPosition {
    /** 1–12 */
    house: number
    lon: number
}

export interface Aspect {
    a: Body
    b: Body
    type: AspectType
    /** Exact separation for this aspect, e.g. 120 for a trine. */
    angle: number
    /** Distance from exact, in degrees. */
    orb: number
    /** True while the aspect is still tightening. */
    applying: boolean
}

export interface Dominants {
    elements: Record<Element, number>
    modalities: Record<Modality, number>
    topElement: Element
    topModality: Modality
}

export interface ChartMeta {
    birthDate: string
    birthTime: string
    lat: number
    lon: number
    tzone: number
    utc: string
    julianDay: number
    zodiac: "tropical"
    houseSystem: HouseSystem
}

export interface NatalChart {
    meta: ChartMeta
    bodies: Placement[]
    angles: ChartAngles
    houses: HouseCusp[]
    aspects: Aspect[]
    dominants: Dominants
}

export interface ReadingChip {
    label: string
    value: string
}

export interface ReadingSection {
    /** Roman numeral shown beside the heading. */
    numeral: string
    key: string
    title: string
    subtitle: string
    /** The uppercase placement strip under the heading. */
    caption: string
    paragraphs: string[]
}

export interface Reading {
    lang: Language
    headline: string[]
    chips: ReadingChip[]
    summary: string
    sections: ReadingSection[]
}

/**
 * What a public share link exposes. Built by listing what goes in, not by
 * subtracting what stays out — so a new field on ChartMeta cannot leak here
 * by accident.
 */
export type PublicChartMeta = Pick<
    ChartMeta,
    "birthDate" | "birthTime" | "zodiac" | "houseSystem"
>

export interface SharedChartResponse {
    profile: {
        name: string
        birthDate: string
        birthTime: string
        city: string
        country: string
    }
    chart: Omit<NatalChart, "meta"> & { meta: PublicChartMeta }
    reading: Reading
}

export interface ChartResponse {
    profile: {
        id: string
        name: string
        birthDate: string
        birthTime: string
        city: string
        state: string
        country: string
    }
    chart: NatalChart
    reading: Reading
}

export interface ReadingSectionCopy {
    numeral: string
    title: string
    subtitle: string
}

export type ReadingTemplateKey =
    | "sun"
    | "houseFirst"
    | "bodyHouse"
    | "ascendant"
    | "mercury"
    | "moon"
    | "venus"
    | "mars"
    | "descendant"
    | "midheaven"
    | "saturn"
    | "jupiter"
    | "node"
    | "pluto"
    | "dominants"
    | "sunMoonAspect"
    | "noSunMoonAspect"
    | "summary"
    | "summaryNoAspect"
    | "headlineLuminaries"
    | "headlineRising"
    | "position"

export type ReadingSectionKey =
    "personality" | "emotions" | "relationships" | "career" | "lifePath"

/**
 * One language's worth of source text. A translation is this same shape with
 * the same {placeholders} — see src/data/readings/en.ts.
 */
export interface ReadingCopy {
    lang: Language
    signs: Record<ZodiacSign, { name: string; essence: string }>
    bodyNames: Record<Body, string>
    /** Twelve entries, house 1 first. */
    houses: { ordinal: string; theme: string }[]
    elements: Record<Element, { label: string; line: string; summary: string }>
    modalities: Record<
        Modality,
        { label: string; clause: string; summary: string }
    >
    aspectNames: Record<AspectType, string>
    aspectLines: Record<AspectType, string>
    /** Plain-language gloss of an aspect, for the one-line summary. */
    aspectShort: Record<AspectType, string>
    placements: Record<InterpretedBody, Record<ZodiacSign, string>>
    ascendant: Record<ZodiacSign, string>
    midheaven: Record<ZodiacSign, string>
    templates: Record<ReadingTemplateKey, string>
    sections: Record<ReadingSectionKey, ReadingSectionCopy>
    labels: Record<"sun" | "moon" | "ascendant" | "retrograde", string>
}

export interface NumerologyStep {
    key: NumerologyNumber
    value: NumerologyValue
    /** 11, 22 and 33 are shown differently in the design. */
    master: boolean
    /** The working out, one line per step. */
    math: string[]
}

/** One letter of the name with the value it carries. */
export interface NumerologyLetter {
    letter: string
    value: DigitValue
    vowel: boolean
}

/** A pinnacle and its matching challenge, over the years they cover. */
export interface NumerologyChapter {
    pinnacle: PinnacleValue
    challenge: ChallengeValue
    fromAge: number
    /** null on the last chapter, which has no end. */
    toAge: number | null
    master: boolean
}

export interface NumerologyReading {
    input: { name: string; birthDate: string }
    numbers: NumerologyStep[]
    letters: NumerologyLetter[]
    personalYear: { year: number; value: DigitValue; math: string[] }
    chapters: NumerologyChapter[]
    /** 1 to 9 values the name never uses. */
    karmicLessons: DigitValue[]
    /** The value the name leans on hardest. */
    hiddenPassion: { value: DigitValue; count: number }
}

export interface NumerologyEntry extends NumerologyStep {
    label: string
    sub: string
    meaning: string
}

export interface NumerologyChapterEntry extends NumerologyChapter {
    label: string
    ages: string
    pinnacleMeaning: string
    challengeMeaning: string
    /** Challenges legitimately repeat; saying so stops it reading as a bug. */
    challengeAgain: string | null
}

export interface NumerologyResponse {
    lang: Language
    input: { name: string; birthDate: string }
    firstName: string
    summary: string
    numbers: NumerologyEntry[]
    lucky: number[]
    days: string[]
    personalYear: {
        year: number
        value: DigitValue
        heading: string
        meaning: string
        math: string[]
    }
    chapters: NumerologyChapterEntry[]
    name: {
        letters: NumerologyLetter[]
        karmicLessons: { value: DigitValue; meaning: string }[]
        karmicNone: string
        hiddenPassion: { value: DigitValue; count: number; meaning: string }
    }
    /** Headings for the blocks below the five numbers. */
    sections: NumerologySectionCopy
    footnote: string
}

export interface NumerologySectionCopy {
    personalYear: { title: string; sub: string }
    chapters: {
        title: string
        sub: string
        pinnacle: string
        challenge: string
    }
    name: {
        title: string
        sub: string
        vowels: string
        consonants: string
        karmic: string
        passion: string
    }
}

/** One language's numerology text. Same shape for every translation. */
export interface NumerologyCopy {
    lang: Language
    labels: Record<NumerologyNumber, { label: string; sub: string }>
    /** Position by position: a 7 Personality is not the same claim as a 7 Life Path. */
    meanings: Record<NumerologyNumber, Record<NumerologyValue, string>>
    days: Record<NumerologyValue, string>
    /** "a" or "an" before each value; a translation may need other forms. */
    articles: Record<NumerologyValue, string>
    templates: {
        /** One master number, and more than one: the verb has to agree. */
        masterOne: string
        masterMany: string
        agree: string
        tension: string
        /** "Birth to 30", "30 to 39", "48 onward" */
        ages: string
        agesOpen: string
        chapter: string
        passion: string
        challengeAgain: string
    }
    sections: NumerologySectionCopy
    personalYear: {
        heading: string
        meanings: Record<DigitValue, string>
    }
    pinnacles: Record<PinnacleValue, string>
    challenges: Record<ChallengeValue, string>
    karmicLessons: Record<DigitValue, string>
    karmicNone: string
    hiddenPassion: Record<DigitValue, string>
    footnote: string
}

// ------------------------------------------------------------------- tarot

/** One orientation of one card. */
export interface TarotSide {
    /** One line, the card in a sentence. */
    lede: string
    text: string
    keywords: string[]
}

export interface TarotCardCopy {
    name: string
    up: TarotSide
    rev: TarotSide
}

/** One language's tarot text. Typed over every card id so a missing one fails the build. */
export interface TarotCopy {
    lang: Language
    cards: Record<TarotCardId, TarotCardCopy>
    spreads: Record<
        TarotSpread,
        {
            label: string
            headline: string
            subline: string
            positions: string[]
        }
    >
    orientation: { upright: string; reversed: string }
    /** Yes / no: upright answers yes, reversed answers not yet. */
    verdict: {
        yes: { title: string; line: string }
        notYet: { title: string; line: string }
    }
    prompt: string
    shuffle: string
}

export interface TarotDrawnCard extends TarotSide {
    id: TarotCardId
    name: string
    arcana: "major" | "minor"
    suit: TarotSuit | null
    rank: TarotRank | null
    number: number
    reversed: boolean
    orientation: string
    position: string
}

export interface TarotDrawResponse {
    lang: Language
    spread: TarotSpread
    headline: string
    subline: string
    prompt: string
    shuffle: string
    spreads: { key: TarotSpread; label: string }[]
    cards: TarotDrawnCard[]
    verdict: { title: string; line: string } | null
}

// ---------------------------------------------------------------- transits

/** One transiting body's relationship to one natal point on one day. */
export interface TransitDay {
    /** Distance from exact, degrees. */
    orb: number
    /** The transiting body's longitude that day. */
    lon: number
    /** Degrees per day; negative is retrograde. */
    speed: number
}

export interface TransitEvent {
    id: string
    transit: TransitBody | Lunation
    natal: NatalPoint
    aspect: TransitAspect
    natalLon: number
    /** 1 to 5, slow planets to personal points score highest. */
    weight: number
    /** First and last window day the orb is within range. */
    span: [number, number]
    /** Window day nearest to exact; clamped when exact falls outside. */
    exact: number
    /** The real exact date, YYYY-MM-DD, which may sit outside the window. */
    exactDate: string
    daily: TransitDay[]
    lunation: boolean
}

export interface TransitReading {
    /** YYYY-MM-DD for each window day, local to the profile's zone. */
    days: string[]
    today: number
    timezoneId: string
    events: TransitEvent[]
}

export interface TransitEventEntry {
    id: string
    transit: TransitBody | Lunation
    natal: NatalPoint
    aspect: TransitAspect
    weight: number
    span: [number, number]
    exact: number
    exactDate: string
    lunation: boolean
    transitName: string
    natalName: string
    natalPos: string
    aspectName: string
    glyph: string
    tone: TransitTone
    toneLabel: string
    /** "Saturn quincunx Sun" */
    title: string
    lede: string
    text: string
    /** One concrete thing to do with it. */
    advice: string
    daily: { orb: number; pos: string; motion: string }[]
}

export interface TransitLabels {
    timeline: string
    activeToday: string
    /** "{date}" is filled by the client in its own locale. */
    activeOn: string
    bySignificance: string
    transiting: string
    natal: string
    orb: string
    exact: string
    quiet: string
    select: string
    backToToday: string
    headlineToday: string
    lookingBackOne: string
    lookingBackMany: string
    lookingAheadOne: string
    lookingAheadMany: string
}

export interface TransitResponse {
    lang: Language
    days: string[]
    today: number
    place: string
    tones: Record<TransitTone, string>
    labels: TransitLabels
    events: TransitEventEntry[]
}

/** One language's transit text. Typed over every combination so nothing is left blank. */
export interface TransitCopy {
    lang: Language
    labels: TransitLabels
    tones: Record<TransitTone, string>
    aspects: Record<TransitAspect, { name: string; glyph: string }>
    points: Record<NatalPoint, string>
    lunations: Record<Lunation, string>
    motion: {
        retrograde: string
        direct: string
        slow: string
        fast: string
        lunation: string
        /** Joins the two halves: "Retrograde · slow" */
        joiner: string
    }
    /** The card in one line, per transiting body and aspect. */
    ledes: Record<TransitBody, Record<TransitAspect, string>>
    /** The advice, per transiting body and how the aspect behaves. */
    texts: Record<TransitBody, Record<TransitTextGroup, string>>
    lunationLedes: Record<Lunation, Record<TransitAspect, string>>
    lunationTexts: Record<Lunation, Record<TransitTextGroup, string>>
    /** The "to do" line, per transiting body and how the aspect behaves. */
    advice: Record<TransitBody, Record<TransitTextGroup, string>>
    lunationAdvice: Record<Lunation, Record<TransitTextGroup, string>>
    /** Closes every reading: what the natal point stands for in a life. */
    natal: Record<NatalPoint, string>
}

// ---------------------------------------------------------------- synastry

/** One aspect between a body in chart A and a body in chart B. */
export interface SynastryContact {
    a: Body
    b: Body
    type: AspectType
    kind: TransitTextGroup
    /** Distance from exact, degrees. */
    orb: number
    /** 1 (two outer planets) to 2 (two personal planets). */
    weight: number
    exact: boolean
}

/** What the wheel needs from one chart. */
export interface SynastryChart {
    asc: number
    cusps: number[]
    bodies: Partial<Record<Body, number>>
    sun: ZodiacSign
}

/** Where one person's point falls in the other's houses. */
export interface SynastryPlacement {
    /** Whose point. */
    of: "a" | "b"
    body: Body
    house: number
}

export interface SynastryReading {
    a: SynastryChart
    b: SynastryChart
    /** Every contact, strongest first. */
    contacts: SynastryContact[]
    placements: SynastryPlacement[]
}

export interface SynastryPerson extends SynastryChart {
    id: string
    firstName: string
    name: string
}

export interface SynastryContactEntry extends SynastryContact {
    glyph: string
    /** "Ana's Moon trine Daniel's Sun" */
    text: string
    /** "orb 1.6°" */
    orbText: string
}

export interface SynastrySectionEntry {
    key: SynastrySection
    numeral: string
    title: string
    /** 1 to 5 */
    score: number
    /** The placements the paragraphs are drawn from, one line each. */
    basis: string[]
    paragraphs: string[]
}

export interface SynastryLabels {
    stageEntry: string
    stagePlate: string
    eyebrow: string
    title: string
    intro: string
    personOne: string
    personTwo: string
    needMore: string
    addProfile: string
    compare: string
    ready: string
    notReady: string
    inner: string
    outer: string
    edit: string
    overall: string
    strongest: string
    comparison: string
    sectionCount: string
    orb: string
}

export interface SynastryResponse {
    lang: Language
    a: SynastryPerson
    b: SynastryPerson
    contacts: SynastryContactEntry[]
    top: SynastryContactEntry[]
    score: {
        /** 0 to 1 along the gauge. */
        value: number
        band: SynastryBand
        word: string
        detail: string
        note: string
    }
    headline: string
    sections: SynastrySectionEntry[]
    labels: SynastryLabels
}

export interface SynastrySectionCopy<S extends SynastrySection> {
    title: string
    /** When nothing in the section's pairs is in aspect. */
    none: string
    pairs: Record<SynastryPairKey<S>, Record<TransitTextGroup, string>>
}

/** One language's synastry text. Typed over every pair and group so nothing is left blank. */
export interface SynastryCopy {
    lang: Language
    labels: SynastryLabels
    bodies: Record<Body, string>
    signs: Record<ZodiacSign, string>
    aspects: Record<AspectType, { verb: string; glyph: string }>
    /** "first" to "twelfth" */
    ordinals: string[]
    /** What each house is about, one short phrase per house, index 0 = first. */
    houses: string[]
    /** "{x}'s {body} falls in {y}'s {ordinal} house: {meaning}." */
    housePlacement: string
    /** "{x} {body} in {y}'s {ordinal} house" */
    houseBasis: string
    sections: { [S in SynastrySection]: SynastrySectionCopy<S> }
    score: {
        /** Plain word, and the same with a qualifier when the other side shows too. */
        bands: Record<SynastryBand, { plain: string; mixed: string }>
        detail: string
        note: string
    }
    headline: {
        template: string
        /** Low, middle and high fragment for each of the three sections the headline reads. */
        emotional: [string, string, string]
        communication: [string, string, string]
        longTerm: [string, string, string]
    }
}

// --------------------------------------------------------------- horoscope

/** A transiting planet as a sun sign sees it. */
export interface SkyBody {
    body: Body
    lon: number
    speed: number
    sign: ZodiacSign
    /** Solar house, 1 to 12: the sign itself is the first. */
    house: number
    relation: SignRelation
    retrograde: boolean
    stationary: boolean
}

/** An aspect between two transiting planets. */
export interface SkyAspect {
    a: Body
    b: Body
    type: AspectType
    kind: TransitTextGroup
    orb: number
    exact: boolean
}

export interface SkyMoon {
    phase: MoonPhase
    /** 0 new to 1 full. */
    illumination: number
    sign: ZodiacSign
    house: number
    relation: SignRelation
    lon: number
}

/** A planet changing sign, or the Moon turning new or full, inside the span. */
export interface SkyEvent {
    date: string
    body: Body | Lunation
    sign: ZodiacSign
}

/** One moment's sky, read for one sign. */
export interface HoroscopeSky {
    date: string
    bodies: SkyBody[]
    aspects: SkyAspect[]
    moon: SkyMoon
}

export interface HoroscopeReading {
    sign: ZodiacSign
    period: HoroscopePeriod
    /** The date asked for, YYYY-MM-DD in the viewer's zone. */
    date: string
    span: { start: string; end: string }
    /** The sky at the period's reference moment: noon, midweek noon, or midyear. */
    sky: HoroscopeSky
    /** Sign changes and lunations inside the span, in date order. */
    events: SkyEvent[]
    /** For a week, which signs the Moon runs through; for a day, just the one. */
    moonSigns: ZodiacSign[]
}

export interface HoroscopeCategoryEntry {
    key: HoroscopeCategory
    numeral: string
    title: string
    /** 1 to 5 */
    score: number
    lead: Body
    relation: SignRelation
    text: string
}

export interface HoroscopeLabels {
    ephemeris: string
    selectSign: string
    ruledBy: string
    periods: Record<HoroscopePeriod, string>
    readings: string
    strength: string
    mood: string
    luckyNumber: string
    luckyColour: string
    moon: Record<HoroscopePeriod, string>
    why: Record<HoroscopePeriod, string>
    forMyChart: string
    email: string
    emailSoon: string
}

export interface HoroscopeResponse {
    lang: Language
    sign: ZodiacSign
    signName: string
    abbr: string
    range: string
    ruler: string
    period: HoroscopePeriod
    date: string
    span: { start: string; end: string }
    headline: string
    mood: { value: number; band: MoodBand; label: string }
    luckyNumber: number
    luckyColour: { name: string; hex: string }
    moonLine: string
    categories: HoroscopeCategoryEntry[]
    /** Mean of the category scores, 1 to 5. */
    strength: number
    skyNotes: string[]
    labels: HoroscopeLabels
}

/** Every period has a paragraph for every category and every angle to the sign. */
export type HoroscopePeriodCopy = Record<
    HoroscopeCategory,
    Record<SignRelation, string[]>
>

export interface HoroscopeCopy {
    lang: Language
    labels: HoroscopeLabels
    signs: Record<ZodiacSign, { name: string; abbr: string; range: string }>
    bodies: Record<Body, string>
    aspects: Record<AspectType, string>
    phases: Record<MoonPhase, string>
    colours: Record<ZodiacSign, string>
    moods: Record<MoodBand, string>
    categories: Record<HoroscopeCategory, string>
    /** "first" to "twelfth" */
    ordinals: string[]
    /** What each solar house is about, second person, index 0 = first. */
    houses: string[]
    /** Headline by the lead planet's angle to the sign, a few to choose from. */
    headlines: Record<HoroscopePeriod, Record<SignRelation, string[]>>
    readings: Record<HoroscopePeriod, HoroscopePeriodCopy>
    /** A second sentence for the daily Emotions reading, by the Moon's solar house. */
    moonHouse: string[]
    /** A clause for the Moon's phase, appended to the daily Emotions reading. */
    phaseNotes: Record<MoonPhase, string>
    /** Appended to a reading whose lead planet is retrograde. */
    retrograde: string
    notes: {
        aspect: string
        moon: string
        retrograde: string
        direct: string
        stationary: string
        lunation: Record<Lunation, string>
        ingress: string
        moonRun: string
        house: string
    }
}

// ----------------------------------------------------------------- account

export interface NotificationPrefs {
    daily: boolean
    transits: boolean
    retro: boolean
    /** Local wall-clock HH:mm. */
    deliveryTime: string
}

/** What PATCH /auth/me may change; every key optional. */
export interface AccountPatch {
    firstName?: string
    lastName?: string
    notifications?: Partial<NotificationPrefs>
}

export interface AccountResponse {
    id: string
    firstName: string
    lastName: string
    email: string
    notifications: NotificationPrefs
    createdAt: string
}
