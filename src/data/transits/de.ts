import {
    Bodies,
    Lunations,
    NatalAngles,
    SupportedLanguages,
    TransitAspects,
    TransitTextGroups,
    TransitTones,
    ZodiacSigns,
} from "../../constants/index.ts"
import type { TransitCopy } from "../../types/index.ts"

/**
 * German transit copy. Translation of en.ts: same keys, same {placeholders}.
 */
const de: TransitCopy = {
    lang: SupportedLanguages.DE,

    labels: {
        timeline: "Zeitachse",
        activeToday: "Heute aktiv",
        activeOn: "Aktiv am {date}",
        bySignificance: "nach Bedeutung",
        transiting: "Transit",
        natal: "Geburt",
        orb: "Orbis",
        exact: "Exakt",
        quiet: "Ein ruhiger Himmel. An diesem Tag keine wichtigen Aspekte innerhalb eines Grades.",
        select: "Wähle eine Markierung auf der Zeitachse, um diesen Transit zu lesen.",
        backToToday: "Zurück zu heute",
        headlineToday: "Was der Himmel heute mit deinem Horoskop macht.",
        lookingBackOne: "1 Tag zurück.",
        lookingBackMany: "{n} Tage zurück.",
        lookingAheadOne: "1 Tag voraus.",
        lookingAheadMany: "{n} Tage voraus.",
    },

    tones: {
        [TransitTones.TENSE]: "Fordernd",
        [TransitTones.FLOW]: "Unterstützend",
        [TransitTones.NEUTRAL]: "Neutral",
    },

    aspects: {
        [TransitAspects.CONJUNCTION]: { name: "Konjunktion", glyph: "☌" },
        [TransitAspects.SEXTILE]: { name: "Sextil", glyph: "⚹" },
        [TransitAspects.SQUARE]: { name: "Quadrat", glyph: "□" },
        [TransitAspects.TRINE]: { name: "Trigon", glyph: "△" },
        [TransitAspects.QUINCUNX]: { name: "Quinkunx", glyph: "⚻" },
        [TransitAspects.OPPOSITION]: { name: "Opposition", glyph: "☍" },
    },

    title: "{transit} {aspect} {natal}",

    signs: {
        [ZodiacSigns.ARIES]: "Widder",
        [ZodiacSigns.TAURUS]: "Stier",
        [ZodiacSigns.GEMINI]: "Zwillinge",
        [ZodiacSigns.CANCER]: "Krebs",
        [ZodiacSigns.LEO]: "Löwe",
        [ZodiacSigns.VIRGO]: "Jungfrau",
        [ZodiacSigns.LIBRA]: "Waage",
        [ZodiacSigns.SCORPIO]: "Skorpion",
        [ZodiacSigns.SAGITTARIUS]: "Schütze",
        [ZodiacSigns.CAPRICORN]: "Steinbock",
        [ZodiacSigns.AQUARIUS]: "Wassermann",
        [ZodiacSigns.PISCES]: "Fische",
    },

    points: {
        [Bodies.SUN]: "Sonne",
        [Bodies.MOON]: "Mond",
        [Bodies.MERCURY]: "Merkur",
        [Bodies.VENUS]: "Venus",
        [Bodies.MARS]: "Mars",
        [Bodies.JUPITER]: "Jupiter",
        [Bodies.SATURN]: "Saturn",
        [Bodies.URANUS]: "Uranus",
        [Bodies.NEPTUNE]: "Neptun",
        [Bodies.PLUTO]: "Pluto",
        [Bodies.NORTH_NODE]: "Nordknoten",
        [NatalAngles.ASC]: "Aszendent",
        [NatalAngles.MC]: "Medium Coeli",
    },

    lunations: {
        [Lunations.NEW]: "Neumond",
        [Lunations.FULL]: "Vollmond",
    },

    motion: {
        retrograde: "Rückläufig",
        direct: "Direktläufig",
        slow: "langsam",
        fast: "schnell",
        lunation: "Lunation",
        joiner: " · ",
    },

    ledes: {
        [Bodies.SUN]: {
            [TransitAspects.CONJUNCTION]: "Ein Licht auf die Sache selbst.",
            [TransitAspects.SEXTILE]: "Eine kleine Öffnung, leicht zu nutzen.",
            [TransitAspects.SQUARE]: "Ein Tag, der dir zeigt, wo es reibt.",
            [TransitAspects.TRINE]:
                "Die Dinge fügen sich, ohne dass du schiebst.",
            [TransitAspects.QUINCUNX]:
                "Zwei Teile des Tages, die nicht ganz zusammenpassen.",
            [TransitAspects.OPPOSITION]: "Ein Blick zurück auf den Weg.",
        },
        [Bodies.MERCURY]: {
            [TransitAspects.CONJUNCTION]:
                "Die Worte kommen, und sie sitzen genau.",
            [TransitAspects.SEXTILE]:
                "Ein Gespräch, das besser läuft als erwartet.",
            [TransitAspects.SQUARE]:
                "Eine kleine Reibung zwischen dem, wie du klingst, und dem, was du meinst.",
            [TransitAspects.TRINE]:
                "Sag es jetzt, solange es richtig rauskommt.",
            [TransitAspects.QUINCUNX]:
                "Etwas geht bei der Übersetzung verloren.",
            [TransitAspects.OPPOSITION]:
                "Jemand hört das Gegenteil von dem, was du gesagt hast.",
        },
        [Bodies.VENUS]: {
            [TransitAspects.CONJUNCTION]: "Weicher als sonst, und besser so.",
            [TransitAspects.SEXTILE]:
                "Eine schöne Gelegenheit, wenn du sie ergreifst.",
            [TransitAspects.SQUARE]: "Die Sache wollen und ihren Preis kennen.",
            [TransitAspects.TRINE]:
                "Leichte Gesellschaft, sicherer Geschmack, lockeres Geld.",
            [TransitAspects.QUINCUNX]:
                "Etwas, das du magst, ist leise fehl am Platz.",
            [TransitAspects.OPPOSITION]:
                "Wessen Vorstellung von schön ist das?",
        },
        [Bodies.MARS]: {
            [TransitAspects.CONJUNCTION]: "Hitze, direkt angewandt.",
            [TransitAspects.SEXTILE]: "Energie, die ein Ziel hat.",
            [TransitAspects.SQUARE]: "Scharfe Worte kommen fix und fertig an.",
            [TransitAspects.TRINE]: "Antrieb, der gegen nichts ankämpfen muss.",
            [TransitAspects.QUINCUNX]:
                "Mühe in eine Richtung, die sich nicht ganz lohnt.",
            [TransitAspects.OPPOSITION]:
                "Jemand drängt, und du drängst zurück.",
        },
        [Bodies.JUPITER]: {
            [TransitAspects.CONJUNCTION]: "Mehr davon, alles auf einmal.",
            [TransitAspects.SEXTILE]: "Raum, mehr zu fühlen als sonst.",
            [TransitAspects.SQUARE]: "Kurz zu viel des Guten.",
            [TransitAspects.TRINE]:
                "Glück, das sehr nach gutem Timing aussieht.",
            [TransitAspects.QUINCUNX]: "Großzügigkeit, leicht danebengezielt.",
            [TransitAspects.OPPOSITION]:
                "Ein großes Angebot, und das Kleingedruckte.",
        },
        [Bodies.SATURN]: {
            [TransitAspects.CONJUNCTION]: "Die lange Korrektur.",
            [TransitAspects.SEXTILE]:
                "Eine leise Chance, etwas Bleibendes zu bauen.",
            [TransitAspects.SQUARE]: "Die Wand, auf die du zugelaufen bist.",
            [TransitAspects.TRINE]: "Mühe, die endlich trägt.",
            [TransitAspects.QUINCUNX]:
                "Eine Pflicht, die nicht zum Leben drumherum passt.",
            [TransitAspects.OPPOSITION]:
                "Die Regeln anderer, aus nächster Nähe.",
        },
        [Bodies.URANUS]: {
            [TransitAspects.CONJUNCTION]: "Der Boden bewegt sich.",
            [TransitAspects.SEXTILE]:
                "Eine Tür, von der du nicht wusstest, dass es sie gibt.",
            [TransitAspects.SQUARE]:
                "Der Drang, etwas kaputt zu machen, das nicht kaputt ist.",
            [TransitAspects.TRINE]:
                "Veränderung, die sich wie Erleichterung anfühlt.",
            [TransitAspects.QUINCUNX]:
                "Unruhig, ohne dass du sagen könntest, warum.",
            [TransitAspects.OPPOSITION]:
                "Jemand ändert die Bedingungen, ohne zu fragen.",
        },
        [Bodies.NEPTUNE]: {
            [TransitAspects.CONJUNCTION]: "Die Ränder werden weich.",
            [TransitAspects.SEXTILE]: "Eine sanfte Unschärfe, die hilft.",
            [TransitAspects.SQUARE]:
                "Die Geschichte, die du dir selbst erzählst.",
            [TransitAspects.TRINE]: "Vertrauen, das leise ankommt.",
            [TransitAspects.QUINCUNX]:
                "Ein vages Unbehagen, das sich nicht auflöst.",
            [TransitAspects.OPPOSITION]:
                "Jemand ist nicht der, für den du ihn gehalten hast.",
        },
        [Bodies.PLUTO]: {
            [TransitAspects.CONJUNCTION]: "Bis auf die Grundmauern.",
            [TransitAspects.SEXTILE]:
                "Macht, die du ausnahmsweise nutzen kannst.",
            [TransitAspects.SQUARE]: "Was du dich weigerst loszulassen.",
            [TransitAspects.TRINE]: "Stärke aus einer tiefen Quelle.",
            [TransitAspects.QUINCUNX]: "Ein Druck ohne erkennbare Ursache.",
            [TransitAspects.OPPOSITION]: "Ein Kräftemessen, und kein kleines.",
        },
    },

    texts: {
        [Bodies.SUN]: {
            [TransitTextGroups.CONJUNCTION]:
                "Einmal im Jahr überquert die Sonne diesen Punkt in deinem Horoskop und beleuchtet ihn. Wofür er steht, bekommt Aufmerksamkeit, Energie und ein bisschen mehr von dir als sonst. Weniger ein Wendepunkt als ein Kontrollpunkt: Schau, was hier ist, und gib ihm einen Tag.",
            [TransitTextGroups.FLOW]:
                "Ein, zwei Tage leichter Übereinstimmung. Nichts Dramatisches, nur das Gefühl, dass die Sache ohne Mühe funktioniert. Nutze sie für alles, was einen klaren Kopf und eine ruhige Hand braucht, denn beides ist da.",
            [TransitTextGroups.TENSE]:
                "Kurz und vorübergehend, und ein nützlicher Reiz. Für etwa einen Tag siehst du deutlich, wo du und dieser Teil deines Lebens nicht an einem Strang ziehen. Reagier nicht über. Merk dir, was es dir zeigt, und lass es weiterziehen.",
        },
        [Bodies.MERCURY]: {
            [TransitTextGroups.CONJUNCTION]:
                "Merkur steht ein, zwei Tage auf diesem Punkt, und dein Denken darüber wird schärfer. Gespräche, Nachrichten und Entscheidungen, die damit zu tun haben, fallen leicht. Schreib es auf, solange die Worte so klar sind.",
            [TransitTextGroups.FLOW]:
                "Die Kommunikation läuft hier ein, zwei Tage lang rund. Sag das Schwierige, schick die E-Mail, stell die Frage. Du wirst beim ersten Mal verstanden, und das ist seltener, als es klingt.",
            [TransitTextGroups.TENSE]:
                "Kurz und vorübergehend. Diese Woche wirst du vielleicht ein-, zweimal missverstanden, meist als schärfer, als du es gemeint hast, oder du verstehst jemand anderen falsch. Ein Satz mehr Kontext, und das Problem löst sich auf.",
        },
        [Bodies.VENUS]: {
            [TransitTextGroups.CONJUNCTION]:
                "Venus ruht ein paar Tage auf diesem Punkt, und wofür er steht, wird wärmer, schöner und leichter zu genießen. Eine gute Zeit, die Sache zu kaufen, den Tisch zu reservieren oder dem Menschen zu verzeihen.",
            [TransitTextGroups.FLOW]:
                "Ein paar angenehme Tage. Menschen sind umgänglicher, das Geld sitzt etwas lockerer, und auf deinen Geschmack ist Verlass. Hier musst du nichts hinterherjagen. Nimm an, was dir angeboten wird, und genieß es, ohne nach dem Haken zu suchen.",
            [TransitTextGroups.TENSE]:
                "Eine kurze Spannung zwischen dem, was du willst, und dem, was es kostet, oder zwischen deiner Vorstellung von einem schönen Abend und der von jemand anderem. Nichts Ernstes. Gönn dir ein bisschen, hör dann auf und lass dich nicht wegen eines netten Abends auf etwas ein.",
        },
        [Bodies.MARS]: {
            [TransitTextGroups.CONJUNCTION]:
                "Mars steht ein paar Tage auf diesem Punkt, und alles, was er berührt, läuft heißer. Deine Energie steigt, deine Geduld sinkt, und Entscheidungen fallen schnell und unverblümt. Großartig, um Dinge anzufangen, gefährlich für Gruppenchats. Schreib die Nachricht vor und schick die wichtige erst morgen.",
            [TransitTextGroups.FLOW]:
                "Ein paar Tage nutzbare Energie ohne Widerstand. Was du aufgeschoben hast, weil es sich nach Kampf anfühlte, ist diese Woche keiner. Fang jetzt an, und du kommst weiter, als du denkst.",
            [TransitTextGroups.TENSE]:
                "Ein paar Tage Reibung. Etwas drängt, du drängst zurück, und im Streit, der folgt, geht es selten um das, worum es zu gehen scheint. Beweg deinen Körper, hüte deine Zunge und triff im Ärger keine endgültige Entscheidung.",
        },
        [Bodies.JUPITER]: {
            [TransitTextGroups.CONJUNCTION]:
                "Jupiter steht ein paar Wochen auf diesem Punkt und macht ihn größer: mehr Chancen, mehr Selbstvertrauen, mehr Appetit. Sag Ja zu dem, was kommt, aber prüf, wie groß der Bissen ist. Jupiter vergrößert alles, auch die Fehler.",
            [TransitTextGroups.FLOW]:
                "Jupiter öffnet hier für ein, zwei Wochen die Blende. Kleine gute Dinge wirken größer, Hilfe kommt, wenn du darum bittest, und die sonst vorsichtige Version von dir ist bereit, zuerst großzügig zu sein. Nutze das Fenster, um das Warme zu sagen, das du sonst für dich behältst.",
            [TransitTextGroups.TENSE]:
                "Kurz zu viel. Übermut, zu viel ausgeben, zu viel versprechen, der große Plan, der den langweiligen Teil überspringt. Jupiter in einem harten Aspekt bringt kein Pech, er macht nachlässig. Genieß den Optimismus und halbiere die Schätzung.",
        },
        [Bodies.SATURN]: {
            [TransitTextGroups.CONJUNCTION]:
                "Saturn verbringt Wochen, manchmal Monate, innerhalb eines Grades von diesem Punkt. Das ist keine Krise, sondern eine Prüfung. Wo du dich auf dein Talent verlassen hast, verlangt er Struktur; wo du dich überarbeitet hast, fragt er nach dem Warum. Was Saturn übersteht, ist das, was du wirklich gemeint hast.",
            [TransitTextGroups.FLOW]:
                "Eine lange, ruhige Chance, etwas Solides zu schaffen. Saturn in einem leichten Aspekt schenkt dir nichts, aber er belohnt Mühe fast zu einem fairen Kurs, und das ist mehr, als die meisten Monate bieten. Bau jetzt das Langweilige. Es wird in zehn Jahren noch stehen.",
            [TransitTextGroups.TENSE]:
                "Saturn bleibt wochenlang hier, und der Druck ist eher stetig als scharf. Etwas wird geprüft: eine Verpflichtung, eine Struktur, eine Art, Dinge zu tun, von der du dachtest, sie hält. Sie hält, wenn sie echt war. Wenn nicht, findest du es jetzt heraus, und genau das ist das Geschenk.",
        },
        [Bodies.URANUS]: {
            [TransitTextGroups.CONJUNCTION]:
                "Uranus steht fast ein ganzes Jahr auf diesem Punkt, und er hält nicht still. Rechne mit dem Unerwarteten in allem, wofür dieser Punkt steht: eine plötzliche Veränderung, ein plötzlicher Drang, selbst etwas zu ändern. Wehr dich nicht gegen alles. Entscheide aber, welche Teile davon deine sind.",
            [TransitTextGroups.FLOW]:
                "Eine lange Phase, in der Veränderung als Erleichterung kommt statt als Schock. Etwas, das festsaß, löst sich von selbst, und neue Möglichkeiten tauchen dort auf, wo früher Wände waren. Sag Ja zu der ungewöhnlichen Einladung.",
            [TransitTextGroups.TENSE]:
                "Monate der Unruhe, gerichtet auf das, wofür dieser Punkt steht. Du wirst es zerbrechen, verlassen oder auf den Kopf stellen wollen, und ein Teil dieses Drangs hat recht. Trenne das echte Bedürfnis nach Veränderung vom bloßen Jucken und handle nur nach dem Ersten.",
        },
        [Bodies.NEPTUNE]: {
            [TransitTextGroups.CONJUNCTION]:
                "Neptun verbringt ein Jahr oder länger auf diesem Punkt, und solange er dort ist, werden die Ränder dieses Lebensbereichs weich. Grenzen verschwimmen, Ideale wachsen, und es wird schwer, Inspiration von Wunschdenken zu unterscheiden. Halte einen Freund in der Nähe, der dir die Wahrheit sagt, und unterschreib nichts, was du nicht bei Tageslicht lesen kannst.",
            [TransitTextGroups.FLOW]:
                "Ein langer, sanfter Transit, der allem, was er berührt, Fantasie und Mitgefühl verleiht. Vertrauen fällt hier leicht, Vergebung auch. Eine gute Zeit für Kunst, Gebet, Ruhe und dafür, Menschen einen Vertrauensvorschuss zu geben.",
            [TransitTextGroups.TENSE]:
                "Monate leichten Nebels um diesen Lebensbereich. Keine Katastrophe, aber Verwirrung: eine Geschichte, die du dir immer wieder erzählst, eine Hoffnung, die den Belegen davonläuft, eine Flucht, die zur Gewohnheit geworden ist. Der Ausweg ist unspektakulär. Stell einfache Fragen und schreib die Antworten auf.",
        },
        [Bodies.PLUTO]: {
            [TransitTextGroups.CONJUNCTION]:
                "Pluto steht jahrelang auf diesem Punkt, und er lässt nichts so, wie er es vorgefunden hat. Wofür dieser Punkt steht, wird bis auf die Grundmauern abgetragen und neu aufgebaut, ob du darum gebeten hast oder nicht. Es geht langsam, es geht ganz, und was auf der anderen Seite herauskommt, ist stärker als das, was hineinging.",
            [TransitTextGroups.FLOW]:
                "Ein langer Transit, der dir leise echte Macht über diesen Teil deines Lebens gibt. Tiefe, Fokus und die Fähigkeit, etwas an der Wurzel zu verändern. Nutze sie bewusst, denn ein Pluto, der aus Versehen wirkt, ist schwerer, als er sein müsste.",
            [TransitTextGroups.TENSE]:
                "Jahre des Drucks auf das, wofür dieser Punkt steht, und der Druck zielt auf das, was du nicht loslassen willst. Kontrolle, eine alte Identität, eine Geschichte darüber, wie die Dinge sein müssen. Pluto verhandelt nicht. Je früher du loslässt, was ohnehin schon vorbei ist, desto früher lässt der Druck nach.",
        },
    },

    lunationLedes: {
        [Lunations.NEW]: {
            [TransitAspects.CONJUNCTION]: "Ein sauberer Neuanfang, genau hier.",
            [TransitAspects.SEXTILE]: "Ein kleiner Samen, gut gesetzt.",
            [TransitAspects.SQUARE]: "Ein Anfang mit einem Hindernis im Weg.",
            [TransitAspects.TRINE]:
                "Ein Start, der von selbst Wurzeln schlägt.",
            [TransitAspects.QUINCUNX]:
                "Etwas Neues, das nicht zum alten Plan passt.",
            [TransitAspects.OPPOSITION]:
                "Ein Anfang, der fragt, was du beendest.",
        },
        [Lunations.FULL]: {
            [TransitAspects.CONJUNCTION]: "Alles daran kommt ans Licht.",
            [TransitAspects.SEXTILE]: "Eine helle Nacht, leicht zu nutzen.",
            [TransitAspects.SQUARE]:
                "Eine Nacht, in der die Spannung sichtbar wird.",
            [TransitAspects.TRINE]: "Fülle ohne Anstrengung.",
            [TransitAspects.QUINCUNX]:
                "Etwas ist vollendet und trotzdem unruhig.",
            [TransitAspects.OPPOSITION]:
                "Zwei Seiten deines Lebens ziehen eine Nacht lang in entgegengesetzte Richtungen.",
        },
    },

    lunationTexts: {
        [Lunations.NEW]: {
            [TransitTextGroups.CONJUNCTION]:
                "Der Neumond fällt genau auf diesen Punkt und macht ihn zur Startlinie des Monats für alles, wofür er steht. Absichten, die du in den nächsten zwei Tagen setzt, tragen ungewöhnlich weit. Halte sie klein und konkret.",
            [TransitTextGroups.FLOW]:
                "Ein Neumond in leichtem Aspekt hier: Für diesen Teil deines Lebens beginnt ein sanfter, monatelanger Zyklus mit Rückenwind. Nichts muss erzwungen werden. Entscheide, was du willst, und lass es wachsen.",
            [TransitTextGroups.TENSE]:
                "Ein Neumond in hartem Aspekt zu diesem Punkt beginnt einen Monat mit einem Haken. Etwas in diesem Teil deines Lebens will anfangen, und etwas anderes steht im Weg. Benenne das Hindernis in der ersten Woche, dann läuft der Monat besser.",
        },
        [Lunations.FULL]: {
            [TransitTextGroups.CONJUNCTION]:
                "Der Vollmond landet auf diesem Punkt und beleuchtet ihn ganz. Was sich hier zwei Wochen lang aufgebaut hat, spitzt sich zu, meist an einem einzigen Abend. Lass es sichtbar werden, und lass den Abend danach ruhig sein.",
            [TransitTextGroups.FLOW]:
                "Ein Vollmond in leichtem Aspekt bringt hier einen Höhepunkt ohne Kampf. Etwas in diesem Teil deines Lebens ist vollendet oder fast, und du darfst es als Ganzes sehen. Genieß die Aussicht, bevor der nächste Zyklus beginnt.",
            [TransitTextGroups.TENSE]:
                "Ein Vollmond in hartem Aspekt zu diesem Punkt zerrt eine Nacht lang daran. Etwas, das du als ein Problem behandelt hast, hat eine zweite, private Wurzel. Entscheide unter ihm nichts. Schlaf darüber und schau morgens noch einmal hin.",
        },
    },

    advice: {
        [Bodies.SUN]: {
            [TransitTextGroups.CONJUNCTION]:
                "Schenk diesem Teil deines Lebens einen ganzen Tag deiner Aufmerksamkeit, und sonst nichts.",
            [TransitTextGroups.FLOW]:
                "Erledige heute die Aufgabe, die einen klaren Kopf braucht. Nächste Woche fühlt sie sich nicht mehr so leicht an.",
            [TransitTextGroups.TENSE]:
                "Achte darauf, was dich heute ärgert, und schreib es auf. Entscheide später darüber.",
        },
        [Bodies.MERCURY]: {
            [TransitTextGroups.CONJUNCTION]:
                "Schreib es auf, solange die Worte klar sind. Schick es morgen ab.",
            [TransitTextGroups.FLOW]:
                "Führ das Gespräch, das du vor dir hergeschoben hast. Du wirst verstanden.",
            [TransitTextGroups.TENSE]:
                "Lies jede Nachricht noch einmal, bevor du sie abschickst, und füg einen Satz Kontext hinzu.",
        },
        [Bodies.VENUS]: {
            [TransitTextGroups.CONJUNCTION]:
                "Reservier den Tisch, kauf die Kleinigkeit oder sag das freundliche Wort, das du dir aufgehoben hast.",
            [TransitTextGroups.FLOW]:
                "Nimm die Einladung an. Such nicht nach dem Haken.",
            [TransitTextGroups.TENSE]:
                "Genieß den Abend, aber unterschreib deswegen nichts.",
        },
        [Bodies.MARS]: {
            [TransitTextGroups.CONJUNCTION]:
                "Fang die Sache an, um die du herumschleichst. Schreib die scharfe Nachricht und schick sie morgen.",
            [TransitTextGroups.FLOW]:
                "Beginne die Aufgabe, die sich wie ein Kampf anfühlte. Diese Woche ist sie keiner.",
            [TransitTextGroups.TENSE]:
                "Beweg dich am exakten Tag richtig. Triff im Ärger keine endgültige Entscheidung.",
        },
        [Bodies.JUPITER]: {
            [TransitTextGroups.CONJUNCTION]:
                "Sag Ja zu dem, was kommt, und prüf vorher, wie groß der Bissen ist.",
            [TransitTextGroups.FLOW]:
                "Bitte um das, was du geprobt hast. Bitte, solange das Fenster offen ist.",
            [TransitTextGroups.TENSE]:
                "Halbiere die Schätzung. Behalte den Optimismus und streich die überflüssige Null.",
        },
        [Bodies.SATURN]: {
            [TransitTextGroups.CONJUNCTION]:
                "Such dir die eine Verpflichtung aus, die hier zählt, und bring sie richtig zu Ende. Lass den Rest fallen.",
            [TransitTextGroups.FLOW]:
                "Bau jetzt die langweilige Struktur, solange es leicht fällt. Sie wird jahrelang halten.",
            [TransitTextGroups.TENSE]:
                "Kürze den Umfang, nicht die Ansprüche. Sag Nein zu dem Zusätzlichen.",
        },
        [Bodies.URANUS]: {
            [TransitTextGroups.CONJUNCTION]:
                "Ändere bewusst eine Sache, bevor die Veränderung selbst wählt.",
            [TransitTextGroups.FLOW]:
                "Probier die verrückte Idee aus. Das ist die Zeit, in der sie funktionieren darf.",
            [TransitTextGroups.TENSE]:
                "Ändere bewusst eine Gewohnheit, bevor der Impuls drei für dich ändert.",
        },
        [Bodies.NEPTUNE]: {
            [TransitTextGroups.CONJUNCTION]:
                "Erschaffe etwas, ruh dich aus oder bete. Unterschreib nichts.",
            [TransitTextGroups.FLOW]:
                "Mach Kunst. Lass die praktische Entscheidung warten, bis der Aspekt abnehmend ist.",
            [TransitTextGroups.TENSE]:
                "Prüf die Fakten zweimal, und prüf, wer sie dir erzählt hat.",
        },
        [Bodies.PLUTO]: {
            [TransitTextGroups.CONJUNCTION]:
                "Lass die Version davon los, die du verteidigt hast. Behalte, was noch wahr ist.",
            [TransitTextGroups.FLOW]:
                "Mach hier die tiefe, langsame Arbeit. Ein Jahr lang sieht sie niemand, und sie wird zählen.",
            [TransitTextGroups.TENSE]:
                "Lockere deinen Griff ein wenig. Was du so fest hältst, verändert sich schon.",
        },
    },
    lunationAdvice: {
        [Lunations.NEW]: {
            [TransitTextGroups.CONJUNCTION]:
                "Setz in den nächsten zwei Tagen eine kleine, konkrete Absicht für diesen Teil deines Lebens.",
            [TransitTextGroups.FLOW]:
                "Entscheide, was du hier willst, und lass es dann in Ruhe wachsen.",
            [TransitTextGroups.TENSE]:
                "Benenne das Hindernis in der ersten Woche. Der Monat läuft besser, sobald es einen Namen hat.",
        },
        [Lunations.FULL]: {
            [TransitTextGroups.CONJUNCTION]:
                "Lass sichtbar werden, was sich aufgebaut hat, und halte den Abend danach ruhig.",
            [TransitTextGroups.FLOW]:
                "Nimm dir einen Moment, um zu sehen, was hier vollendet ist, bevor der nächste Zyklus beginnt.",
            [TransitTextGroups.TENSE]:
                "Entscheide heute Nacht nichts. Schlaf darüber und schau morgens noch einmal hin.",
        },
    },

    natal: {
        [Bodies.SUN]:
            "Hier trifft es deine Sonne: dein Gefühl dafür, wer du bist, wofür du da bist und wie viel von dir du zeigen willst.",
        [Bodies.MOON]:
            "Hier trifft es deinen Mond: was du brauchst, wie du fühlst und wonach du greifst, wenn du müde bist.",
        [Bodies.MERCURY]:
            "Hier trifft es deinen Merkur: wie du denkst, wie du sprichst und was du sagst, wenn du nicht aufpasst.",
        [Bodies.VENUS]:
            "Hier trifft es deine Venus: was du liebst, was du schön findest und wie du Menschen an dich heranlässt.",
        [Bodies.MARS]:
            "Hier trifft es deinen Mars: deinen Antrieb, dein Temperament und was du tust, wenn dir etwas im Weg steht.",
        [Bodies.JUPITER]:
            "Hier trifft es deinen Jupiter: dein Glück, deinen Hunger nach mehr und den Teil von dir, der zu schnell Ja sagt.",
        [Bodies.SATURN]:
            "Hier trifft es deinen Saturn: deine Disziplin, deine Ängste und die Regeln, die du dir selbst gesetzt hast, bevor es jemand anderes tat.",
        [Bodies.URANUS]:
            "Hier trifft es deinen Uranus: den Teil von dir, der sich nichts sagen lässt und seinen eigenen Weg braucht, auch wenn der alte funktioniert hat.",
        [Bodies.NEPTUNE]:
            "Hier trifft es deinen Neptun: wovon du träumst, wo du lieber nicht hinsiehst und wohin du flüchtest.",
        [Bodies.PLUTO]:
            "Hier trifft es deinen Pluto: woran du am festesten hältst und um was herum du notfalls dein ganzes Leben neu aufbauen würdest.",
        [Bodies.NORTH_NODE]:
            "Hier trifft es deinen Nordknoten: die Richtung, in die dein Leben dich immer wieder wachsen lässt, auch wenn es die unbequeme ist.",
        [NatalAngles.ASC]:
            "Hier trifft es deinen Aszendenten: wie du wirkst, wie du der Welt begegnest und den ersten Eindruck, den du einfach machst.",
        [NatalAngles.MC]:
            "Hier trifft es dein Medium Coeli: deine Arbeit, deinen Ruf und das, wofür dich Menschen kennen, die dich nicht kennen.",
    },
}

export default de
