export const Roles = {
    CUSTOMER: "customer",
    ADMIN: "admin",
} as const

export type Role = (typeof Roles)[keyof typeof Roles]

export const Relationships = {
    SELF: "self",
    SPOUSE: "spouse",
    PARTNER: "partner",
    PARENT: "parent",
    CHILD: "child",
    SIBLING: "sibling",
    FRIEND: "friend",
    OTHER: "other",
} as const

export type Relationship = (typeof Relationships)[keyof typeof Relationships]

// the twelve portrait illustrations the app ships; the id is the file stem
export const AVATAR_COUNT = 12
export const AVATARS = Array.from(
    { length: AVATAR_COUNT },
    (_, i) => `avatar-${String(i + 1).padStart(2, "0")}`,
)

export const ZodiacSigns = {
    ARIES: "aries",
    TAURUS: "taurus",
    GEMINI: "gemini",
    CANCER: "cancer",
    LEO: "leo",
    VIRGO: "virgo",
    LIBRA: "libra",
    SCORPIO: "scorpio",
    SAGITTARIUS: "sagittarius",
    CAPRICORN: "capricorn",
    AQUARIUS: "aquarius",
    PISCES: "pisces",
} as const

export type ZodiacSign = (typeof ZodiacSigns)[keyof typeof ZodiacSigns]

export const Bodies = {
    SUN: "sun",
    MOON: "moon",
    MERCURY: "mercury",
    VENUS: "venus",
    MARS: "mars",
    JUPITER: "jupiter",
    SATURN: "saturn",
    URANUS: "uranus",
    NEPTUNE: "neptune",
    PLUTO: "pluto",
    NORTH_NODE: "northNode",
} as const

export type Body = (typeof Bodies)[keyof typeof Bodies]

/** Table order on the placements page. */
export const BODY_ORDER: Body[] = [
    Bodies.SUN,
    Bodies.MOON,
    Bodies.MERCURY,
    Bodies.VENUS,
    Bodies.MARS,
    Bodies.JUPITER,
    Bodies.SATURN,
    Bodies.URANUS,
    Bodies.NEPTUNE,
    Bodies.PLUTO,
    Bodies.NORTH_NODE,
]

/** The ten classical/modern planets — the node carries no element weight. */
export const WEIGHTED_BODIES: Body[] = BODY_ORDER.filter(
    (body) => body !== Bodies.NORTH_NODE,
)

export const AspectTypes = {
    CONJUNCTION: "conjunction",
    SEXTILE: "sextile",
    SQUARE: "square",
    TRINE: "trine",
    OPPOSITION: "opposition",
} as const

export type AspectType = (typeof AspectTypes)[keyof typeof AspectTypes]

/** Exact separation and the orb allowed before the aspect stops counting. */
export const ASPECT_ANGLES: Record<AspectType, { angle: number; orb: number }> =
    {
        [AspectTypes.CONJUNCTION]: { angle: 0, orb: 8 },
        [AspectTypes.SEXTILE]: { angle: 60, orb: 4 },
        [AspectTypes.SQUARE]: { angle: 90, orb: 7 },
        [AspectTypes.TRINE]: { angle: 120, orb: 7 },
        [AspectTypes.OPPOSITION]: { angle: 180, orb: 8 },
    }

/** Sun and Moon are read with a wider orb than the rest. */
export const LUMINARY_ORB_BONUS = 2

export const Elements = {
    FIRE: "fire",
    EARTH: "earth",
    AIR: "air",
    WATER: "water",
} as const

export type Element = (typeof Elements)[keyof typeof Elements]

export const Modalities = {
    CARDINAL: "cardinal",
    FIXED: "fixed",
    MUTABLE: "mutable",
} as const

export type Modality = (typeof Modalities)[keyof typeof Modalities]

export const HouseSystems = {
    PLACIDUS: "placidus",
    WHOLE_SIGN: "wholeSign",
} as const

export type HouseSystem = (typeof HouseSystems)[keyof typeof HouseSystems]

