import {
    AspectTypes,
    Bodies,
    SupportedLanguages,
    SynastryBands,
    SynastrySections,
    TransitTextGroups,
    ZodiacSigns,
} from "../../constants/index.ts"
import type { SynastryCopy } from "../../types/index.ts"

/**
 * German synastry copy, a translation of en.ts: same keys, same
 * {placeholders}. Names are not inflected ("der Mond von {x}"), so any name
 * reads correctly.
 */
const de: SynastryCopy = {
    lang: SupportedLanguages.DE,

    labels: {
        stageEntry: "Synastrie · Eingabe",
        stagePlate: "Synastrie · Tafel",
        eyebrow: "Vergleichstafel",
        title: "Zwei Himmel, übereinandergelegt.",
        intro: "Wähle zwei gespeicherte Profile. Ihre Horoskope liegen schon vor. Du musst nichts eintippen.",
        personOne: "Person eins",
        personTwo: "Person zwei",
        needMore:
            "Füge ein weiteres Profil hinzu, um einen Vergleich zu starten.",
        addProfile: "Profil hinzufügen",
        compare: "Horoskope vergleichen",
        ready: "Beide Profile ausgewählt",
        notReady: "Wähle zwei verschiedene Profile zum Vergleichen",
        inner: "innen",
        outer: "außen",
        edit: "Eine der Angaben ändern",
        overall: "Gesamtdeutung",
        strongest: "Stärkste Kreuzaspekte",
        comparison: "Der Vergleich",
        sectionCount: "Vier Abschnitte",
        orb: "Orbis",
    },

    bodies: {
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
        [Bodies.NORTH_NODE]: "Mondknoten",
    },

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

    aspects: {
        [AspectTypes.CONJUNCTION]: { verb: "Konjunktion", glyph: "☌" },
        [AspectTypes.SEXTILE]: { verb: "Sextil", glyph: "⚹" },
        [AspectTypes.SQUARE]: { verb: "Quadrat", glyph: "□" },
        [AspectTypes.TRINE]: { verb: "Trigon", glyph: "△" },
        [AspectTypes.OPPOSITION]: { verb: "Opposition", glyph: "☍" },
    },

    // dative form: "im {ordinal} Haus"
    ordinals: [
        "ersten",
        "zweiten",
        "dritten",
        "vierten",
        "fünften",
        "sechsten",
        "siebten",
        "achten",
        "neunten",
        "zehnten",
        "elften",
        "zwölften",
    ],

    houses: [
        "der Lebensbereich, in dem es darum geht, wie jemand wirkt und der Welt begegnet",
        "der Lebensbereich, in dem es um Geld, Besitz und das Gefühl von genug geht",
        "der Lebensbereich, in dem es um Gespräche, Erledigungen, Geschwister und das alltägliche Denken geht",
        "der Lebensbereich, in dem es um Zuhause, Familie und das geht, was sich sicher anfühlt",
        "der Lebensbereich, in dem es um Spiel, Romantik, Kinder und das Gesehenwerden geht",
        "der Lebensbereich, in dem es um Arbeit, Gesundheit und den Alltag geht",
        "der Lebensbereich, in dem es um Partnerschaft und die Menschen geht, an die man sich bindet",
        "der Lebensbereich, in dem es um Intimität, gemeinsames Geld und das geht, was man für sich behält",
        "der Lebensbereich, in dem es um Glauben, Reisen und das große Ganze geht",
        "der Lebensbereich, in dem es um Beruf, Ansehen und das geht, wofür man bekannt ist",
        "der Lebensbereich, in dem es um Freunde, Gruppen und Hoffnungen für die Zukunft geht",
        "der Lebensbereich, in dem es um Ruhe, Rückzug und das Unausgesprochene geht",
    ],
    housePlacement:
        "Der Planet {body} von {x} steht im {ordinal} Haus von {y}: {meaning}. Diesen Teil des Lebens von {y} berührt {x} allein dadurch, dass es {x} gibt, ob es einer von beiden bemerkt oder nicht.",
    contact: "{bodyA} von {a} {verb} {bodyB} von {b}",
    houseBasis: "{body} von {x} im {ordinal} Haus von {y}",

    sections: {
        [SynastrySections.EMOTIONAL]: {
            title: "Emotionale Verbindung",
            none: "Keiner der beiden Monde bildet einen engen Aspekt zu Sonne, Mond oder Venus der anderen Person. Das ist kein schlechtes Zeichen, nur ein leises. Das Gefühl, beieinander zu Hause zu sein, entsteht hier eher aus Gewohnheit und gemeinsamer Zeit als aus Instinkt, und es braucht etwas länger als bei manchen anderen Paaren.",
            pairs: {
                "moon-sun": {
                    [TransitTextGroups.FLOW]:
                        "Der Mond von {x} steht in einem leichten Aspekt zur Sonne von {y}, eines der verlässlichsten Zeichen für Geborgenheit in einem Vergleich. Was {x} braucht, um sich sicher zu fühlen, ist mehr oder weniger genau das, wie {y} sich ganz von selbst verhält. Niemand muss dem anderen etwas vorspielen, und niemand muss viel erklären.",
                    [TransitTextGroups.TENSE]:
                        "Der Mond von {x} steht in einem schwierigen Aspekt zur Sonne von {y}. Was {x} braucht, um zur Ruhe zu kommen, und wie {y} einfach ist, passt nicht von allein zusammen. {y} kann die Stimmungen von {x} als Kritik lesen, und {x} kann sich übersehen fühlen, wenn {y} einfach nur {y} ist. Es funktioniert, wenn beide klar sagen, was sie brauchen, statt zu erwarten, dass es erraten wird.",
                    [TransitTextGroups.CONJUNCTION]:
                        "Der Mond von {x} liegt auf der Sonne von {y}. {x} spürt die Stimmungen von {y}, bevor sie ausgesprochen werden, und {y} fühlt sich auf eine Weise verstanden, die man anderswo nur schwer findet. Die Gefahr ist, dass die beiden ineinander verschwimmen. Ein wenig bewusster Abstand hält das Ganze warm statt schwer.",
                },
                "moon-moon": {
                    [TransitTextGroups.FLOW]:
                        "Die beiden Monde stehen in einem leichten Aspekt. {x} und {y} werden zu ähnlichen Zeiten und auf ähnliche Weise müde, hungrig und heimwehkrank, deshalb müssen die kleinen häuslichen Dinge selten ausgehandelt werden. Ein unspektakuläres Geschenk und eines der besten fürs Zusammenleben.",
                    [TransitTextGroups.TENSE]:
                        "Die beiden Monde stehen in einem schwierigen Aspekt. {x} und {y} gehen unterschiedlich mit Gefühlen um: Eine Person will sofort darüber reden, die andere braucht erst eine Stunde für sich. Keine der beiden Arten ist falsch, aber jede liest die der anderen als Rückzug. Es offen anzusprechen hilft viel mehr, als es auszusitzen.",
                    [TransitTextGroups.CONJUNCTION]:
                        "Die beiden Monde stehen zusammen. {x} und {y} teilen sich ein emotionales Wetter, was an guten Tagen tiefe Geborgenheit bedeutet und an schlechten ein gemeinsames Tief. Eine von beiden muss diejenige Person sein, die das Fenster öffnet.",
                },
                "moon-venus": {
                    [TransitTextGroups.FLOW]:
                        "Der Mond von {x} steht in einem leichten Aspekt zur Venus von {y}. {y} fällt es leicht, genau so lieb zu {x} zu sein, wie {x} es braucht, und {x} fällt es leicht, bei {y} weich zu werden. Zuneigung muss hier nicht erarbeitet werden.",
                    [TransitTextGroups.TENSE]:
                        "Der Mond von {x} steht in einem schwierigen Aspekt zur Venus von {y}. {y} zeigt Fürsorge auf eine Art, die bei {x} nicht ganz ankommt, und {x} fühlt sich mal umsorgt, mal übergangen. Die Lösung ist klein und konkret: fragen, was sich wirklich nach Fürsorge anfühlen würde, und genau das tun.",
                    [TransitTextGroups.CONJUNCTION]:
                        "Der Mond von {x} liegt auf der Venus von {y}. Zwischen {x} und {y} gibt es echte Zärtlichkeit, die Art, die sich darin zeigt, wie sie miteinander sprechen, wenn niemand sonst zuhört. Sorgt dafür, dass sie nicht die einzige Sprache bleibt, dann hält sie.",
                },
            },
        },
        [SynastrySections.ATTRACTION]: {
            title: "Anziehung",
            none: "Venus und Mars bilden keinen engen Kontakt zwischen den beiden Horoskopen. Wenn es Anziehung zwischen {a} und {b} gibt, lebt sie von anderen Dingen: von Gesprächen, gemeinsamer Arbeit, dem richtigen Zeitpunkt. Sie kann beständig und echt sein, aber sie schaltet sich nicht von selbst ein, und beide werden mehr als einmal den ersten Schritt machen müssen.",
            pairs: {
                "venus-mars": {
                    [TransitTextGroups.FLOW]:
                        "Die Venus von {x} steht in einem leichten Aspekt zum Mars von {y}, die klassische Verbindung für Anziehung. {y} wirbt so, wie {x} umworben werden möchte, und {x} reagiert so, wie {y} es sich erhofft. Das Begehren hat hier für beide dasselbe Tempo.",
                    [TransitTextGroups.TENSE]:
                        "Die Venus von {x} steht in einem schwierigen Aspekt zum Mars von {y}. Der Sog ist echt und ein bisschen unbequem: {y} drängt, {x} zieht sich zurück, und genau dieser Tanz ist der halbe Reiz. Er kippt in Reibung, wenn das Timing nicht stimmt, also ist es ehrlich, das auch zu sagen.",
                    [TransitTextGroups.CONJUNCTION]:
                        "Die Venus von {x} liegt auf dem Mars von {y}. Das ist der Aspekt, den Leute meinen, wenn sie von Chemie sprechen. Er ist sofort da und verblasst nicht so schnell. Die Arbeit liegt in allem drumherum, denn dieser Teil kümmert sich um sich selbst.",
                },
                "mars-mars": {
                    [TransitTextGroups.FLOW]:
                        "Die beiden Mars stehen in einem leichten Aspekt. {x} und {y} wollen Dinge im selben Tempo und auf dieselbe Weise, was der Beziehung eine körperliche Leichtigkeit gibt, über die keiner nachdenken muss. Streit, wenn er kommt, brennt schnell aus.",
                    [TransitTextGroups.TENSE]:
                        "Die beiden Mars stehen in einem schwierigen Aspekt. {x} und {y} wollen beide führen, und beide merken, wenn die andere Person nicht folgt. Das bringt Energie und gelegentlich auch ein Aufflammen. Treibt zusammen Sport und klärt vorher, wer am Steuer sitzt.",
                    [TransitTextGroups.CONJUNCTION]:
                        "Die beiden Mars stehen zusammen. {x} und {y} haben denselben Antrieb und dasselbe Temperament, was aufregend und gelegentlich laut ist. Auf ein gemeinsames Ziel gerichtet ist es eine Stärke; aufeinander gerichtet wird es ein langer Abend.",
                },
                "venus-sun": {
                    [TransitTextGroups.FLOW]:
                        "Die Venus von {x} steht in einem leichten Aspekt zur Sonne von {y}. {x} mag, wer {y} ist, nicht nur, was {y} tut, und {y} spürt das. Das ist der Aspekt, für die richtigen Dinge bewundert zu werden.",
                    [TransitTextGroups.TENSE]:
                        "Die Venus von {x} steht in einem schwierigen Aspekt zur Sonne von {y}. {x} fühlt sich genau von den Eigenschaften angezogen, bei denen {y} sich am unsichersten ist, und {y} fühlt sich von {x} mehr gesehen als von den meisten Menschen. Das ist anziehend und für beide ein wenig verunsichernd. Lasst es einfach zu.",
                    [TransitTextGroups.CONJUNCTION]:
                        "Die Venus von {x} liegt auf der Sonne von {y}. {x} findet {y} mehr oder weniger genau so wunderbar, wie {y} ist, und {y} strahlt in der Nähe von {x} ein bisschen heller. Einfach, warm und leicht für selbstverständlich zu nehmen.",
                },
                "venus-venus": {
                    [TransitTextGroups.FLOW]:
                        "Die beiden Venus stehen in einem leichten Aspekt. {x} und {y} genießen dieselben Dinge: dieselbe Art Abend, dieselbe Art Schönheit, dieselbe Vorstellung von einem kleinen Luxus. Gemeinsamer Geschmack ist leiser als Leidenschaft und überdauert sie.",
                    [TransitTextGroups.TENSE]:
                        "Die beiden Venus stehen in einem schwierigen Aspekt. {x} und {y} haben unterschiedliche Vorstellungen von einer schönen Zeit und davon, wie Zuneigung aussehen sollte. Das ist nichts Ernstes, bedeutet aber, sich abzuwechseln, statt etwas vorauszusetzen.",
                    [TransitTextGroups.CONJUNCTION]:
                        "Die beiden Venus stehen zusammen. {x} und {y} schätzen dieselben Dinge und zeigen Liebe auf dieselbe Weise, deshalb fühlt man sich hier leicht wertgeschätzt. Eine sehr angenehme Stellung für alles, was auf Dauer angelegt ist.",
                },
            },
        },
        [SynastrySections.COMMUNICATION]: {
            title: "Kommunikation",
            none: "Merkur bildet keinen engen Kontakt zwischen den beiden Horoskopen. {a} und {b} sprechen nicht automatisch dieselbe Sprache, und das ist in Ordnung; es heißt nur, dass Gespräche etwas mehr Geduld und etwas weniger Annahmen brauchen. Schriftliche Notizen helfen mehr, als beide erwarten würden.",
            pairs: {
                "mercury-mercury": {
                    [TransitTextGroups.FLOW]:
                        "Die beiden Merkure stehen in einem leichten Aspekt. {x} und {y} denken in ähnlichem Tempo und beenden oft die Sätze der anderen Person. Pläne sind schnell gemacht, und Missverständnisse sind selten und kurz.",
                    [TransitTextGroups.TENSE]:
                        "Die beiden Merkure stehen in einem schwierigen Aspekt, das klassische Muster zweier Menschen, die beide recht haben und es nicht hören können. {x} wägt beide Seiten ab und überdenkt; {y} entscheidet und geht los. Beim Streit geht es weniger um den Inhalt als um das Tempo. Werdet bewusst langsamer, dann seid ihr euch inhaltlich meist einig.",
                    [TransitTextGroups.CONJUNCTION]:
                        "Die beiden Merkure stehen zusammen. {x} und {y} teilen eine Denkweise, was Gespräche leicht macht und manchmal zur Echokammer. Holt euch ab und zu eine dritte Meinung dazu.",
                },
                "mercury-sun": {
                    [TransitTextGroups.FLOW]:
                        "Der Merkur von {x} steht in einem leichten Aspekt zur Sonne von {y}. {x} versteht, worum es {y} geht, und kann es in Worte fassen, manchmal besser als {y} selbst. {y} fühlt sich hier gehört.",
                    [TransitTextGroups.TENSE]:
                        "Der Merkur von {x} steht in einem schwierigen Aspekt zur Sonne von {y}. {x} stellt gern genau das infrage, was {y} für selbstverständlich hält, und {y} kann das als Zweifel hören. Es schärft beide, solange es neugierig bleibt statt spitz.",
                    [TransitTextGroups.CONJUNCTION]:
                        "Der Merkur von {x} liegt auf der Sonne von {y}. {x} ist eine natürliche Stimme für {y}, und {y} denkt klarer, wenn {x} im Raum ist. Gut für jedes gemeinsame Projekt.",
                },
                "mercury-moon": {
                    [TransitTextGroups.FLOW]:
                        "Der Merkur von {x} steht in einem leichten Aspekt zum Mond von {y}. {x} kann so über Gefühle sprechen, dass {y} es gut annehmen kann, und {y} fällt es leicht, {x} zu erzählen, was unter der Oberfläche los ist. Selten und es wert, geschützt zu werden.",
                    [TransitTextGroups.TENSE]:
                        "Der Merkur von {x} steht in einem schwierigen Aspekt zum Mond von {y}. {x} argumentiert, wo {y} fühlt, und Worte, die {x} neutral vorkommen, können {y} hart treffen. Ein zusätzlicher warmer Satz von {x} ändert alles.",
                    [TransitTextGroups.CONJUNCTION]:
                        "Der Merkur von {x} liegt auf dem Mond von {y}. Kopf und Herz sind hier im selben Raum: {x} findet Worte für das, was {y} fühlt, und {y} gibt den Ideen von {x} einen Ort, an dem sie landen können. Redet spät und oft.",
                },
                "mercury-jupiter": {
                    [TransitTextGroups.FLOW]:
                        "Der Merkur von {x} steht in einem leichten Aspekt zum Jupiter von {y}. {y} lässt die Ideen von {x} größer und machbarer wirken, und {x} hält den Optimismus von {y} in Kontakt mit den Details. Gute Gespräche, und lange.",
                    [TransitTextGroups.TENSE]:
                        "Der Merkur von {x} steht in einem schwierigen Aspekt zum Jupiter von {y}. {y} rundet gern alles auf, und {x} merkt es. Gemeinsame Pläne brauchen einen zweiten Durchgang mit dem Taschenrechner, und das sollten beide von Anfang an wissen.",
                    [TransitTextGroups.CONJUNCTION]:
                        "Der Merkur von {x} liegt auf dem Jupiter von {y}. {x} und {y} reden sich gegenseitig in Dinge hinein, meist in gute. Reisen, Lernen und große Ideen sind die Bereiche, in denen dieses Paar am besten denkt.",
                },
                "mercury-saturn": {
                    [TransitTextGroups.FLOW]:
                        "Der Merkur von {x} steht in einem leichten Aspekt zum Saturn von {y}. {y} gibt dem Denken von {x} Struktur, und {x} gibt der Vorsicht von {y} eine sinnvolle Richtung. Gespräche enden hier mit einer Entscheidung.",
                    [TransitTextGroups.TENSE]:
                        "Der Merkur von {x} steht in einem schwierigen Aspekt zum Saturn von {y}. {y} kann für {x} wie ein Kritiker klingen, auch wenn {y} nur vorsichtig ist, und {x} kann sich von oben herab behandelt fühlen. Es wird besser, wenn {y} eine Frage stellt, statt eine Sorge zu verkünden.",
                    [TransitTextGroups.CONJUNCTION]:
                        "Der Merkur von {x} liegt auf dem Saturn von {y}. Ernste Gespräche fallen leicht, und {y} ist diejenige Person, die sich merkt, was vereinbart wurde. Sorgt dafür, dass ein Teil eurer Gespräche einfach nur Spaß macht.",
                },
                "mercury-uranus": {
                    [TransitTextGroups.FLOW]:
                        "Der Merkur von {x} steht in einem leichten Aspekt zum Uranus von {y}. {y} sagt Dinge, die {x} wirklich umdenken lassen, und {x} findet das Denken von {y} origineller, als {y} es selbst tut. Nie langweilig.",
                    [TransitTextGroups.TENSE]:
                        "Der Merkur von {x} steht in einem schwierigen Aspekt zum Uranus von {y}. {y} unterbricht, wechselt das Thema und liegt oft genug richtig, um es zum Verrücktwerden zu machen. {x} muss manchmal einen Gedanken zu Ende bringen dürfen. Sag es.",
                    [TransitTextGroups.CONJUNCTION]:
                        "Der Merkur von {x} liegt auf dem Uranus von {y}. Ideen fliegen zwischen {x} und {y} schneller hin und her, als beide sie aufschreiben können. Großartig zum Erfinden, weniger gut für einen ruhigen Sonntag.",
                },
            },
        },
        [SynastrySections.LONG_TERM]: {
            title: "Langfristiges Potenzial",
            none: "Saturn bildet keinen engen Kontakt zwischen den beiden Horoskopen, und keine der beiden Sonnen aspektiert die andere. Es gibt hier keinen eingebauten Kitt und auch kein eingebautes Hindernis. Ob es hält, ist eine Entscheidung, die {a} und {b} treffen und immer wieder treffen, was manche befreiend und andere schwer finden.",
            pairs: {
                "saturn-sun": {
                    [TransitTextGroups.FLOW]:
                        "Der Saturn von {x} steht in einem leichten Aspekt zur Sonne von {y}. {x} tut der Disziplin von {y} gut, und {y} bringt Wärme in die Ernsthaftigkeit von {x}. Das ist der Aspekt eines Menschen, der dem anderen beim Erwachsenwerden hilft, ohne ihn klein zu machen.",
                    [TransitTextGroups.TENSE]:
                        "Der Saturn von {x} steht in einem schwierigen Aspekt zur Sonne von {y}. {x} kann sich für {y} wie eine Bremse anfühlen, und {y} kann sich für {x} wie ein Risiko anfühlen. Wenn es funktioniert, ist es eine dauerhafte Bindung, aber der Preis ist, dass {x} öfter Ja sagen muss, als es sich natürlich anfühlt.",
                    [TransitTextGroups.CONJUNCTION]:
                        "Der Saturn von {x} liegt auf der Sonne von {y}. Ein schwerer, haltbarer Kontakt: {x} nimmt {y} ernst, und {y} übernimmt in der Nähe von {x} Verantwortung. Je nach Woche fühlt es sich wie ein Gewicht oder wie ein Kiel an.",
                },
                "saturn-moon": {
                    [TransitTextGroups.FLOW]:
                        "Der Saturn von {x} steht in einem leichten Aspekt zum Mond von {y}. {y} fühlt sich bei {x} auf eine praktische, verlässliche Weise sicher, und {x} fühlt sich gebraucht. Nicht der romantischste Kontakt, aber einer der besten, um zusammenzubleiben.",
                    [TransitTextGroups.TENSE]:
                        "Der Saturn von {x} steht in einem schwierigen Aspekt zum Mond von {y}. {y} kann sich von {x} beurteilt oder auf Abstand gehalten fühlen, und {x} kann die Bedürfnisse von {y} als Forderung empfinden. Pflichtgefühl hält es zusammen; Freundlichkeit, ganz bewusst geschenkt, macht es wert, zusammengehalten zu werden.",
                    [TransitTextGroups.CONJUNCTION]:
                        "Der Saturn von {x} liegt auf dem Mond von {y}. Hier gibt es Loyalität, und manchmal kommt eine Traurigkeit zu Besuch. {y} braucht es, dass {x} weicher wird; {x} braucht es, dass {y} darauf vertraut, dass die Beständigkeit Liebe ist.",
                },
                "saturn-venus": {
                    [TransitTextGroups.FLOW]:
                        "Der Saturn von {x} steht in einem leichten Aspekt zur Venus von {y}. Zuneigung ist hier geduldig und hält ihre Versprechen. {x} und {y} sind das Paar, von dem Freunde sagen, es wirke, als wären die beiden schon ewig zusammen.",
                    [TransitTextGroups.TENSE]:
                        "Der Saturn von {x} steht in einem schwierigen Aspekt zur Venus von {y}. {y} kann sich von {x} nicht wertgeschätzt fühlen, und {x} kann das Gefühl haben, {y} wolle zu viel. Die Bindung ist echt, aber {x} muss das Liebevolle auch laut aussprechen, statt anzunehmen, dass es schon bekannt ist.",
                    [TransitTextGroups.CONJUNCTION]:
                        "Der Saturn von {x} liegt auf der Venus von {y}. Eine ernste Art von Liebe: langsam im Anfangen, schwer zu beenden. Macht Platz für Leichtigkeit, sonst kann sie grau werden.",
                },
                "saturn-saturn": {
                    [TransitTextGroups.FLOW]:
                        "Die beiden Saturne stehen in einem leichten Aspekt. {x} und {y} haben vereinbare Vorstellungen davon, was Verbindlichkeit kostet und wofür sie da ist. Unspektakulär, und es zählt mehr als fast alles andere auf dieser Seite.",
                    [TransitTextGroups.TENSE]:
                        "Die beiden Saturne stehen in einem schwierigen Aspekt. {x} und {y} sind mit unterschiedlichen Lektionen über Verantwortung aufgewachsen, und das zeigt sich darin, wie beide mit Geld, Zeit und Versprechen umgehen. Man kann Brücken bauen; dafür braucht es ausdrückliche Absprachen statt Annahmen.",
                    [TransitTextGroups.CONJUNCTION]:
                        "Die beiden Saturne stehen zusammen, was meist bedeutet, dass {x} und {y} im selben langen Zyklus geboren sind. Sie haben ähnliche Vorstellungen davon, was hält und was es kostet. Ein ruhiges, solides Fundament.",
                },
                "sun-jupiter": {
                    [TransitTextGroups.FLOW]:
                        "Die Sonne von {x} steht in einem leichten Aspekt zum Jupiter von {y}. {y} glaubt an {x}, sichtbar, und {x} wächst in diesem Licht. Großzügig, glücklich und gut auf lange Sicht.",
                    [TransitTextGroups.TENSE]:
                        "Die Sonne von {x} steht in einem schwierigen Aspekt zum Jupiter von {y}. Die wiederkehrende Meinungsverschiedenheit dreht sich darum, wie viel genug ist. Sie löst sich nie ganz auf, und das muss sie auch nicht, solange beide darüber lachen können.",
                    [TransitTextGroups.CONJUNCTION]:
                        "Die Sonne von {x} liegt auf dem Jupiter von {y}. {y} gibt {x} das Gefühl, dass mehr möglich ist, und {x} gibt {y} etwas, wofür sich Großzügigkeit lohnt. Behaltet die Ausgaben im Blick und genießt den Rest.",
                },
                "sun-sun": {
                    [TransitTextGroups.FLOW]:
                        "Die beiden Sonnen stehen in einem leichten Aspekt. {x} und {y} wollen Ähnliches vom Leben und gehen es auf vereinbare Weise an. Unterstützung ergibt sich wie von selbst, Respekt ebenso.",
                    [TransitTextGroups.TENSE]:
                        "Die beiden Sonnen stehen in einem schwierigen Aspekt. {x} und {y} ziehen in unterschiedliche Richtungen, und manchmal hat jede Person das Gefühl, die andere stehe im Weg. Es funktioniert, wenn beide ein eigenes Leben haben und es mit nach Hause bringen.",
                    [TransitTextGroups.CONJUNCTION]:
                        "Die beiden Sonnen stehen zusammen. {x} und {y} sind sich sehr ähnlich in dem, wofür sie hier sind, was tröstlich und manchmal auch ein Wettbewerb ist. Wechselt euch damit ab, im Rampenlicht zu stehen.",
                },
            },
        },
    },

    score: {
        bands: {
            [SynastryBands.STRAINED]: {
                plain: "Angespannt",
                mixed: "Angespannt, aber nicht ohne Wärme",
            },
            [SynastryBands.WORKABLE]: {
                plain: "Machbar",
                mixed: "Machbar, mit Reibung",
            },
            [SynastryBands.WARM]: {
                plain: "Warm",
                mixed: "Warm, mit Reibung",
            },
            [SynastryBands.RARE]: {
                plain: "Seltene Leichtigkeit",
                mixed: "Seltene Leichtigkeit, mit Kante",
            },
        },
        detail: "{flow} fließend · {hard} schwierig · {exact} exakt",
        note: "Wir reduzieren zwei Horoskope nicht auf eine Prozentzahl. Die Nadel fasst das Verhältnis von leichten und schwierigen Kontakten zwischen den persönlichen Planeten zusammen; die eigentliche Deutung steht in den Abschnitten unten.",
    },

    headline: {
        template: "{a} und {b}: {emotional}, {communication} und {longTerm}.",
        emotional: [
            "ein vorsichtiges Herz",
            "ein Herz, das sich Zeit lässt",
            "ein leichtes Herz",
        ],
        communication: [
            "zwei verschiedene Sprachen",
            "ein hartnäckiger Streit",
            "dieselbe Sprache",
        ],
        longTerm: [
            "eine offene Frage, was bleibt",
            "verschiedene Uhren",
            "dieselbe Vorstellung davon, was bleibt",
        ],
    },
}

export default de
