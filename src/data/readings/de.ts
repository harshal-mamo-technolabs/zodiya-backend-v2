import {
    AspectTypes,
    Bodies,
    Elements,
    Modalities,
    SupportedLanguages,
    ZodiacSigns,
} from "../../constants/index.ts"
import type { ReadingCopy } from "../../types/index.ts"

/**
 * German translation of readings/en.ts: same keys, same {placeholders}.
 * Informal "du" throughout.
 */
const de: ReadingCopy = {
    lang: SupportedLanguages.DE,

    signs: {
        [ZodiacSigns.ARIES]: {
            name: "Widder",
            essence:
                "du fängst lieber jetzt an und findest den Weg unterwegs, als zu warten, bis du dir sicher bist",
        },
        [ZodiacSigns.TAURUS]: {
            name: "Stier",
            essence:
                "du lässt dir Zeit, und hast du dich einmal auf etwas festgelegt, bringt dich kaum noch etwas davon ab",
        },
        [ZodiacSigns.GEMINI]: {
            name: "Zwillinge",
            essence:
                "du wirst schnell neugierig und hältst dir gern alle Möglichkeiten offen",
        },
        [ZodiacSigns.CANCER]: {
            name: "Krebs",
            essence:
                "du kümmerst dich um andere, und du brauchst einen Ort, an dem du dich sicher fühlst, bevor du dich auf irgendetwas anderes einlassen kannst",
        },
        [ZodiacSigns.LEO]: {
            name: "Löwe",
            essence:
                "du bist herzlich und großzügig zu anderen, und es tut dir wirklich weh, wenn sie es nicht bemerken",
        },
        [ZodiacSigns.VIRGO]: {
            name: "Jungfrau",
            essence:
                "du zeigst Zuneigung, indem du Dinge in Ordnung bringst, und du siehst, was nicht stimmt, bevor es irgendwer sonst merkt",
        },
        [ZodiacSigns.LIBRA]: {
            name: "Waage",
            essence:
                "du willst, dass sich alles fair und angenehm anfühlt, und du kommst anderen weit entgegen, damit es so bleibt",
        },
        [ZodiacSigns.SCORPIO]: {
            name: "Skorpion",
            essence: "du machst keine halben Sachen: ganz oder gar nicht",
        },
        [ZodiacSigns.SAGITTARIUS]: {
            name: "Schütze",
            essence:
                "du brauchst Spielraum und etwas, auf das du dich freuen kannst",
        },
        [ZodiacSigns.CAPRICORN]: {
            name: "Steinbock",
            essence:
                "du denkst langfristig, und du baust lieber etwas Echtes auf, als nur darüber zu reden",
        },
        [ZodiacSigns.AQUARIUS]: {
            name: "Wassermann",
            essence:
                "du denkst selbst, auch wenn dich das ein Stück außerhalb der Gruppe stellt",
        },
        [ZodiacSigns.PISCES]: {
            name: "Fische",
            essence:
                "du spürst, was andere fühlen, oft schon bevor sie es ausgesprochen haben",
        },
    },

    bodyNames: {
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
    },

    houses: [
        {
            ordinal: "ersten Haus",
            theme: "darin, wie du auf andere wirkst: in deiner Art und in den ersten dreißig Sekunden, in denen man dich kennenlernt",
        },
        {
            ordinal: "zweiten Haus",
            theme: "beim Thema Geld, Besitz und Selbstwert: in dem, was du hast, und in dem, was du dir selbst wert bist",
        },
        {
            ordinal: "dritten Haus",
            theme: "in alltäglichen Gesprächen, auf kurzen Wegen und in deiner Beziehung zu Geschwistern und Nachbarn",
        },
        {
            ordinal: "vierten Haus",
            theme: "zu Hause und im Familienleben, in dem privaten Teil, den draußen niemand wirklich sieht",
        },
        {
            ordinal: "fünften Haus",
            theme: "in Spaß, Romantik, Kreativität und Kindern: in allem, was du tust, weil du es willst, nicht weil du musst",
        },
        {
            ordinal: "sechsten Haus",
            theme: "in deinem Alltag, deinem Job und deiner Gesundheit, im ganz normalen Wochentagskram",
        },
        {
            ordinal: "siebten Haus",
            theme: "in deinen engen Zweierbeziehungen: bei Partnern, besten Freunden und den Menschen, mit denen du aneinandergerätst",
        },
        {
            ordinal: "achten Haus",
            theme: "in den Dingen, über die man nicht spricht: gemeinsames Geld, tiefe Nähe, Verlust und Veränderung",
        },
        {
            ordinal: "neunten Haus",
            theme: "in Reisen, Studium und Glauben: in allem, was dich aus deinem eigenen Garten hinauszieht",
        },
        {
            ordinal: "zehnten Haus",
            theme: "in deiner Arbeit und deinem Ruf, dem Teil deines Lebens, den andere tatsächlich sehen",
        },
        {
            ordinal: "elften Haus",
            theme: "in Freundschaften, Gruppen und dem, was du dir für die Zukunft erhoffst",
        },
        {
            ordinal: "zwölften Haus",
            theme: "in deinem privaten Innenleben: in Ruhe, Rückzug und den Dingen, die du für dich behältst",
        },
    ],

    elements: {
        [Elements.FIRE]: {
            label: "Feuer",
            line: "Als Ganzes betrachtet läuft dein Horoskop heiß. Du tust lieber etwas und liegst falsch, als stillzusitzen und zu grübeln, und Langeweile kostet dich mehr als Scheitern.",
            summary: "Dieses Horoskop läuft auf Energie und Ungeduld.",
        },
        [Elements.EARTH]: {
            label: "Erde",
            line: "Als Ganzes betrachtet ist dein Horoskop praktisch veranlagt. Du vertraust dem, was du sehen, zählen und anfassen kannst, und allem anderen glaubst du nur zögerlich.",
            summary: "Dieses Horoskop läuft auf Bodenständigkeit.",
        },
        [Elements.AIR]: {
            label: "Luft",
            line: "Als Ganzes betrachtet ist dein Horoskop ein denkendes. Du klärst Dinge, indem du sie in Worte fasst, und was unausgesprochen bleibt, bleibt ungelöst, egal wie lange du darüber brütest.",
            summary: "Dieses Horoskop läuft auf Denken und Reden.",
        },
        [Elements.WATER]: {
            label: "Wasser",
            line: "Als Ganzes betrachtet läuft dein Horoskop auf Gefühl. Du nimmst viel mehr auf, als andere ahnen, und du hältst viel länger daran fest, als du zeigst.",
            summary: "Dieses Horoskop läuft auf Gefühl.",
        },
    },

    modalities: {
        [Modalities.CARDINAL]: {
            label: "kardinal",
            clause: "du bist diejenige Person, die Dinge in Gang bringt, und du verlierst das Interesse, sobald sie ohne dich weiterlaufen",
            summary: "Du fängst Dinge lieber an, als sie am Laufen zu halten.",
        },
        [Modalities.FIXED]: {
            label: "fix",
            clause: "du bleibst bei einer Sache, manchmal weit über den Punkt hinaus, an dem dir das Bleiben noch guttut",
            summary: "Du bleibst bei einer Sache, im Guten wie im Schlechten.",
        },
        [Modalities.MUTABLE]: {
            label: "veränderlich",
            clause: "du passt dich dem an, was gerade vor dir liegt, und das ist nützlich, bis es zu einer Art wird, dich nie zu entscheiden",
            summary: "Du passt dich dem an, was gerade vor dir liegt.",
        },
    },

    aspectNames: {
        [AspectTypes.CONJUNCTION]: "Konjunktion",
        [AspectTypes.SEXTILE]: "Sextil",
        [AspectTypes.SQUARE]: "Quadrat",
        [AspectTypes.TRINE]: "Trigon",
        [AspectTypes.OPPOSITION]: "Opposition",
    },

    aspectShort: {
        [AspectTypes.CONJUNCTION]:
            "zwei Seiten von dir, die immer zusammen auftauchen",
        [AspectTypes.SEXTILE]: "zwei Seiten von dir, die sich gut verstehen",
        [AspectTypes.SQUARE]: "zwei Seiten von dir, die sich aneinander reiben",
        [AspectTypes.TRINE]:
            "zwei Seiten von dir, die mühelos zusammenarbeiten",
        [AspectTypes.OPPOSITION]:
            "zwei Seiten von dir, die in entgegengesetzte Richtungen ziehen",
    },

    aspectLines: {
        [AspectTypes.CONJUNCTION]:
            "Dein {a} und dein {b} liegen direkt aufeinander, {orb}° voneinander entfernt, und das ist nah. Sie arbeiten nicht getrennt: Wenn sich das eine zeigt, kommt das andere mit.",
        [AspectTypes.SEXTILE]:
            "Dein {a} und dein {b} verstehen sich gut, {orb}° von exakt entfernt. Es ist da, sobald du danach greifst, und völlig still, wenn du es nicht tust.",
        [AspectTypes.SQUARE]:
            "Dein {a} und dein {b} stehen im rechten Winkel zueinander, {orb}° von exakt entfernt. Das ist die Reibung. Sie ist unbequem, und gerade aus ihr kommt das meiste von deinem Wachstum.",
        [AspectTypes.TRINE]:
            "Dein {a} und dein {b} sind sich mühelos einig, {orb}° von exakt entfernt. Es kostet dich nichts, und genau deshalb verschenkt man es so leicht.",
        [AspectTypes.OPPOSITION]:
            "Dein {a} und dein {b} stehen sich direkt gegenüber, {orb}° von exakt entfernt. Du pendelst eher zwischen beiden hin und her, als beide zugleich zu halten.",
    },

    placements: {
        [Bodies.MOON]: {
            [ZodiacSigns.ARIES]:
                "Du fühlst schnell, und man sieht es sofort. Die Reaktion ist draußen, bevor du sie abgewogen hast, und meist ist sie genauso schnell wieder vorbei.",
            [ZodiacSigns.TAURUS]:
                "Du regst dich langsam auf und kommst langsam darüber hinweg. Komfort ist für dich kein Luxus, sondern wirklich das, was dich wieder ins Gleichgewicht bringt: ein gutes Essen, ein vertrauter Ort, jemand, der dich nicht drängt.",
            [ZodiacSigns.GEMINI]:
                "Du redest dich zurück zur Ruhe. Ein Gefühl, das du noch nicht in Worte gefasst hast, bleibt unfertig und summt weiter, deshalb brauchst du jemanden, bei dem du laut denken kannst.",
            [ZodiacSigns.CANCER]:
                "Du erinnerst dich genau daran, wie sich alles beim ersten Mal angefühlt hat, ob du willst oder nicht. Freundlichkeit geht bei dir tief, und das Gegenteil leider auch.",
            [ZodiacSigns.LEO]:
                "Du fühlst großzügig und zeigst deine Wärme offen. Was dich wirklich verletzt, ist nicht Kritik, sondern übersehen zu werden. Gleichgültigkeit trifft dich härter als ein Streit.",
            [ZodiacSigns.VIRGO]:
                "Wenn du aus dem Gleichgewicht bist, bringst du etwas Kleines in Ordnung: eine Schublade aufräumen, eine Liste sortieren, ein lösbares Problem lösen. Es hilft weit öfter, als man meinen sollte.",
            [ZodiacSigns.LIBRA]:
                "Du liest die Stimmung im Raum, bevor du deine eigene liest, und manchmal trägst du den schlechten Tag eines anderen mit nach Hause, als wäre es deiner.",
            [ZodiacSigns.SCORPIO]:
                "Du fühlst alles bis auf den Grund, oder du behauptest, gar nichts zu fühlen. Dazwischen gibt es nichts, und die Version mit „Ist nichts“ stimmt selten.",
            [ZodiacSigns.SAGITTARIUS]:
                "Die Tür muss offen bleiben. Sobald du weißt, dass du gehen könntest, bleibst du ganz gern. Was dir zusetzt, ist das Eingesperrtsein, nicht das Bleiben.",
            [ZodiacSigns.CAPRICORN]:
                "Du regelst zuerst die Lage und fühlst sie später, meist allein und meist viel später. In einer Krise bist du die Ruhe selbst, und das kostet dich etwas.",
            [ZodiacSigns.AQUARIUS]:
                "Du trittst einen Schritt von einem Gefühl zurück, um es dir richtig anzusehen. Dieser Abstand ist wirklich nützlich, und er kann kühl wirken auf jemanden, der dich lieber näher gehabt hätte.",
            [ZodiacSigns.PISCES]:
                "Du nimmst die Stimmung um dich herum auf und weißt hinterher nicht immer, welcher Teil davon deiner war. Volle Räume und schwere Gespräche kosten dich mehr Kraft, als du erwartest.",
        },
        [Bodies.MERCURY]: {
            [ZodiacSigns.ARIES]:
                "Du denkst so schnell, wie du sprichst. Der erste Satz ist zugleich Entwurf und Argument, das macht dich schlagfertig in Diskussionen und bindet dich manchmal an eine Position, die du eigentlich noch getestet hast.",
            [ZodiacSigns.TAURUS]:
                "Du denkst absichtlich langsam. Das kann wie Zögern aussehen, aber wenn du etwas sagst, hast du es schon geprüft, und du musst selten etwas zurücknehmen.",
            [ZodiacSigns.GEMINI]:
                "Du denkst, indem du redest, und du kannst zwei gegensätzliche Positionen lange genug gleichzeitig halten, um sie zu vergleichen. Manche verwechseln das damit, dass du dich noch nicht entschieden hast.",
            [ZodiacSigns.CANCER]:
                "Du denkst, indem du dich erinnerst. Jedes Urteil trägt die Szene mit sich, aus der es stammt, das macht dich zu einer guten Menschenkennerin oder einem guten Menschenkenner und ein wenig stur, was erste Eindrücke angeht.",
            [ZodiacSigns.LEO]:
                "Deine Ideen kommen schon fertig für ein Publikum an. Du denkst in Aussagen statt in Fragen, und du kannst Dinge besser erklären, als du dir selbst zutraust.",
            [ZodiacSigns.VIRGO]:
                "Du bemerkst zuerst, was nicht stimmt, jedes Mal. Das macht dich ungemein nützlich, und es heißt, dass du bewusst daran denken musst, auch das Gute laut auszusprechen.",
            [ZodiacSigns.LIBRA]:
                "Nichts fühlt sich geklärt an, bevor du die andere Seite gehört hast, also argumentierst du aus Gewohnheit gegen dich selbst. Das ist gründlich, und es ist langsam.",
            [ZodiacSigns.SCORPIO]:
                "Du nimmst den genannten Grund nicht einfach hin. Du suchst schon nach dem, der darunter liegt. Je nach Tag ist das scharfsinnig oder anstrengend.",
            [ZodiacSigns.SAGITTARIUS]:
                "Du denkst in großen Bögen und füllst die Details später aus, wenn überhaupt. Die Form einer Sache triffst du richtig, die Einzelheiten ein bisschen daneben.",
            [ZodiacSigns.CAPRICORN]:
                "Eine Idee interessiert dich nur, wenn etwas daraus folgt. Das ist kein Zynismus. Du siehst nur keinen Sinn in einem Gedanken, mit dem du nichts anfangen kannst.",
            [ZodiacSigns.AQUARIUS]:
                "Du denkst in Systemen, und du bist bereit, als Einzige oder Einziger im Raum an einer Schlussfolgerung festzuhalten. Überstimmt zu werden ändert deine Meinung kaum.",
            [ZodiacSigns.PISCES]:
                "Du kommst bei der Antwort an, lange bevor du erklären kannst, wie. Dein Gespür ist gut; den Rechenweg zu zeigen ist der Teil, zu dem du dich zwingen musst.",
        },
        [Bodies.VENUS]: {
            [ZodiacSigns.ARIES]:
                "Du gehst direkt auf Menschen zu. Interesse wird angekündigt statt angedeutet, und du bekommst lieber schnell eine Abfuhr, als einen Monat lang zu rätseln.",
            [ZodiacSigns.TAURUS]:
                "Du zeigst es, indem du da bist, beständig. Große Gesten zählen für dich weniger als jemand, der einfach auftaucht, und allem, was zu schnell kommt, misstraust du.",
            [ZodiacSigns.GEMINI]:
                "Du verliebst dich ins Gespräch. Jemand, mit dem man sich spannend unterhalten kann, hält dich viel länger als jemand, der nur schön anzusehen ist.",
            [ZodiacSigns.CANCER]:
                "Du liebst, indem du jemanden hereinlässt, und die Tür öffnet sich langsam und dann auf einmal ganz. Hast du einmal entschieden, dass jemand zu dir gehört, wird man dich kaum wieder los.",
            [ZodiacSigns.LEO]:
                "Du bist großzügig und offen zärtlich, und das soll man auch sehen. Wenn jemand diskret mit dir umgeht, wirkt das auf dich schnell, als wäre er sich deiner nicht sicher.",
            [ZodiacSigns.VIRGO]:
                "Du zeigst Liebe, indem du aufmerksam bist und Dinge richtest: das, woran du gedacht hast, das, was du repariert hast, der Termin, den du still gebucht hast. Du sagst es mit Taten und sorgst dich dann, ob du es auch gesagt hast.",
            [ZodiacSigns.LIBRA]:
                "Es soll sich fair und angenehm anfühlen, und dafür gibst du erstaunlich viel nach. Die Rechnung für all das Nachgeben kommt meist erst spät.",
            [ZodiacSigns.SCORPIO]:
                "Bei dir gibt es kein seichtes Ende. Halb fühlt sich schlimmer an als gar nicht, und du hättest lieber einen Menschen ganz als fünf nur teilweise.",
            [ZodiacSigns.SAGITTARIUS]:
                "Die Beziehung muss irgendwohin führen: ein gemeinsamer Plan, eine Reise, etwas, auf das ihr beide hinarbeitet. Was dich unruhig macht, ist der Stillstand, nicht der Mensch.",
            [ZodiacSigns.CAPRICORN]:
                "Du nimmst es ernst und zeigst es durch Verbindlichkeit, die du einhältst. Zuneigung, die nichts kostet, kommt bei dir nicht so recht als Zuneigung an.",
            [ZodiacSigns.AQUARIUS]:
                "Ihr müsst zuerst Freunde sein, und der andere Mensch muss ein ganz eigener, eigenständiger Mensch bleiben. Verschmelzen macht dich klaustrophobisch.",
            [ZodiacSigns.PISCES]:
                "Du liebst fast ohne Grenze, und das ist schön und manchmal ein Problem. Herauszufinden, wo du aufhörst und der andere anfängt, ist hier die eigentliche Aufgabe.",
        },
        [Bodies.MARS]: {
            [ZodiacSigns.ARIES]:
                "Du gehst direkt drauf los. Du liegst lieber schnell falsch als zu spät richtig, und das Warten ist der wirklich schwierige Teil.",
            [ZodiacSigns.TAURUS]:
                "Du kommst langsam in Gang und bist kaum noch aufzuhalten, wenn du einmal läufst. Den zweiten Teil davon unterschätzen die Leute regelmäßig.",
            [ZodiacSigns.GEMINI]:
                "Du argumentierst gut und schnell, und manchmal gewinnst du den Schlagabtausch und verlierst dabei den eigentlichen Punkt. Dein Temperament ist schnell und kurz.",
            [ZodiacSigns.CANCER]:
                "Du gehst Dinge nicht frontal an. Du gehst seitlich: indem du dich unverzichtbar machst, indem du dich um etwas kümmerst, bis es deins ist. Das funktioniert, und von außen kann es wie Manipulation aussehen.",
            [ZodiacSigns.LEO]:
                "Deine beste Arbeit machst du, wenn jemand zusieht. Das ist keine Eitelkeit, so schaltest du dich einfach ein, und es heißt, dass dir Mühe ohne Zeugen schwerer fällt.",
            [ZodiacSigns.VIRGO]:
                "Du zerlegst das Problem in Teile und arbeitest sie eins nach dem anderen ab. Das ist unspektakulär, und es kommt weiter als der lautere Weg.",
            [ZodiacSigns.LIBRA]:
                "Du gehst der Konfrontation lieber aus dem Weg, also schiebst du sie auf, und durch den Aufschub wird sie fast nie kleiner. Wenn du sie dann doch führst, bist du fair dabei.",
            [ZodiacSigns.SCORPIO]:
                "Du kündigst deinen Zug nicht an. Du wartest, du planst, und dann gibt es keine zweite Runde. Das ist wirkungsvoll, und es kann Menschen Angst machen.",
            [ZodiacSigns.SAGITTARIUS]:
                "Du läufst auf Überzeugung, und am schwersten aufzuhalten bist du genau dann, wenn du sicher bist, recht zu haben, was nicht immer dasselbe ist wie recht haben.",
            [ZodiacSigns.CAPRICORN]:
                "Du arbeitest in kleinen Schritten auf ein Ergebnis hin, das du vor langer Zeit beschlossen hast. Niemand bemerkt die Mühe, bis die Sache einfach erledigt ist.",
            [ZodiacSigns.AQUARIUS]:
                "Du handelst aus Prinzip, und du stehst noch da, wenn alle anderen längst weitergezogen sind. Als Letzte oder Letzter die Stellung zu halten, stört dich nicht.",
            [ZodiacSigns.PISCES]:
                "Du gehst Dinge auf Umwegen an, und am stärksten bist du, wenn du es für jemand anderen tust. Ganz für dich selbst zu handeln, ist der Teil, der sich ungewohnt anfühlt.",
        },
        [Bodies.JUPITER]: {
            [ZodiacSigns.ARIES]:
                "Chancen kommen zu dir, wenn du den ersten Schritt machst. Das Glück hier belohnt Mut, nicht Planung.",
            [ZodiacSigns.TAURUS]:
                "Bei dir wachsen Dinge langsam und stetig, und was du aufbaust, bleibt meist stehen.",
            [ZodiacSigns.GEMINI]:
                "Chancen kommen über Gespräche: jemand, mit dem du zufällig geredet hast, etwas, das du zufällig gelesen hast.",
            [ZodiacSigns.CANCER]:
                "Bei dir wächst etwas durch die Menschen, um die du dich kümmerst. Dein Glück kommt oft über Familie, Zuhause und die, für die du Platz gemacht hast.",
            [ZodiacSigns.LEO]:
                "Türen gehen für dich auf, wenn du sichtbar bist. Großzügigkeit und ein bisschen Showtalent zahlen sich hier wirklich aus.",
            [ZodiacSigns.VIRGO]:
                "Wachstum kommt dadurch, dass du nützlich bist. Das ist unspektakuläres Glück, und es summiert sich.",
            [ZodiacSigns.LIBRA]:
                "Chancen kommen über andere Menschen: Partnerschaften, Vorstellungen, jemand, der dich mag und das auch laut sagt.",
            [ZodiacSigns.SCORPIO]:
                "Wachstum kommt durch die Dinge, denen andere ausweichen. Im tiefen Wasser kommst du weiter als im flachen.",
            [ZodiacSigns.SAGITTARIUS]:
                "Türen gehen auf, wenn du weiter hinausgehst: Reisen, Studium, Fremde, alles jenseits des Vertrauten.",
            [ZodiacSigns.CAPRICORN]:
                "Wachstum kommt durch Verantwortung. Mehr übertragen zu bekommen, als du dich bereit fühlst, geht für dich meist gut aus.",
            [ZodiacSigns.AQUARIUS]:
                "Chancen kommen über Gruppen und Netzwerke und dadurch, dass du diejenige Person mit der ungewöhnlichen Idee bist.",
            [ZodiacSigns.PISCES]:
                "Wachstum kommt durch Großzügigkeit und Vorstellungskraft, und oft aus einer Richtung, die du nie hättest planen können.",
        },
        [Bodies.SATURN]: {
            [ZodiacSigns.ARIES]:
                "Die Lektion ist, dass etwas sehr zu wollen nicht dasselbe ist, wie es sich verdient zu haben. Geduld lernst du auf die langsame Art.",
            [ZodiacSigns.TAURUS]:
                "Die Lektion ist, dass Sicherheit aufgebaut und nicht gefunden wird, und zwar langsam. Geld und Stabilität kamen vermutlich spät oder kamen schwer.",
            [ZodiacSigns.GEMINI]:
                "Die Lektion ist, dass eine Stimme etwas zu sagen braucht. Schnell zu sein hat nie gereicht; du musstest ein Thema finden und dabei bleiben.",
            [ZodiacSigns.CANCER]:
                "Die Lektion ist, dass dir niemand die Geborgenheit schenken kann, die du nicht selbst aufbaust. Gut möglich, dass deine Familie dir das auf die harte Tour beigebracht hat.",
            [ZodiacSigns.LEO]:
                "Die Lektion ist, dass Anerkennung der Arbeit folgt und sie nie ersetzt. Gesehen zu werden musstest du dir verdienen, es wurde dir nicht geschenkt.",
            [ZodiacSigns.VIRGO]:
                "Die Lektion ist, dass gut genug und abgeliefert besser ist als perfekt und zurückgehalten. Deine Ansprüche sind zugleich Hindernis und Gabe.",
            [ZodiacSigns.LIBRA]:
                "Die Lektion ist, dass Fairness laut ausgesprochen werden muss, um zu existieren. Still den Frieden zu wahren hat nicht funktioniert; um das zu bitten, was du willst, schon.",
            [ZodiacSigns.SCORPIO]:
                "Die Lektion ist, dass Kontrolle, die du bewusst abgibst, die einzige ist, die du wirklich behältst. Vertrauen ist hier das schwierige Thema.",
            [ZodiacSigns.SAGITTARIUS]:
                "Die Lektion ist, dass ein Glaube die Begegnung mit den Fakten überstehen muss. Deine Überzeugungen musstest du dir erarbeiten, statt sie zu erben.",
            [ZodiacSigns.CAPRICORN]:
                "Die Lektion ist, dass Autorität erst Verantwortung ist und dann eine Position. Du bist früh erwachsen geworden, ob dich jemand darum gebeten hat oder nicht.",
            [ZodiacSigns.AQUARIUS]:
                "Die Lektion ist, dass ein Prinzip etwas kostet, sonst war es immer nur eine Vorliebe. Für ein paar deiner Prinzipien hast du bezahlen müssen.",
            [ZodiacSigns.PISCES]:
                "Die Lektion ist, dass Vertrauen und Ausweichen von innen genau gleich aussehen. Zu erkennen, was davon du gerade tust, ist die ganze Arbeit.",
        },
        [Bodies.NORTH_NODE]: {
            [ZodiacSigns.ARIES]:
                "Er weist dich dahin, etwas für dich selbst zu wollen und es als Erste oder Erster auszusprechen, und weg von der bequemen Gewohnheit, dich selbst hintanzustellen.",
            [ZodiacSigns.TAURUS]:
                "Er weist dich dahin, lange genug bei einer Sache zu bleiben, bis sie fest wird, und weg von der bequemen Gewohnheit aus Intensität und Umbruch.",
            [ZodiacSigns.GEMINI]:
                "Er weist dich dahin, neugierig zu bleiben und mehr Fragen zu stellen, und weg von der bequemen Gewohnheit, dich auf eine große Überzeugung festzulegen und sie zu verteidigen.",
            [ZodiacSigns.CANCER]:
                "Er weist dich dahin, Menschen offen zu brauchen, und weg von der bequemen Gewohnheit, so selbstständig zu sein, dass dir niemand helfen darf.",
            [ZodiacSigns.LEO]:
                "Er weist dich dahin, die Mitte einzunehmen, wenn sie wirklich dir gehört, und weg von der bequemen Gewohnheit, die Anerkennung an die Gruppe weiterzureichen.",
            [ZodiacSigns.VIRGO]:
                "Er weist dich dahin, die kleine, konkrete Arbeit zu tun, und weg von der bequemen Gewohnheit, ein großes Gefühl zu hegen und dahinzutreiben.",
            [ZodiacSigns.LIBRA]:
                "Er weist dich dahin, etwas mit jemandem aufzubauen statt nur neben ihm, und weg von der bequemen Gewohnheit, alles allein zu machen.",
            [ZodiacSigns.SCORPIO]:
                "Er weist dich dahin, loszulassen, was du nur behalten hast, weil du es schon immer hattest, und weg von der bequemen Gewohnheit, festzuhalten.",
            [ZodiacSigns.SAGITTARIUS]:
                "Er weist dich dahin, dich für eine Richtung zu entscheiden, bevor alle Informationen da sind, und weg von der bequemen Gewohnheit, erst noch ein paar Details mehr zu sammeln.",
            [ZodiacSigns.CAPRICORN]:
                "Er weist dich dahin, öffentlich für das einzustehen, was du im Stillen entschieden hast, und weg von der bequemen Gewohnheit, nah am Zuhause zu bleiben.",
            [ZodiacSigns.AQUARIUS]:
                "Er weist dich dahin, dem größeren Ganzen zu dienen, und weg von der bequemen Gewohnheit, für die zu spielen, die dir ohnehin schon applaudieren.",
            [ZodiacSigns.PISCES]:
                "Er weist dich dahin, mitten im Moment zu sein, und weg von der bequemen Gewohnheit, draußen zu stehen, zu prüfen und zu analysieren.",
        },
    },

    ascendant: {
        [ZodiacSigns.ARIES]:
            "Andere halten dich für entschlossen und ein wenig ungeduldig, oft bevor du überhaupt etwas entschieden hast. Du kommst mit Tempo an.",
        [ZodiacSigns.TAURUS]:
            "Du wirkst ruhig und gelassen, und Räume werden in deiner Nähe ein bisschen langsamer. Andere finden dich beruhigend.",
        [ZodiacSigns.GEMINI]:
            "Mit dir kann man leicht reden, und man mag dich schnell. Dich wirklich zu kennen dauert deutlich länger, und das ist dir ganz recht.",
        [ZodiacSigns.CANCER]:
            "Du prüfst die Temperatur, bevor du dich auf einen Raum einlässt. Andere halten dich für sanft und etwas zurückhaltend, und das trifft es ganz gut.",
        [ZodiacSigns.LEO]:
            "Man bemerkt dich, ob du es willst oder nicht. Selbst wenn du still bist, spüren die Leute, dass du da bist.",
        [ZodiacSigns.VIRGO]:
            "Du wirkst fähig und etwas reserviert. Du schätzt den Raum schon ein, während alle anderen noch Hallo sagen, und das wirkt kompetent, bevor du irgendetwas dafür getan hast.",
        [ZodiacSigns.LIBRA]:
            "Du wirkst unkompliziert und umgänglich, und andere kommen dir öfter auf halbem Weg entgegen, als du merkst. Charme erledigt eine Menge stiller Arbeit für dich.",
        [ZodiacSigns.SCORPIO]:
            "Du kommst leise an und wirst trotzdem gespürt. Andere finden dich schwer zu lesen und raten herum, meistens falsch.",
        [ZodiacSigns.SAGITTARIUS]:
            "Du wirkst offen und ungeschützt, und die Leute vertrauen dir schneller, als es eigentlich vernünftig wäre. Man ist gern mit dir zusammen.",
        [ZodiacSigns.CAPRICORN]:
            "Du wirkst beherrscht und kompetent, und andere halten dich für älter und verantwortungsvoller, als du bist. Das ist nützlich und manchmal einsam.",
        [ZodiacSigns.AQUARIUS]:
            "Du stehst leicht schräg zum Raum, und genau dafür erinnert man sich an dich. Du bist unverwechselbar, bevor du vertraut bist.",
        [ZodiacSigns.PISCES]:
            "Du kommst leise an und nimmst erst die Form des Raums an, bevor du deine eigene annimmst. Mit dir ist man gern zusammen, aber festnageln lässt du dich schwer.",
    },

    midheaven: {
        [ZodiacSigns.ARIES]:
            "dafür, dass du vorangehst. Er beruht auf Mut statt auf abgesessener Zeit, also kommst du weiter, wenn du etwas anfängst, als wenn du wartest, bis du dran bist.",
        [ZodiacSigns.TAURUS]:
            "für deine Verlässlichkeit. Er wächst langsam und hält dann. Man kommt zu dir, weil du nichts fallen lässt.",
        [ZodiacSigns.GEMINI]:
            "für das, was du erklären kannst. Dein Ansehen reist über deine Stimme, also wird die Arbeit bemerkt, über die du sprechen kannst.",
        [ZodiacSigns.CANCER]:
            "dafür, dass du dich um die Sache kümmerst. Man vertraut dir an, was einem wichtig ist, und das ist ein stilleres und beständiges Ansehen.",
        [ZodiacSigns.LEO]:
            "beim Namen statt über einen Titel. Deine Arbeit trägt deine Handschrift, und anonyme Arbeit wäre an dich verschwendet.",
        [ZodiacSigns.VIRGO]:
            "dafür, dass du es ganz genau richtig machst. Das ist ein unaufgeregter Ruf und einer, den dir nur sehr schwer jemand nehmen kann.",
        [ZodiacSigns.LIBRA]:
            "für deine Fairness. Am Ende bist du diejenige Person, die man holt, wenn zwei Seiten in einen Raum müssen.",
        [ZodiacSigns.SCORPIO]:
            "dafür, dass du übernimmst, was andere nicht anfassen. Das hat Gewicht, und es heißt, dass dir die schwierigen Aufgaben zufallen.",
        [ZodiacSigns.SAGITTARIUS]:
            "für den Blick aufs große Ganze. Dein Ansehen wächst meist mit der Entfernung: Reisen, ein breiteres Publikum, ein Blick von außen.",
        [ZodiacSigns.CAPRICORN]:
            "für Autorität, die du dir vor aller Augen verdient hast. Der Aufstieg ist hier keine Nebensache, er ist eher der Kern.",
        [ZodiacSigns.AQUARIUS]:
            "für die Position, die vor dir niemand eingenommen hat. Man kennt dich dafür, früh dran zu sein, nicht dafür, auf Nummer sicher zu gehen.",
        [ZodiacSigns.PISCES]:
            "für etwas, dem man schwer eine Berufsbezeichnung geben kann. Deine Arbeit erreicht Menschen meist, bevor die Beschreibung es tut.",
    },

    templates: {
        sun: "Fang mit deinem Sonnenzeichen an, dem Kern von dir, dem Teil, der ungefähr gleich bleibt, ob du bei der Arbeit, zu Hause oder für dich allein bist. Deins ist {sign}, und das heißt: {essence}.",
        houseFirst:
            "Ein Horoskop teilt das Leben außerdem in zwölf Bereiche, die Häuser, und es zählt, in welchem ein Planet landet. Deine Sonne steht im {ordinal}, also zeigt sich diese Seite von dir am stärksten {theme}.",
        bodyHouse: "In deinem Horoskop zeigt sich das vor allem {theme}.",
        ascendant:
            "Bevor aber irgendwer zu all dem vordringt, begegnet man deinem Aszendenten: dem ersten Eindruck, der Version von dir, die einen Raum betritt. Deiner ist {sign}. {line}",
        mercury:
            "Wie dein Kopf arbeitet, ist eine andere Frage als die, wer du bist, und deiner tendiert zu {sign}. {line}",
        moon: "Dein Mondzeichen ist die private Hälfte des Horoskops: wie du Dinge fühlst, nicht wie du sie zeigst. Es ist die Version von dir, die herauskommt, wenn du müde, aufgewühlt oder völlig entspannt bist. Deins ist {sign}. {line}",
        venus: "Die Venus ist die Seite der Zuneigung: was du anziehend findest und wie du jemandem zeigst, dass er dir wichtig ist. Deine steht im Zeichen {sign}. {line}",
        mars: "Der Mars ist der Gegenpol: Antrieb, Begehren und das, was du tust, wenn dir etwas im Weg steht. Deiner steht im Zeichen {sign}. {line}",
        descendant:
            "Der Punkt direkt gegenüber deinem Aszendenten sagt viel darüber, wer dich anzieht. Bei dir ist das {sign}, also fühlst du dich oft zu Menschen hingezogen, die den Teil verkörpern, den du nicht für dich beanspruchst: {essence}.",
        midheaven:
            "Die Spitze eines Horoskops, das Medium Coeli (MC), steht für deinen Ruf: wofür man dich kennt, nicht wie du zu Hause bist. Deins steht im Zeichen {sign}, und bekannt wirst du {line}",
        saturn: "Jedes Horoskop hat einen Bereich, in dem dir nichts geschenkt wird und alles verdient werden muss. Das ist Saturn, und deiner steht im Zeichen {sign}. {line}",
        jupiter:
            "Jupiter ist der leichtere: der Ort, an dem sich Dinge eher öffnen als schließen. Deiner steht im Zeichen {sign}. {line}",
        node: "Der Nordknoten ist der eine Teil des Horoskops, bei dem es nicht darum geht, wer du schon bist, sondern wohin du wächst. Anfangs fühlt er sich meist etwas ungewohnt an und später leise lohnend. Deiner steht im Zeichen {sign}. {line}",
        pluto: "Pluto bewegt sich so langsam, dass alle, die innerhalb weniger Jahre um dich herum geboren sind, dasselbe Zeichen teilen, also sagt {sign} mehr über deine Generation als über dich persönlich. Was ihn zu deinem macht, ist, wo er gelandet ist: {theme}. Das ist der Lebensbereich, den du immer wieder von Grund auf neu aufbaust.",
        dominants: "{elementLine} Dazu kommt: {clause}.",
        sunMoonAspect:
            "Deine Sonne und dein Mond sind hier außerdem verbunden ({orb}° von exakt entfernt), das heißt, der Teil von dir, der entscheidet, und der Teil, der fühlt, ziehen meist in dieselbe Richtung.",
        noSunMoonAspect:
            "Eine letzte Sache: Deine Sonne und dein Mond haben keine Verbindung zueinander. Der entscheidende und der fühlende Teil von dir laufen auf getrennten Gleisen, und du wechselst zwischen ihnen, statt sie zu vermischen.",
        summary:
            "{elementSummary} {modalitySummary} Die stärkste einzelne Verbindung darin läuft zwischen deinem {a} und deinem {b}: {aspectShort}.",
        summaryNoAspect:
            "{elementSummary} {modalitySummary} Nichts darin ist eng mit etwas anderem verdrahtet, also arbeiten die Teile ziemlich unabhängig voneinander.",
        headlineLuminaries: "Sonne {sun}, Mond {moon}",
        headlineRising: "Aszendent {asc}",
        position: "{degree}°{minute}′ {sign}",
    },

    sections: {
        personality: {
            numeral: "I",
            title: "Persönlichkeit",
            subtitle: "Wer du bist",
        },
        emotions: {
            numeral: "II",
            title: "Gefühle",
            subtitle: "Wie du fühlst",
        },
        relationships: {
            numeral: "III",
            title: "Beziehungen",
            subtitle: "Wie du liebst",
        },
        career: {
            numeral: "IV",
            title: "Beruf",
            subtitle: "Arbeit und Ruf",
        },
        lifePath: {
            numeral: "V",
            title: "Lebensweg",
            subtitle: "Wo du wächst",
        },
    },

    labels: {
        sun: "SONNE",
        moon: "MOND",
        ascendant: "AC",
        retrograde: "rückläufig",
        midheaven: "MC",
    },
}

export default de