/** Zodiacal order — index is the 30° sector of ecliptic longitude. */
export const SIGN_ORDER: ZodiacSign[] = [
    ZodiacSigns.ARIES,
    ZodiacSigns.TAURUS,
    ZodiacSigns.GEMINI,
    ZodiacSigns.CANCER,
    ZodiacSigns.LEO,
    ZodiacSigns.VIRGO,
    ZodiacSigns.LIBRA,
    ZodiacSigns.SCORPIO,
    ZodiacSigns.SAGITTARIUS,
    ZodiacSigns.CAPRICORN,
    ZodiacSigns.AQUARIUS,
    ZodiacSigns.PISCES,
]

export const SIGN_ELEMENT: Record<ZodiacSign, Element> = {
    [ZodiacSigns.ARIES]: Elements.FIRE,
    [ZodiacSigns.TAURUS]: Elements.EARTH,
    [ZodiacSigns.GEMINI]: Elements.AIR,
    [ZodiacSigns.CANCER]: Elements.WATER,
    [ZodiacSigns.LEO]: Elements.FIRE,
    [ZodiacSigns.VIRGO]: Elements.EARTH,
    [ZodiacSigns.LIBRA]: Elements.AIR,
    [ZodiacSigns.SCORPIO]: Elements.WATER,
    [ZodiacSigns.SAGITTARIUS]: Elements.FIRE,
    [ZodiacSigns.CAPRICORN]: Elements.EARTH,
    [ZodiacSigns.AQUARIUS]: Elements.AIR,
    [ZodiacSigns.PISCES]: Elements.WATER,
}

export const SIGN_MODALITY: Record<ZodiacSign, Modality> = {
    [ZodiacSigns.ARIES]: Modalities.CARDINAL,
    [ZodiacSigns.TAURUS]: Modalities.FIXED,
    [ZodiacSigns.GEMINI]: Modalities.MUTABLE,
    [ZodiacSigns.CANCER]: Modalities.CARDINAL,
    [ZodiacSigns.LEO]: Modalities.FIXED,
    [ZodiacSigns.VIRGO]: Modalities.MUTABLE,
    [ZodiacSigns.LIBRA]: Modalities.CARDINAL,
    [ZodiacSigns.SCORPIO]: Modalities.FIXED,
    [ZodiacSigns.SAGITTARIUS]: Modalities.MUTABLE,
    [ZodiacSigns.CAPRICORN]: Modalities.CARDINAL,
    [ZodiacSigns.AQUARIUS]: Modalities.FIXED,
    [ZodiacSigns.PISCES]: Modalities.MUTABLE,
}

/** Modern rulerships — used for the "ruled by …" line. */
export const SIGN_RULER: Record<ZodiacSign, Body> = {
    [ZodiacSigns.ARIES]: Bodies.MARS,
    [ZodiacSigns.TAURUS]: Bodies.VENUS,
    [ZodiacSigns.GEMINI]: Bodies.MERCURY,
    [ZodiacSigns.CANCER]: Bodies.MOON,
    [ZodiacSigns.LEO]: Bodies.SUN,
    [ZodiacSigns.VIRGO]: Bodies.MERCURY,
    [ZodiacSigns.LIBRA]: Bodies.VENUS,
    [ZodiacSigns.SCORPIO]: Bodies.PLUTO,
    [ZodiacSigns.SAGITTARIUS]: Bodies.JUPITER,
    [ZodiacSigns.CAPRICORN]: Bodies.SATURN,
    [ZodiacSigns.AQUARIUS]: Bodies.URANUS,
    [ZodiacSigns.PISCES]: Bodies.NEPTUNE,
}

export const SupportedLanguages = {
    EN: "en",
} as const

export type Language =
    (typeof SupportedLanguages)[keyof typeof SupportedLanguages]

export const DEFAULT_LANGUAGE: Language = SupportedLanguages.EN

/** Used when a profile has no birth time on file. */
export const DEFAULT_BIRTH_TIME = "00:00"

/** Bodies that have their own authored line per sign. */
export const INTERPRETED_BODIES = [
    Bodies.MOON,
    Bodies.MERCURY,
    Bodies.VENUS,
    Bodies.MARS,
    Bodies.JUPITER,
    Bodies.SATURN,
    Bodies.NORTH_NODE,
] as const

export type InterpretedBody = (typeof INTERPRETED_BODIES)[number]

export const NumerologyNumbers = {
    LIFE_PATH: "lifePath",
    BIRTH: "birth",
    DESTINY: "destiny",
    SOUL_URGE: "soulUrge",
    PERSONALITY: "personality",
} as const

export type NumerologyNumber =
    (typeof NumerologyNumbers)[keyof typeof NumerologyNumbers]

export const NUMEROLOGY_ORDER: NumerologyNumber[] = [
    NumerologyNumbers.LIFE_PATH,
    NumerologyNumbers.BIRTH,
    NumerologyNumbers.DESTINY,
    NumerologyNumbers.SOUL_URGE,
    NumerologyNumbers.PERSONALITY,
]

/** 11, 22 and 33 are left unreduced; every other total collapses to 1–9. */
export const MASTER_NUMBERS = [11, 22, 33] as const

/** Every value a reduced number can take. */
export const NUMEROLOGY_VALUES = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33,
] as const

export type NumerologyValue = (typeof NUMEROLOGY_VALUES)[number]

/** 1 to 9, for the numbers that never keep a master form. */
export const DIGIT_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const

export type DigitValue = (typeof DIGIT_VALUES)[number]

/**
 * The first two pinnacles come from reduced date parts, so each tops out at 11.
 * The third is their sum, which makes 22 reachable. 33 is not, and unreachable
 * copy is copy nobody reads.
 */
export const PINNACLE_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22] as const

export type PinnacleValue = (typeof PINNACLE_VALUES)[number]

/** A challenge is the gap between two single digits, so 0 to 8. */
export const CHALLENGE_VALUES = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const

export type ChallengeValue = (typeof CHALLENGE_VALUES)[number]

/** Each pinnacle after the first runs nine years. */
export const CHAPTER_LENGTH = 9

/** The first pinnacle ends at 36 minus the Life Path, the usual Decoz rule. */
export const FIRST_CHAPTER_BASE = 36

// ------------------------------------------------------------------- tarot

export const TarotSpreads = {
    SINGLE: "single",
    THREE: "three",
    YES_NO: "yesNo",
} as const

export type TarotSpread = (typeof TarotSpreads)[keyof typeof TarotSpreads]

/** How many cards each spread turns. */
export const TAROT_SPREAD_SIZE: Record<TarotSpread, number> = {
    [TarotSpreads.SINGLE]: 1,
    [TarotSpreads.THREE]: 3,
    [TarotSpreads.YES_NO]: 1,
}

export const TarotSuits = {
    WANDS: "wands",
    CUPS: "cups",
    SWORDS: "swords",
    PENTACLES: "pentacles",
} as const

export type TarotSuit = (typeof TarotSuits)[keyof typeof TarotSuits]

export const TAROT_RANKS = [
    "ace",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "page",
    "knight",
    "queen",
    "king",
] as const

export type TarotRank = (typeof TAROT_RANKS)[number]

/** In the traditional order, 0 to 21. */
export const MAJOR_ARCANA = [
    "fool",
    "magician",
    "high-priestess",
    "empress",
    "emperor",
    "hierophant",
    "lovers",
    "chariot",
    "strength",
    "hermit",
    "wheel-of-fortune",
    "justice",
    "hanged-man",
    "death",
    "temperance",
    "devil",
    "tower",
    "star",
    "moon",
    "sun",
    "judgement",
    "world",
] as const

export type MajorArcanaId = (typeof MAJOR_ARCANA)[number]
export type MinorArcanaId = `${TarotSuit}-${TarotRank}`
export type TarotCardId = MajorArcanaId | MinorArcanaId

export type TarotCard =
    | { id: MajorArcanaId; arcana: "major"; number: number }
    | {
          id: MinorArcanaId
          arcana: "minor"
          suit: TarotSuit
          rank: TarotRank
          number: number
      }

/** All 78, majors first. Names and meanings live with the language copy. */
export const TAROT_DECK: readonly TarotCard[] = [
    ...MAJOR_ARCANA.map((id, number): TarotCard => ({
        id,
        arcana: "major",
        number,
    })),
    ...Object.values(TarotSuits).flatMap((suit) =>
        TAROT_RANKS.map((rank, index): TarotCard => ({
            id: `${suit}-${rank}`,
            arcana: "minor",
            suit,
            rank,
            number: index + 1,
        })),
    ),
]

/** Roughly a third of drawn cards land reversed. */
export const TAROT_REVERSED_IN = 3

// ---------------------------------------------------------------- transits

/** The window the timeline shows: three weeks back, five and a half ahead. */
export const TRANSIT_WINDOW_DAYS = 60
export const TRANSIT_TODAY_INDEX = 21

/** Days scanned either side of the window to find when an aspect is exact. */
export const TRANSIT_SEARCH_MARGIN = 45

/** "Within a degree": the orb at which a transit counts as active. */
export const TRANSIT_ORB = 1

/** At most this many events on the timeline, by significance. */
export const TRANSIT_MAX_EVENTS = 16
/**
 * Half the plate is kept for the quick movers (Sun to Mars, and lunations),
 * nearest today first; otherwise the slow planets, which are in orb for
 * weeks, would fill every slot and the day would not read as a day.
 */
export const TRANSIT_QUICK_SLOTS = 8
export const TRANSIT_QUICK_BODIES: TransitBody[] = [
    Bodies.SUN,
    Bodies.MERCURY,
    Bodies.VENUS,
    Bodies.MARS,
]

/** The Moon is too fast to plot; it appears only as a lunation. The Node is not a transit. */
export const TRANSIT_BODIES = [
    Bodies.SUN,
    Bodies.MERCURY,
    Bodies.VENUS,
    Bodies.MARS,
    Bodies.JUPITER,
    Bodies.SATURN,
    Bodies.URANUS,
    Bodies.NEPTUNE,
    Bodies.PLUTO,
] as const

export type TransitBody = (typeof TRANSIT_BODIES)[number]

export const Lunations = { NEW: "newMoon", FULL: "fullMoon" } as const
export type Lunation = (typeof Lunations)[keyof typeof Lunations]

export const NatalAngles = { ASC: "asc", MC: "mc" } as const
export type NatalPoint = Body | (typeof NatalAngles)[keyof typeof NatalAngles]

export const NATAL_POINTS: NatalPoint[] = [
    ...BODY_ORDER,
    NatalAngles.ASC,
    NatalAngles.MC,
]

/** Transits use the natal set plus the quincunx, which the design draws. */
export const TransitAspects = {
    ...AspectTypes,
    QUINCUNX: "quincunx",
} as const

export type TransitAspect = (typeof TransitAspects)[keyof typeof TransitAspects]

export const TRANSIT_ASPECT_ANGLES: Record<TransitAspect, number> = {
    [TransitAspects.CONJUNCTION]: 0,
    [TransitAspects.SEXTILE]: 60,
    [TransitAspects.SQUARE]: 90,
    [TransitAspects.TRINE]: 120,
    [TransitAspects.QUINCUNX]: 150,
    [TransitAspects.OPPOSITION]: 180,
}

export const TransitTones = {
    TENSE: "tense",
    FLOW: "flow",
    NEUTRAL: "neutral",
} as const

export type TransitTone = (typeof TransitTones)[keyof typeof TransitTones]

/** Which paragraph set an aspect reads from. Conjunctions get their own. */
export const TransitTextGroups = {
    FLOW: "flow",
    TENSE: "tense",
    CONJUNCTION: "conjunction",
} as const

export type TransitTextGroup =
    (typeof TransitTextGroups)[keyof typeof TransitTextGroups]

export const TRANSIT_ASPECT_GROUP: Record<TransitAspect, TransitTextGroup> = {
    [TransitAspects.CONJUNCTION]: TransitTextGroups.CONJUNCTION,
    [TransitAspects.SEXTILE]: TransitTextGroups.FLOW,
    [TransitAspects.TRINE]: TransitTextGroups.FLOW,
    [TransitAspects.SQUARE]: TransitTextGroups.TENSE,
    [TransitAspects.QUINCUNX]: TransitTextGroups.TENSE,
    [TransitAspects.OPPOSITION]: TransitTextGroups.TENSE,
}

/** How a conjunction feels depends on what is doing the conjoining. */
export const CONJUNCTION_TONE: Record<TransitBody, TransitTone> = {
    [Bodies.SUN]: TransitTones.FLOW,
    [Bodies.MERCURY]: TransitTones.NEUTRAL,
    [Bodies.VENUS]: TransitTones.FLOW,
    [Bodies.MARS]: TransitTones.TENSE,
    [Bodies.JUPITER]: TransitTones.FLOW,
    [Bodies.SATURN]: TransitTones.TENSE,
    [Bodies.URANUS]: TransitTones.TENSE,
    [Bodies.NEPTUNE]: TransitTones.TENSE,
    [Bodies.PLUTO]: TransitTones.TENSE,
}

/** Base significance 1 to 5; slow planets matter more. */
export const TRANSIT_BODY_WEIGHT: Record<TransitBody, number> = {
    [Bodies.SUN]: 2,
    [Bodies.MERCURY]: 2,
    [Bodies.VENUS]: 2,
    [Bodies.MARS]: 3,
    [Bodies.JUPITER]: 4,
    [Bodies.SATURN]: 5,
    [Bodies.URANUS]: 5,
    [Bodies.NEPTUNE]: 5,
    [Bodies.PLUTO]: 5,
}

/** A transit to these natal points gains a point of significance. */
export const PERSONAL_POINTS: NatalPoint[] = [
    Bodies.SUN,
    Bodies.MOON,
    NatalAngles.ASC,
    NatalAngles.MC,
]

/** Transits to these are generational, the same for everyone born that decade. */
export const GENERATIONAL_POINTS: NatalPoint[] = [
    Bodies.URANUS,
    Bodies.NEPTUNE,
    Bodies.PLUTO,
]

/** Mean daily motion, degrees, for calling a body fast or slow. */
export const MEAN_MOTION: Record<TransitBody, number> = {
    [Bodies.SUN]: 0.9856,
    [Bodies.MERCURY]: 1.383,
    [Bodies.VENUS]: 1.2,
    [Bodies.MARS]: 0.524,
    [Bodies.JUPITER]: 0.083,
    [Bodies.SATURN]: 0.0335,
    [Bodies.URANUS]: 0.0117,
    [Bodies.NEPTUNE]: 0.006,
    [Bodies.PLUTO]: 0.004,
}

/** Lunations are a moment, not a span, so they get a little more room. */
export const LUNATION_ORB = 1.5

// ---------------------------------------------------------------- synastry

/** The ten planets compared across two charts; the node stays out of it. */
export const SYNASTRY_BODIES: Body[] = WEIGHTED_BODIES

/** A contact to one of these carries full weight; to an outer planet, half. */
export const SYNASTRY_PERSONAL: Body[] = [
    Bodies.SUN,
    Bodies.MOON,
    Bodies.MERCURY,
    Bodies.VENUS,
    Bodies.MARS,
]

/** Tighter than a natal chart: two people, so twice the noise. */
export const SYNASTRY_ORBS: Record<AspectType, number> = {
    [AspectTypes.CONJUNCTION]: 8,
    [AspectTypes.SEXTILE]: 4,
    [AspectTypes.SQUARE]: 6,
    [AspectTypes.TRINE]: 6,
    [AspectTypes.OPPOSITION]: 8,
}

/** The widest orb above; contacts are ranked by how far inside it they sit. */
export const SYNASTRY_MAX_ORB = 8

/** Within a degree counts as exact. */
export const SYNASTRY_EXACT_ORB = 1

/** Rows in the "strongest cross-aspects" list. */
export const SYNASTRY_TOP = 5

/** Contacts a section reads at most; the rest stay in the wheel. */
export const SYNASTRY_SECTION_CONTACTS = 2

export const SynastrySections = {
    EMOTIONAL: "emotional",
    ATTRACTION: "attraction",
    COMMUNICATION: "communication",
    LONG_TERM: "longTerm",
} as const
export type SynastrySection =
    (typeof SynastrySections)[keyof typeof SynastrySections]

export const SYNASTRY_SECTION_ORDER: SynastrySection[] = [
    SynastrySections.EMOTIONAL,
    SynastrySections.ATTRACTION,
    SynastrySections.COMMUNICATION,
    SynastrySections.LONG_TERM,
]

/**
 * Which pairs of bodies each section reads, most telling first. "moon-sun"
 * matches one person's Moon to the other's Sun either way round; the copy
 * names the Moon's owner {x} and the Sun's owner {y}.
 */
export const SYNASTRY_PAIRS = {
    [SynastrySections.EMOTIONAL]: ["moon-sun", "moon-moon", "moon-venus"],
    [SynastrySections.ATTRACTION]: [
        "venus-mars",
        "mars-mars",
        "venus-sun",
        "venus-venus",
    ],
    [SynastrySections.COMMUNICATION]: [
        "mercury-mercury",
        "mercury-sun",
        "mercury-moon",
        "mercury-jupiter",
        "mercury-saturn",
        "mercury-uranus",
    ],
    [SynastrySections.LONG_TERM]: [
        "saturn-sun",
        "saturn-moon",
        "saturn-venus",
        "saturn-saturn",
        "sun-jupiter",
        "sun-sun",
    ],
} as const satisfies Record<SynastrySection, readonly `${Body}-${Body}`[]>

export type SynastryPairKey<S extends SynastrySection> =
    (typeof SYNASTRY_PAIRS)[S][number]

/** Where one person's Moon and Sun fall in the other's houses; read in these sections. */
export const SYNASTRY_HOUSE_POINTS: Record<
    typeof SynastrySections.EMOTIONAL | typeof SynastrySections.LONG_TERM,
    Body
> = {
    [SynastrySections.EMOTIONAL]: Bodies.MOON,
    [SynastrySections.LONG_TERM]: Bodies.SUN,
}

/** The gauge's four bands, low to high. */
export const SynastryBands = {
    STRAINED: "strained",
    WORKABLE: "workable",
    WARM: "warm",
    RARE: "rare",
} as const
export type SynastryBand = (typeof SynastryBands)[keyof typeof SynastryBands]
export const SYNASTRY_BAND_ORDER: SynastryBand[] = [
    SynastryBands.STRAINED,
    SynastryBands.WORKABLE,
    SynastryBands.WARM,
    SynastryBands.RARE,
]

/** Section scores run 1 to 5, starting from the middle. */
export const SYNASTRY_SCORE_BASE = 3

// --------------------------------------------------------------- horoscope

export const HoroscopePeriods = {
    DAILY: "daily",
    WEEKLY: "weekly",
    YEARLY: "yearly",
} as const
export type HoroscopePeriod =
    (typeof HoroscopePeriods)[keyof typeof HoroscopePeriods]
export const HOROSCOPE_PERIOD_ORDER: HoroscopePeriod[] = [
    HoroscopePeriods.DAILY,
    HoroscopePeriods.WEEKLY,
    HoroscopePeriods.YEARLY,
]

export const HoroscopeCategories = {
    PERSONAL: "personal",
    PROFESSION: "profession",
    EMOTIONS: "emotions",
    HEALTH: "health",
    TRAVEL: "travel",
    LUCK: "luck",
} as const
export type HoroscopeCategory =
    (typeof HoroscopeCategories)[keyof typeof HoroscopeCategories]
export const HOROSCOPE_CATEGORY_ORDER: HoroscopeCategory[] = [
    HoroscopeCategories.PERSONAL,
    HoroscopeCategories.PROFESSION,
    HoroscopeCategories.EMOTIONS,
    HoroscopeCategories.HEALTH,
    HoroscopeCategories.TRAVEL,
    HoroscopeCategories.LUCK,
]

/**
 * A sun-sign reading places every transiting planet in a solar house: the
 * sign itself is the first house, the next sign the second, and so on. The
 * house then tells you the whole-sign aspect to the sign.
 */
export const QUIET_RELATION = "quiet"
export type SignRelation = AspectType | typeof QUIET_RELATION
export const SIGN_RELATION_ORDER: SignRelation[] = [
    AspectTypes.CONJUNCTION,
    AspectTypes.SEXTILE,
    AspectTypes.SQUARE,
    AspectTypes.TRINE,
    AspectTypes.OPPOSITION,
    QUIET_RELATION,
]
export const HOUSE_RELATION: Record<number, SignRelation> = {
    1: AspectTypes.CONJUNCTION,
    2: QUIET_RELATION,
    3: AspectTypes.SEXTILE,
    4: AspectTypes.SQUARE,
    5: AspectTypes.TRINE,
    6: QUIET_RELATION,
    7: AspectTypes.OPPOSITION,
    8: QUIET_RELATION,
    9: AspectTypes.TRINE,
    10: AspectTypes.SQUARE,
    11: AspectTypes.SEXTILE,
    12: QUIET_RELATION,
}

/** The planets whose exact aspects make the day's sky notes; the Moon is listed separately. */
export const HOROSCOPE_SKY_BODIES: Body[] = [
    Bodies.SUN,
    Bodies.MERCURY,
    Bodies.VENUS,
    Bodies.MARS,
    Bodies.JUPITER,
    Bodies.SATURN,
]
export const HOROSCOPE_ALL_BODIES: Body[] = WEIGHTED_BODIES
/** An aspect counts as "in the sky today" within this many degrees. */
export const HOROSCOPE_SKY_ORB = 1
export const HOROSCOPE_MOON_ORB = 3
/** Slower than this, in degrees a day, and a planet is called stationary. */
export const HOROSCOPE_STATION_SPEED = 0.01
/** Sky notes shown under the reading. */
export const HOROSCOPE_MAX_NOTES = 4

/**
 * Which planet each category listens to, most telling first. The first with
 * a real angle to the sign leads; if none has one, the first one does.
 */
export const HOROSCOPE_LEADS: Record<
    HoroscopePeriod,
    Record<HoroscopeCategory, Body[]>
> = {
    [HoroscopePeriods.DAILY]: {
        [HoroscopeCategories.PERSONAL]: [
            Bodies.VENUS,
            Bodies.MOON,
            Bodies.MARS,
            Bodies.SUN,
        ],
        [HoroscopeCategories.PROFESSION]: [
            Bodies.MARS,
            Bodies.SATURN,
            Bodies.SUN,
            Bodies.MERCURY,
        ],
        [HoroscopeCategories.EMOTIONS]: [
            Bodies.MOON,
            Bodies.VENUS,
            Bodies.MARS,
        ],
        [HoroscopeCategories.HEALTH]: [
            Bodies.MARS,
            Bodies.SATURN,
            Bodies.SUN,
            Bodies.MOON,
        ],
        [HoroscopeCategories.TRAVEL]: [
            Bodies.MERCURY,
            Bodies.JUPITER,
            Bodies.MARS,
            Bodies.MOON,
        ],
        [HoroscopeCategories.LUCK]: [
            Bodies.JUPITER,
            Bodies.VENUS,
            Bodies.SUN,
            Bodies.MOON,
        ],
    },
    [HoroscopePeriods.WEEKLY]: {
        [HoroscopeCategories.PERSONAL]: [
            Bodies.VENUS,
            Bodies.MARS,
            Bodies.SUN,
            Bodies.MERCURY,
        ],
        [HoroscopeCategories.PROFESSION]: [
            Bodies.MARS,
            Bodies.SATURN,
            Bodies.SUN,
            Bodies.MERCURY,
        ],
        [HoroscopeCategories.EMOTIONS]: [Bodies.VENUS, Bodies.MARS, Bodies.SUN],
        [HoroscopeCategories.HEALTH]: [Bodies.MARS, Bodies.SATURN, Bodies.SUN],
        [HoroscopeCategories.TRAVEL]: [
            Bodies.MERCURY,
            Bodies.JUPITER,
            Bodies.MARS,
        ],
        [HoroscopeCategories.LUCK]: [Bodies.JUPITER, Bodies.VENUS, Bodies.SUN],
    },
    // Jupiter and Saturn make a year; an outer planet leads only when it has a real angle
    [HoroscopePeriods.YEARLY]: {
        [HoroscopeCategories.PERSONAL]: [
            Bodies.JUPITER,
            Bodies.SATURN,
            Bodies.NEPTUNE,
        ],
        [HoroscopeCategories.PROFESSION]: [
            Bodies.SATURN,
            Bodies.JUPITER,
            Bodies.PLUTO,
        ],
        [HoroscopeCategories.EMOTIONS]: [
            Bodies.JUPITER,
            Bodies.SATURN,
            Bodies.NEPTUNE,
            Bodies.PLUTO,
        ],
        [HoroscopeCategories.HEALTH]: [
            Bodies.SATURN,
            Bodies.JUPITER,
            Bodies.URANUS,
        ],
        [HoroscopeCategories.TRAVEL]: [
            Bodies.JUPITER,
            Bodies.SATURN,
            Bodies.URANUS,
        ],
        [HoroscopeCategories.LUCK]: [
            Bodies.JUPITER,
            Bodies.SATURN,
            Bodies.URANUS,
        ],
    },
}

/** The planet whose angle to the sign sets the headline for each period. */
export const HOROSCOPE_HEADLINE_LEAD: Record<HoroscopePeriod, Body[]> = {
    [HoroscopePeriods.DAILY]: [Bodies.MOON],
    [HoroscopePeriods.WEEKLY]: [
        Bodies.VENUS,
        Bodies.MARS,
        Bodies.SUN,
        Bodies.MERCURY,
    ],
    [HoroscopePeriods.YEARLY]: [Bodies.JUPITER, Bodies.SATURN],
}

/** Category scores run 1 to 5 from the middle; easy angles lift, hard ones press. */
export const HOROSCOPE_SCORE_BASE = 3
/** Planets whose conjunction to the sign is a gift rather than a demand. */
export const HOROSCOPE_BENEFICS: Body[] = [
    Bodies.VENUS,
    Bodies.JUPITER,
    Bodies.SUN,
    Bodies.MERCURY,
    Bodies.MOON,
]
export const HOROSCOPE_MALEFICS: Body[] = [
    Bodies.MARS,
    Bodies.SATURN,
    Bodies.PLUTO,
]

export const MoonPhases = {
    NEW: "newMoon",
    WAXING_CRESCENT: "waxingCrescent",
    FIRST_QUARTER: "firstQuarter",
    WAXING_GIBBOUS: "waxingGibbous",
    FULL: "fullMoon",
    WANING_GIBBOUS: "waningGibbous",
    LAST_QUARTER: "lastQuarter",
    WANING_CRESCENT: "waningCrescent",
} as const
export type MoonPhase = (typeof MoonPhases)[keyof typeof MoonPhases]
/** In order around the month, 45° of elongation each. */
export const MOON_PHASE_ORDER: MoonPhase[] = [
    MoonPhases.NEW,
    MoonPhases.WAXING_CRESCENT,
    MoonPhases.FIRST_QUARTER,
    MoonPhases.WAXING_GIBBOUS,
    MoonPhases.FULL,
    MoonPhases.WANING_GIBBOUS,
    MoonPhases.LAST_QUARTER,
    MoonPhases.WANING_CRESCENT,
]

/** The day's colour follows the sign the Moon is in. */
export const SIGN_COLOUR_HEX: Record<ZodiacSign, string> = {
    [ZodiacSigns.ARIES]: "#7A2E2E",
    [ZodiacSigns.TAURUS]: "#4F6B3A",
    [ZodiacSigns.GEMINI]: "#C9A227",
    [ZodiacSigns.CANCER]: "#E8E4DA",
    [ZodiacSigns.LEO]: "#B4933F",
    [ZodiacSigns.VIRGO]: "#6B7A8F",
    [ZodiacSigns.LIBRA]: "#C58A9A",
    [ZodiacSigns.SCORPIO]: "#5B3A5E",
    [ZodiacSigns.SAGITTARIUS]: "#3F4F8A",
    [ZodiacSigns.CAPRICORN]: "#4A4E57",
    [ZodiacSigns.AQUARIUS]: "#5F8B7A",
    [ZodiacSigns.PISCES]: "#8FB3A9",
}

/** Mood bands along the dial, low to high. */
export const MoodBands = {
    HEAVY: "heavy",
    LEVEL: "level",
    STEADY: "steady",
    BRIGHT: "bright",
} as const
export type MoodBand = (typeof MoodBands)[keyof typeof MoodBands]
export const MOOD_BAND_ORDER: MoodBand[] = [
    MoodBands.HEAVY,
    MoodBands.LEVEL,
    MoodBands.STEADY,
    MoodBands.BRIGHT,
]
