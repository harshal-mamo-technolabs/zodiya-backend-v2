import {
    AspectTypes,
    Bodies,
    HoroscopeCategories,
    HoroscopePeriods,
    Lunations,
    MoodBands,
    MoonPhases,
    QUIET_RELATION,
    SupportedLanguages,
    ZodiacSigns,
} from "../../constants/index.ts"
import type { HoroscopeCopy, HoroscopePeriodCopy } from "../../types/index.ts"

/**
 * German horoscope copy, mirroring en.ts slot for slot. {planet} is either a
 * bare name ("Venus") or a light with its article ("der Mond", "die Sonne"),
 * so every sentence uses it as the subject, in the nominative.
 */

const C = HoroscopeCategories
const R = { ...AspectTypes, QUIET: QUIET_RELATION } as const

const daily: HoroscopePeriodCopy = {
    [C.PERSONAL]: {
        [R.CONJUNCTION]: [
            "{planet} steht heute in deinem Zeichen, und die Menschen, die dir nahestehen, spüren es vor dir. Sag das Warme früh, bevor der Tag sich füllt. Jemand wartet darauf mehr, als er zugeben würde.",
            "{planet} steht in deinem Zeichen, und heute bist du angenehm im Umgang und schwer zu widerlegen. Nutze das für das Gespräch, um das du schon länger kreist. Frag direkt, statt nur anzudeuten.",
        ],
        [R.SEXTILE]: [
            "{planet} steht zwei Zeichen von deinem entfernt und öffnet eine kleine Tür. Ein Freund, eine Nachbarin oder eine unerwartete Nachricht gibt dem Tag seine Form. Antworte noch am selben Tag.",
            "Ein leichter Tag für die Menschen um dich herum. {planet} macht es dir einfach, mühelos freundlich zu sein, also schenk diese Leichtigkeit jemandem, der eine härtere Woche hatte als du.",
        ],
        [R.SQUARE]: [
            "{planet} bildet ein Quadrat zu deinem Zeichen, also will heute jemand Nahestehendes mehr von dir, als du geben kannst. Versprich nicht den ganzen Abend. Schenk eine ehrliche Stunde und meine sie auch so.",
            "Reibung zu Hause oder in der Partnerschaft, und niemand ist schuld. {planet} steht in einem harten Winkel zu deinem Zeichen, und kleine Bitten kommen als Forderungen an. Wiederhole, was du gehört hast, bevor du antwortest.",
        ],
        [R.TRINE]: [
            "{planet} bildet ein Trigon zu deinem Zeichen, und die Menschen um dich herum sind heute auf deiner Seite. Gemeinsame Pläne halten. Sag Ja zur Einladung, auch wenn du dafür etwas verschieben musst.",
            "Ein ruhiger, liebevoller Tag. {planet} steht in einem leichten Aspekt, und du kannst das heikle Thema ansprechen, ohne auf Widerstand zu stoßen. Tu es beim Essen, nicht per Nachricht.",
        ],
        [R.OPPOSITION]: [
            "{planet} steht deinem Zeichen gegenüber, in dem Teil des Himmels, der den anderen gehört. Heute ist die Sicht des anderen die hilfreiche. Stell eine Frage und lass die Antwort länger sein, als dir lieb ist.",
            "Jemand hält dir heute den Spiegel vor, nicht immer freundlich. {planet} steht deinem Zeichen gegenüber, ein Tag zum Zuhören statt zum Erklären. Was du lernst, ist das Unbehagen wert.",
        ],
        [R.QUIET]: [
            "Heute zieht nichts stark an den Menschen in deinem Leben, und das ist ein eigenes Geschenk. Schreib der Freundin, der du schon lange schreiben wolltest. An ruhigen Tagen werden solche Nachrichten beantwortet.",
            "Ein schlichter Tag für Liebe und Freundschaft, ohne dass etwas drängt. Halte das Versprechen von letzter Woche und lass das die ganze Romantik des Tages sein.",
        ],
    },
    [C.PROFESSION]: {
        [R.CONJUNCTION]: [
            "{planet} steht in deinem Zeichen und rückt dich heute ins Zentrum der Arbeit, ob du willst oder nicht. Nimm das Meeting, steh zur Entscheidung und halte die E-Mail kurz. Einer klaren Führung folgen die Leute.",
            "Heute fällt dein Name. {planet} steht in deinem Zeichen und richtet das Scheinwerferlicht auf deine Arbeit, also sorge dafür, dass das Fertige sichtbar ist und nicht der Entwurf.",
        ],
        [R.SEXTILE]: [
            "{planet} steht in leichter Reichweite deines Zeichens. Ein Kollege oder ein Kontakt hat etwas Nützliches, und du musst nur fragen. Der Vormittag eignet sich besser dafür als der Nachmittag.",
            "Ein machbarer, angenehmer Arbeitstag. Nichts brennt, und kleine Dinge werden erledigt. Nutze ihn, um die Liste abzuarbeiten, die seit letzter Woche still gewachsen ist.",
        ],
        [R.SQUARE]: [
            "{planet} bildet ein Quadrat zu deinem Zeichen, und die Arbeit leistet Widerstand. Etwas, von dem du dachtest, es hält, muss abgestützt werden. Mach zuerst den langweiligen Teil und fang nichts Neues an, bevor das Aktuelle fertig ist.",
            "Ein Tag voller Widerstand bei der Arbeit: Eine Frist verschiebt sich, ein Werkzeug streikt, jemand ist nicht erreichbar. Das ist Reibung, kein Scheitern. Verkleinere den Umfang, halte den Anspruch und bring eine Sache ordentlich zu Ende.",
        ],
        [R.TRINE]: [
            "{planet} bildet ein Trigon zu deinem Zeichen, und die Arbeit läuft so, wie du es dir immer erhoffst. Sag heute klar, was die Arbeit wert ist. Schick die Nachricht vor dem Nachmittag, solange die Leichtigkeit anhält.",
            "Ein produktiver Tag ohne Kampf. Was du aufgeschoben hast, weil es sich wie eine Schlacht anfühlte, ist heute keine. Fang jetzt an, und du kommst weiter als erwartet.",
        ],
        [R.OPPOSITION]: [
            "{planet} steht deinem Zeichen gegenüber, also dreht sich die Arbeit heute um die andere Seite: die Kundin, den Chef, die Person, die Ja sagen muss. Deren Timing bestimmt den Tag. Bereite dich vor und warte dann.",
            "Heute wirst du still gemessen, von jemandem auf der anderen Seite des Tisches. {planet} steht deinem Zeichen gegenüber und belohnt die ruhige Antwort mehr als die kluge. Sag weniger und lass die Arbeit sprechen.",
        ],
        [R.QUIET]: [
            "Ein ruhiger, unauffälliger Arbeitstag, und genau auf solchen Tagen werden Karrieren gebaut. Erledige die nächste Sache auf der Liste gut. Heute wird es niemand bemerken, und genau darum geht es.",
            "Am Himmel zieht heute nichts an deinem Berufsleben. Nutze die Ruhe zum Aufräumen: den Posteingang, die Ablage, das eine Dokument, nach dem alle ständig fragen.",
        ],
    },
    [C.EMOTIONS]: {
        [R.CONJUNCTION]: [
            "{planet} steht in deinem Zeichen, und heute fühlst du alles in voller Lautstärke. Das ist kein Problem, das gelöst werden muss. Lass die Stimmung eine Stunde lang sein, was sie ist, dann legt sie sich von selbst.",
            "Ein zarter, dünnhäutiger Tag. {planet} steht in deinem Zeichen, und die kleinen Dinge erreichen dich, das freundliche Wort genauso wie das achtlose. Umgib dich mit sanften Menschen.",
        ],
        [R.SEXTILE]: [
            "Eine leichte, ausgeglichene Stimmung. {planet} steht in einem leichten Winkel zu deinem Zeichen, und der Tag verlangt dir emotional wenig ab. Genieß das, es ist seltener, als es klingt.",
            "Gefühle liegen nah an der Oberfläche, aber nicht schwer. Ein guter Tag, etwas laut auszusprechen, das du schon eine Weile fühlst, und zu hören, wie es klingt.",
        ],
        [R.SQUARE]: [
            "{planet} bildet ein Quadrat zu deinem Zeichen, also rechne mit einer leisen Gereiztheit ohne klaren Anlass. Sie gehört zum Himmel, nicht zu den Menschen um dich. Lass sie nicht an ihnen aus.",
            "Ein kratziger Tag im Inneren. Etwas wird von dir verlangt, und du willst es nicht geben. Benenne das Gefühl für dich und entscheide bis morgen nichts.",
        ],
        [R.TRINE]: [
            "{planet} bildet ein Trigon zu deinem Zeichen, und das innere Wetter ist gut. Du fühlst dich wie du selbst. Tu das, was nur bei guter Laune gelingt: den schwierigen Anruf, die ehrliche Nachricht.",
            "Warm, ruhig, ohne Eile. Die Leichtigkeit heute ist die Art, die dich großzügig macht. Schenk sie jemandem, der mehr trägt, als er sagt.",
        ],
        [R.OPPOSITION]: [
            "{planet} steht deinem Zeichen gegenüber, und heute hängt deine Stimmung mehr als sonst von einem anderen Menschen ab. Das ist in Ordnung, solange du es weißt. Nimm das Kompliment an und lass die Spitze abprallen.",
            "Ein Tag, an dem du hin- und hergerissen bist zwischen dem, was du fühlst, und dem, was jemand anderes braucht. Keines muss gewinnen. Sag, was für dich wahr ist, und lass Raum für das, was für den anderen wahr ist.",
        ],
        [R.QUIET]: [
            "Ein ruhiger Tag ohne starkes Gefühlswetter. Wenn etwas hochkommt, ist es eher alt als neu. Lass es durchziehen, ohne eine Geschichte daranzuhängen.",
            "Ausgeglichen und still. Am Himmel drückt heute nichts auf dich, also darfst du selbst wählen, was du fühlst. Wähl das Leichtere.",
        ],
    },
    [C.HEALTH]: {
        [R.CONJUNCTION]: [
            "{planet} steht in deinem Zeichen und bringt Energie, aber ungleich verteilt. Beweg dich früh, iss mittags richtig, dann trägt dich der Abend. Lässt du die Bewegung am Morgen aus, zieht sich der Tag.",
            "Ein Tag mit viel Spannung im Körper. Gut für Anstrengung, schlecht für Stillsitzen. Wenn du schon länger etwas Sportliches anfangen wolltest, fällt der Anfang heute leicht.",
        ],
        [R.SEXTILE]: [
            "Ein guter, gewöhnlicher Tag für den Körper. Nichts tut mehr weh als sonst, und die Energie ist da, du musst nur zugreifen. Ein Spaziergang bei Tageslicht bringt heute mehr als morgen.",
            "Kleine, beständige Energie. {planet} begünstigt die Routine statt der Heldentat. Tu, was du jeden Tag tust, und tu es ein bisschen besser.",
        ],
        [R.SQUARE]: [
            "{planet} bildet ein Quadrat zu deinem Zeichen, also braucht der Körper mehr Pflege, als du eingeplant hast. Schlafmangel macht sich bemerkbar. Geh früh ins Bett, das ist richtig, auch wenn es sich wie eine Niederlage anfühlt.",
            "Die Anspannung sitzt heute in Schultern und Kiefer. Das ist der Druck des Himmels, nichts, was nicht stimmt. Dehn dich, trink Wasser und sag das ab, wovor dir graut, wenn du kannst.",
        ],
        [R.TRINE]: [
            "{planet} bildet ein Trigon zu deinem Zeichen, und der Körper fühlt sich leistungsfähig an. Ein wirklich guter Tag, um mit der Routine zu beginnen, von der du seit einem Monat erzählst. Fang klein an, dann bleibst du dabei.",
            "Die Energie ist gut und bleibt gut. Steck sie in etwas, das dich auf die richtige Art müde macht. Der Schlaf heute Nacht wird der tiefste der Woche.",
        ],
        [R.OPPOSITION]: [
            "{planet} steht deinem Zeichen gegenüber, und heute lässt sich der Körper leicht von den Plänen anderer um seine Ruhe bringen. Schütze eine Stunde, die nur dir gehört. Den Rest kannst du teilen.",
            "Deine Energie und der Zeitplan eines anderen liefern sich ein Tauziehen. Iss, wenn du Hunger hast, nicht wenn es gerade passt, dann läuft der Tag besser.",
        ],
        [R.QUIET]: [
            "Am Himmel drückt heute nichts auf den Körper. Behalte deine Gewohnheiten bei und füge keine neue hinzu. Beständigkeit ist die ganze Aufgabe.",
            "Ein körperlich neutraler Tag. Wenn du dich nicht gut fühlst, liegt es am Schlaf der letzten Nacht, nicht an den Sternen. Wasser, Tageslicht, früh schlafen. Mehr Raffinesse braucht es nicht.",
        ],
    },
    [C.TRAVEL]: {
        [R.CONJUNCTION]: [
            "{planet} steht in deinem Zeichen, und Bewegung tut dir heute gut. Nimm den längeren Weg, sag Ja zur Erledigung am anderen Ende der Stadt, buch die Sache. Der Tag belohnt es, woanders zu sein.",
            "Auf gute Art rastlos. {planet} steht in deinem Zeichen, und Reisen, die heute beginnen, verlaufen reibungslos, und Gespräche unterwegs gehen weiter als die zu Hause.",
        ],
        [R.SEXTILE]: [
            "Kurze Wege laufen heute reibungslos. Ein kleiner Ausflug oder eine Nachricht aus der Ferne kommt gut an. Was du heute Morgen buchst, ist das Günstigste der Woche.",
            "Ein leichter Tag, um unterwegs zu sein. Nichts Wichtiges verspätet sich, und die kleinen Umwege sind genau der Punkt. Brich zehn Minuten früher auf und genieß es.",
        ],
        [R.SQUARE]: [
            "{planet} bildet ein Quadrat zu deinem Zeichen, also verspäten sich kurze Wege und Nachrichten kreuzen sich. Kein Tag für knappe Anschlüsse. Plane jetzt Puffer ein, dann brauchst du ihn nicht.",
            "Pläne, die mit Entfernung zu tun haben, brauchen heute eine Überarbeitung, bevor sie stehen. Bestätige Zeit, Ort und Gleis und dann bestätige sie noch einmal.",
        ],
        [R.TRINE]: [
            "{planet} bildet ein Trigon zu deinem Zeichen, und der Weg öffnet sich. Größere Pläne, die du heute machst, sind die, die auch passieren. Wenn du auf den richtigen Tag zum Buchen gewartet hast: Heute ist er.",
            "Reisen und Nachrichten aus der Ferne laufen beide gut. Jemand in der Ferne denkt an dich und sagt es auch. Antworte richtig, nicht nur mit einem Daumen hoch.",
        ],
        [R.OPPOSITION]: [
            "{planet} steht deinem Zeichen gegenüber und lässt die Bewegung des Tages um jemand anderen kreisen: seine Ankunft, seine Verspätung, seine Wahl der Route. Geh mit. Sich gegen den Reiseplan zu sträuben kostet mehr, als ihm zu folgen.",
            "Ein Tag, an dem du anderen auf halbem Weg entgegenkommst, manchmal wörtlich. Lass die andere Person Zeit und Ort bestimmen und bring mit, was sie vergessen hat.",
        ],
        [R.QUIET]: [
            "Heute zieht dich nichts zur Tür hinaus. Bleib, wo du bist, und plane stattdessen: Die Reise, von der du ständig sprichst, bekommt ein Datum, und das ist mehr, als sie gestern hatte.",
            "Ein stiller Tag für Reisen und Besorgungen. Wenn du los musst, dann früh. Der Nachmittag ist zum Bleiben da.",
        ],
    },
    [C.LUCK]: {
        [R.CONJUNCTION]: [
            "{planet} steht in deinem Zeichen, und der Tag ist geneigt, Ja zu sagen. Bitte um das, was du schon geprobt hast. Gefälligkeiten kommen über Menschen, die etwas über dir stehen, also nimm die Vorstellung an.",
            "Ein Tag, der sich nach Glück anfühlt, und das Gefühl stimmt meistens. {planet} steht in deinem Zeichen, und bei kleinen Dingen neigen sich die Chancen zu dir. Setz nicht das Große darauf.",
        ],
        [R.SEXTILE]: [
            "Eine kleine gute Nachricht kommt über jemanden, mit dem du seit Monaten nicht gesprochen hast. {planet} steht in einem leichten Winkel und macht den Tag angenehm überraschend statt dramatisch.",
            "Stilles Glück: eine Schlange, die sich bewegt, eine Gebühr, die erlassen wird, ein Platz, der frei ist. Nimm es wahr. Solche Tage sind häufiger als die großen und leichter zu übersehen.",
        ],
        [R.SQUARE]: [
            "{planet} bildet ein Quadrat zu deinem Zeichen, also gibt es heute keinen leichten Gewinn. Nichts ist gegen dich, der Himmel verschenkt nur gerade nichts. Verdien es dir oder warte.",
            "Ein Tag, um das Geld in der Tasche und deinen Namen aus der Verlosung zu lassen. Was wie eine Abkürzung aussieht, kostet mehr als der lange Weg. Morgen stehen die Chancen besser.",
        ],
        [R.TRINE]: [
            "{planet} bildet ein Trigon zu deinem Zeichen, und der Tag ist großzügig. Sag Ja zu dem, was kommt, aber prüf, wie groß der Bissen ist. Glück kommt heute über das Timing, also sei da, wo du gesagt hast, dass du sein wirst.",
            "Die Dinge fallen dir zu, ohne dass du schieben musst. Die richtige Person sitzt am richtigen Schreibtisch, die Antwort ist Ja, die Tür steht offen. Geh hindurch.",
        ],
        [R.OPPOSITION]: [
            "{planet} steht deinem Zeichen gegenüber, das Glück des Tages gehört also jemand anderem, und ein Teil davon färbt ab. Sei in der Nähe von Menschen, die einen guten Tag haben. Gratuliere ihnen von Herzen.",
            "Das Glück kommt heute aus zweiter Hand: über einen Partner, einen Rivalen, eine Fremde, deren Entscheidung dir hilft. Sei großzügig, dann hält es an.",
        ],
        [R.QUIET]: [
            "Heute kommt nichts ungefragt, und das ist in Ordnung, denn der Tag belohnt das Fragen. Stell die Bitte, auf der du schon länger sitzt, und nimm die Antwort, wie sie ist.",
            "Ein ausgeglichener Tag, weder verzaubert noch verflucht. Glück dieser Größe wird gemacht, nicht gefunden. Tu das Kleine, das dich dem Größeren in den Weg stellt.",
        ],
    },
}

const weekly: HoroscopePeriodCopy = {
    [C.PERSONAL]: {
        [R.CONJUNCTION]: [
            "{planet} verbringt die Woche in deinem Zeichen, und du bist die Person, zu der es alle zieht. Eine gute Woche, um Gäste einzuladen, dich zu versöhnen und das zu sagen, was du dir aufgehoben hast. So klar gesehen zu werden ist eine Chance, also nutze sie freundlich.",
        ],
        [R.SEXTILE]: [
            "{planet} steht die ganze Woche zwei Zeichen von deinem entfernt, und die Menschen in deinem Leben sind leicht zu erreichen und angenehm um dich. Freunde tun diese Woche mehr für dich als die Familie. Lass sie.",
        ],
        [R.SQUARE]: [
            "{planet} bildet diese Woche ein Quadrat zu deinem Zeichen, und die Menschen, die dir am nächsten sind, spüren es als Druck. Jemand will mehr, als du gibst, oder umgekehrt. Führ das unangenehme Gespräch bis Donnerstag, statt es ins Wochenende mitzunehmen.",
        ],
        [R.TRINE]: [
            "{planet} bildet ein Trigon zu deinem Zeichen, und die Woche ist warm im Nahbereich. Pläne mit Partner oder Freundin halten, und das schwierige Thema lässt sich ansprechen, ohne dass es im Raum kalt wird. Eine gute Woche, um zuerst großzügig zu sein.",
        ],
        [R.OPPOSITION]: [
            "{planet} steht diese Woche deinem Zeichen gegenüber, in dem Teil des Himmels, der den anderen gehört. Partnerschaften, Verträge, die andere Seite jedes Gesprächs: Dort entscheidet sich die Woche. Hör doppelt so viel zu, wie du sprichst, und du gehst gestärkt daraus hervor.",
        ],
        [R.QUIET]: [
            "Eine ruhige Woche für Liebe und Freundschaft, in der nichts in die eine oder andere Richtung drängt. Nutze sie zur Pflege: der Anruf, den du schuldest, der Geburtstag, den du fast vergessen hättest, die kleine Freundlichkeit, die eine Freundschaft zwischen den großen Momenten lebendig hält.",
        ],
    },
    [C.PROFESSION]: {
        [R.CONJUNCTION]: [
            "{planet} steht die ganze Woche in deinem Zeichen, also ist deine Arbeit sichtbar, ob du es geplant hast oder nicht. Zeig den Leuten das Fertige, nicht den Entwurf. Entscheidungen, die diese Woche deinen Namen tragen, haben meist Bestand.",
        ],
        [R.SEXTILE]: [
            "Eine machbare Woche, in der Hilfe nur eine Frage entfernt ist. {planet} hält den richtigen Kontakt in Reichweite, und ein kurzes Gespräch früh in der Woche erspart später ein langes. Stell die Frage am Montag.",
        ],
        [R.SQUARE]: [
            "{planet} bildet diese Woche ein Quadrat zu deinem Zeichen und setzt die Arbeit unter Druck. Etwas, das in Eile gebaut wurde, muss ordentlich neu gebaut werden. Kürze den Umfang, nicht den Anspruch, und fang nichts Neues an, bevor das Aktuelle fertig ist.",
        ],
        [R.TRINE]: [
            "{planet} bildet ein Trigon zu deinem Zeichen, und die Woche läuft so, wie du es dir von einer Woche immer erhoffst. Verlang, was die Arbeit wert ist, schick das Angebot, nimm den Termin wahr. Die Leichtigkeit hält bis Freitag, also stell deine Anfragen früh.",
        ],
        [R.OPPOSITION]: [
            "{planet} steht deinem Zeichen gegenüber, also hängt die Arbeit diese Woche an der Entscheidung eines anderen: einer Kundin, eines Chefs, eines Partners auf der anderen Seite des Tisches. Bereite dich gründlich vor und warte dann, ohne nachzuhaken. Die ruhige Antwort schlägt die kluge.",
        ],
        [R.QUIET]: [
            "Am Himmel zieht diese Woche nichts an deinem Berufsleben, und genau dann wird wirklich aufgebaut. Arbeite den Rückstand ab, repariere das, worum alle herumarbeiten, und schreib den Ablauf auf, den nur du kennst.",
        ],
    },
    [C.EMOTIONS]: {
        [R.CONJUNCTION]: [
            "{planet} steht in deinem Zeichen und dreht diese Woche die Lautstärke bei allem auf, was du fühlst. Du bist offener als sonst und leichter zu verletzen. Wähl deine Gesellschaft mit Bedacht, dann wird es eine gute Woche.",
        ],
        [R.SEXTILE]: [
            "Eine leichte, ausgeglichene Woche im Inneren. {planet} steht in einem leichten Winkel zu deinem Zeichen, hält die Stimmung stabil und die kleinen Freuden nah. Sprich laut aus, was du fühlst, es klingt besser, als du befürchtest.",
        ],
        [R.SQUARE]: [
            "{planet} bildet ein Quadrat zu deinem Zeichen, und die Woche hat eine scharfe Kante. Gereiztheit kommt ohne erkennbaren Grund und sucht einen Landeplatz. Beweg deinen Körper, hüte deine Zunge und lass die Stimmung durchziehen, statt in ihr etwas zu entscheiden.",
        ],
        [R.TRINE]: [
            "{planet} bildet ein Trigon zu deinem Zeichen, und das innere Wetter ist die ganze Woche gut. Du fühlst dich wie du selbst, und die Menschen um dich bekommen deine beste Version. Schenk etwas von dieser Leichtigkeit der Person, die am meisten getragen hat.",
        ],
        [R.OPPOSITION]: [
            "{planet} steht deinem Zeichen gegenüber und macht dies zu einer Woche, in der du durch andere fühlst: Ihre Stimmungen bestimmen deine mehr als sonst. Nimm Komplimente beim Wort und lass Spitzen abprallen. Halte dir einen Abend frei, der nur dir gehört.",
        ],
        [R.QUIET]: [
            "Eine ruhige, ereignislose Woche für die Gefühle. Wenn etwas hochkommt, ist es eher alt als neu, und es zieht am besten durch, ohne dass du eine Geschichte daranhängst. Ruhe ist der Sinn einer solchen Woche.",
        ],
    },
    [C.HEALTH]: {
        [R.CONJUNCTION]: [
            "{planet} steht in deinem Zeichen und lädt den Körper diese Woche auf, wenn auch ungleich verteilt. Nutze die Energie früh am Tag und früh in der Woche. Schütze ab Freitag deinen Schlaf, die Energie ist echt, aber sie geht zur Neige.",
        ],
        [R.SEXTILE]: [
            "Eine stabile Woche für den Körper, die Energie ist da, wenn du nach ihr greifst. {planet} begünstigt die Routine statt der Heldentat. Die Gewohnheit, die du diese Woche jeden Tag pflegst, ist die, die den Monat übersteht.",
        ],
        [R.SQUARE]: [
            "{planet} bildet diese Woche ein Quadrat zu deinem Zeichen, und der Körper braucht mehr Pflege, als du eingeplant hast. Verspannung in Nacken und Schultern, kürzerer Schlaf, eine kürzere Zündschnur. Wasser, Tageslicht, früh ins Bett. Sag das ab, wovor dir graut.",
        ],
        [R.TRINE]: [
            "{planet} bildet ein Trigon zu deinem Zeichen, und der Körper fühlt sich die ganze Woche leistungsfähig an. Ein wirklich guter Zeitpunkt, mit der Routine zu beginnen, von der du ständig erzählst. Fang an einem Wochentag an, und am Sonntag ist sie eine Gewohnheit statt eines Plans.",
        ],
        [R.OPPOSITION]: [
            "{planet} steht deinem Zeichen gegenüber, und diese Woche bringen die Zeitpläne anderer den Körper immer wieder um seine Ruhe. Schütze jeden Tag eine Stunde, die niemand anderem gehört. Iss, wenn du Hunger hast, nicht wenn es passt.",
        ],
        [R.QUIET]: [
            "Am Himmel drückt diese Woche nichts auf den Körper. Behalte deine Gewohnheiten bei und füge keine neue hinzu. Wenn du dich nicht gut fühlst, liegt es an Schlaf oder Essen, nicht an den Sternen.",
        ],
    },
    [C.TRAVEL]: {
        [R.CONJUNCTION]: [
            "{planet} steht in deinem Zeichen und macht dies zu einer Woche der Bewegung: Reisen, Besorgungen, der Besuch, den du ständig verschiebst. Reisen, die diese Woche beginnen, verlaufen reibungslos, und Gespräche fern von zu Hause gehen weiter als die daheim.",
        ],
        [R.SEXTILE]: [
            "Bewegung fällt diese Woche leicht, und Nachrichten aus der Ferne sind gut. Was du früh in der Woche buchst, ist am günstigsten, und der Papierkram bleibt ehrlich. Mach den kurzen Ausflug.",
        ],
        [R.SQUARE]: [
            "{planet} bildet diese Woche ein Quadrat zu deinem Zeichen, also verspäten sich Reisen und Nachrichten kreuzen sich. Bestätige jede Zeit und jeden Ort zweimal. Keine Woche für knappe Anschlüsse oder um etwas zu unterschreiben, das von weit her kommt.",
        ],
        [R.TRINE]: [
            "{planet} bildet ein Trigon zu deinem Zeichen, und der Weg öffnet sich. Größere Pläne, die du diese Woche machst, sind die, die wirklich passieren, und jemand in der Ferne denkt an dich und sagt es auch. Buch die Sache.",
        ],
        [R.OPPOSITION]: [
            "{planet} steht deinem Zeichen gegenüber und lässt die Bewegung der Woche um andere kreisen: ihre Ankünfte, ihre Verspätungen, ihre Wahl der Route. Folge dem Reiseplan, der nicht deiner ist, und bring mit, was sie vergessen haben.",
        ],
        [R.QUIET]: [
            "Diese Woche zieht dich nichts stark zur Tür hinaus. Plane, statt zu fahren: Gib der Reise, von der du ständig sprichst, ein Datum und ein Budget, und das ist mehr, als sie letzte Woche hatte.",
        ],
    },
    [C.LUCK]: {
        [R.CONJUNCTION]: [
            "{planet} steht in deinem Zeichen und neigt die Woche zum Ja. Bitte um das, was du schon geprobt hast, und nimm die Vorstellung an, auch wenn das Timing ungünstig ist. Gefälligkeiten kommen über Menschen, die etwas über dir stehen.",
        ],
        [R.SEXTILE]: [
            "Stilles Glück die ganze Woche: eine Schlange, die sich bewegt, eine erlassene Gebühr, gute Nachrichten von jemandem, von dem du monatelang nichts gehört hast. Nimm es wahr und bedank dich richtig, so geht es weiter.",
        ],
        [R.SQUARE]: [
            "{planet} bildet ein Quadrat zu deinem Zeichen, und der leichte Gewinn ist diese Woche vom Tisch. Nichts ist gegen dich, der Himmel verschenkt nur gerade nichts. Lass das Geld in der Tasche und verdien dir, was du willst.",
        ],
        [R.TRINE]: [
            "{planet} bildet ein Trigon zu deinem Zeichen, und die Woche ist großzügig. Die richtige Person sitzt am richtigen Schreibtisch, und die Antwort ist Ja. Sag Ja zurück, aber prüf vorher, wie groß der Bissen ist.",
        ],
        [R.OPPOSITION]: [
            "{planet} steht deinem Zeichen gegenüber, das Glück dieser Woche gehört also jemand anderem, und ein Teil davon färbt ab. Sei in der Nähe von Menschen, die eine gute Woche haben, gratuliere ihnen von Herzen und lass dich von der Welle tragen.",
        ],
        [R.QUIET]: [
            "Eine ausgeglichene Woche, weder verzaubert noch verflucht. Glück dieser Größe wird gemacht, nicht gefunden. Tu das Kleine, das dich dem Größeren in den Weg stellt, und hab dann Geduld.",
        ],
    },
}

const yearly: HoroscopePeriodCopy = {
    [C.PERSONAL]: {
        [R.CONJUNCTION]: [
            "{planet} verbringt das Jahr in deinem Zeichen, und so wird es ein Jahr über dich: wie du wirkst, was du willst, wer du wirst. Beziehungen passen sich daran an. Die, die das können, sind die, die du behalten solltest.",
        ],
        [R.SEXTILE]: [
            "{planet} steht dieses Jahr zwei Zeichen von deinem entfernt und hält Freunde, Nachbarn und den weiteren Kreis nah und hilfreich. Die wichtigen Menschen dieses Jahres sind nicht die offensichtlichen. Sag Ja zur Einladung vom Rand deines Lebens.",
        ],
        [R.SQUARE]: [
            "{planet} bildet dieses Jahr ein Quadrat zu deinem Zeichen, und die Menschen, die dir am nächsten sind, erleben es als Prüfung. Zuhause, Partnerschaft und Familie verlangen eine Entscheidung, die du aufgeschoben hast. Triff sie langsam und offen, dann endet das Jahr mit weniger Menschen, aber mit besseren.",
        ],
        [R.TRINE]: [
            "{planet} bildet ein Trigon zu deinem Zeichen, und es wird ein warmes Jahr im Nahbereich. Liebe und Freundschaft fallen dir leichter als seit Langem. Leg dich auf etwas fest, oder auf jemanden, solange der Himmel so freundlich ist.",
        ],
        [R.OPPOSITION]: [
            "{planet} steht dieses Jahr deinem Zeichen gegenüber, im Haus der Partnerschaft. Worum es in diesem Jahr auch geht, es geht um den anderen Menschen: einen kennenzulernen, einen zu halten oder endlich ehrlich zu einem zu sein. Dieses Jahr gehst du nicht allein.",
        ],
        [R.QUIET]: [
            "Kein langsamer Planet lastet dieses Jahr auf deinen Beziehungen, und so wird es ein Jahr der Wahl statt des Schicksals. Pflege, was du hast. Nichts wird dir genommen und nichts wird dir geschenkt.",
        ],
    },
    [C.PROFESSION]: {
        [R.CONJUNCTION]: [
            "{planet} steht das ganze Jahr in deinem Zeichen und rückt dein Berufsleben in den Vordergrund. Wofür du bekannt bist, wird geprüft und, wenn es hält, bestätigt. Übernimm die sichtbare Rolle, Verstecken funktioniert dieses Jahr ohnehin nicht.",
        ],
        [R.SEXTILE]: [
            "{planet} steht in leichter Reichweite deines Zeichens und gibt dem Jahr beruflich stetigen Rückenwind. Hilfe ist da, und kleine Chancen tauchen immer wieder auf. Keine davon ist der große Durchbruch, zusammen sind sie die Karriere.",
        ],
        [R.SQUARE]: [
            "{planet} bildet dieses Jahr ein Quadrat zu deinem Zeichen, und die Arbeit will auf festerem Boden neu gebaut werden. Etwas, mit dem du bisher durchgekommen bist, funktioniert nicht mehr. Das ist ein Belastungstest, keine Strafe. Was das Jahr übersteht, ist tragfähig.",
        ],
        [R.TRINE]: [
            "{planet} bildet ein Trigon zu deinem Zeichen, und in diesem Jahr öffnet sich die Arbeit. Verlang mehr, als höflich wirkt, nimm das größere Projekt, setz deinen Namen darauf. Der Himmel ist geneigt, Ja zu sagen, und so geneigt bleibt er nicht lange.",
        ],
        [R.OPPOSITION]: [
            "{planet} steht deinem Zeichen gegenüber, und die berufliche Geschichte des Jahres läuft über andere: die Partnerin, den Kunden, den Rivalen, der sich als Verbündeter entpuppt. Verhandle, statt zu befehlen. Das beste Ergebnis ist eines, das du nicht allein erreicht hast.",
        ],
        [R.QUIET]: [
            "Kein langsamer Planet lastet dieses Jahr auf deiner Arbeit. Das macht es zu einem Jahr der Festigung: Bring zu Ende, was offen ist, lern das, was du ständig aufschiebst, und verlass das Jahr mit einem aufgeräumteren Schreibtisch, als du es begonnen hast.",
        ],
    },
    [C.EMOTIONS]: {
        [R.CONJUNCTION]: [
            "{planet} steht in deinem Zeichen und macht dies zu einem Jahr, in dem du mehr fühlst als sonst: offener, durchlässiger, leichter berührt. Wähl deine Gesellschaft sorgfältig und lass dich vom Jahr ein wenig verändern. Genau das hat es vor.",
        ],
        [R.SEXTILE]: [
            "Ein Jahr mit sanfter Unterstützung im Inneren. {planet} steht in einem leichten Winkel und hält die Stimmung tragbar, selbst wenn die Umstände es nicht sind. Du meisterst dieses Jahr besser, als du erwartest.",
        ],
        [R.SQUARE]: [
            "{planet} bildet ein Quadrat zu deinem Zeichen, und etwas in dir will dieses Jahr angeschaut statt verwaltet werden. Ein altes Muster, eine stille Angst, eine Trauer, die nie ihre Zeit bekam. Gib ihr die Zeit. Das Jahr ist lang genug.",
        ],
        [R.TRINE]: [
            "{planet} bildet ein Trigon zu deinem Zeichen, und es wird ein Jahr, in dem du dich wie du selbst fühlst. Das innere Wetter ist gut und bleibt gut. Nutze es, um zu heilen, was ein härteres Jahr zerbrochen hat.",
        ],
        [R.OPPOSITION]: [
            "{planet} steht deinem Zeichen gegenüber und macht dies zu einem Jahr, in dem du dich durch andere kennenlernst. Was sie dir spiegeln, ist nicht immer angenehm, aber meist zutreffend. Nimm es langsam auf.",
        ],
        [R.QUIET]: [
            "Kein langsamer Planet drückt dieses Jahr auf dein Innenleben. Es ist ein ruhiges Jahr im besten Sinn und ein gutes, um die Gewohnheiten aufzubauen, die dich tragen, wenn lautere Jahre kommen.",
        ],
    },
    [C.HEALTH]: {
        [R.CONJUNCTION]: [
            "{planet} steht das Jahr über in deinem Zeichen und hält den Körper im Vordergrund. Die Energie läuft hoch und geht dann aus, das Jahr belohnt einen Rhythmus statt eines Kraftakts. Schlaf ist die ganze Strategie.",
        ],
        [R.SEXTILE]: [
            "Ein stabiles Jahr für den Körper, mit Unterstützung in der Nähe. {planet} begünstigt die Routine, die du halten kannst, statt des Plans, den du bewunderst. Bau die kleine Gewohnheit im ersten Quartal auf, dann trägt sie den Rest.",
        ],
        [R.SQUARE]: [
            "{planet} bildet dieses Jahr ein Quadrat zu deinem Zeichen, und der Körper verlangt die Pflege, die du aufgeschoben hast. Der Check-up, die Zahnärztin, der Schlaf. Nichts Dramatisches, wenn du dich darum kümmerst, etwas Dramatisches, wenn nicht.",
        ],
        [R.TRINE]: [
            "{planet} bildet ein Trigon zu deinem Zeichen, und der Körper ist dieses Jahr leistungsfähig. Ein gutes Jahr, um mit dem zu beginnen, wovon du schon eine Weile erzählst, und dabei zu bleiben. Kraft, die du jetzt aufbaust, hält.",
        ],
        [R.OPPOSITION]: [
            "{planet} steht deinem Zeichen gegenüber, und in diesem Jahr geht es gesundheitlich um das Gleichgewicht mit den Ansprüchen anderer. Schütze deine Ruhe vor ihren Zeitplänen. Was du dieses Jahr beschützt, behältst du.",
        ],
        [R.QUIET]: [
            "Kein langsamer Planet drückt dieses Jahr auf den Körper. Behalte, was funktioniert, füge nichts Heldenhaftes hinzu und nimm die Ruhe als das Geschenk, das sie ist.",
        ],
    },
    [C.TRAVEL]: {
        [R.CONJUNCTION]: [
            "{planet} steht in deinem Zeichen und macht dies zu einem Jahr der Bewegung und des Gesehenwerdens an neuen Orten. Reisen verändern etwas daran, wie du dich selbst siehst. Fahr irgendwohin, wo du noch nie warst, allein, wenn du kannst.",
        ],
        [R.SEXTILE]: [
            "Kurze Reisen und nahe Horizonte bringen dir dieses Jahr am meisten. {planet} hält den Weg leicht und die Nachrichten aus der Ferne gut. Die Reise, die zählt, liegt näher, als du denkst.",
        ],
        [R.SQUARE]: [
            "{planet} bildet ein Quadrat zu deinem Zeichen, und Reisen brauchen dieses Jahr mehr Planung als sonst. Verspätungen, Papierkram, eine Route, die geändert werden muss. Alles passiert trotzdem, nur nicht beim ersten Versuch.",
        ],
        [R.TRINE]: [
            "{planet} bildet ein Trigon zu deinem Zeichen, und dieses Jahr öffnet sich der ferne Horizont. Die lange Reise, das Studium im Ausland, der Umzug, über den du ständig sprichst. In diesem Jahr stimmt der Himmel der Idee zu.",
        ],
        [R.OPPOSITION]: [
            "{planet} steht deinem Zeichen gegenüber, und die Reisen dieses Jahres sind für andere oder mit anderen: der Umzug eines Partners, ein Familienbesuch, eine Reise, die jemand anderes geplant hat. Lass die anderen führen, dann siehst du mehr.",
        ],
        [R.QUIET]: [
            "Dieses Jahr zieht dich nichts stark in die Ferne. Reise, wenn du magst, am Himmel spricht nichts dagegen. Aber die eigentliche Reise des Jahres liegt näher an zu Hause.",
        ],
    },
    [C.LUCK]: {
        [R.CONJUNCTION]: [
            "{planet} steht das Jahr über in deinem Zeichen, eine glückliche Stellung, und das Glück liegt vor allem im Selbstvertrauen: Du bittest um mehr und bekommst mehr. Genieß das Ja und bleib mit einem Fuß auf dem Boden.",
        ],
        [R.SEXTILE]: [
            "Ein Jahr mit kleinem, stetigem Glück statt einem großen Durchbruch. {planet} hält Chancen über Freunde und Kontakte in Reichweite. Beantworte jede Nachricht, du weißt nicht, welche es ist.",
        ],
        [R.SQUARE]: [
            "{planet} bildet ein Quadrat zu deinem Zeichen, und das Jahr schenkt dir nichts. Was du dieses Jahr bekommst, verdienst du dir, und genau deshalb ist es mehr wert. Meide die Abkürzung, die Masche, den zu guten Preis.",
        ],
        [R.TRINE]: [
            "{planet} bildet ein Trigon zu deinem Zeichen, und das Jahr ist großzügig. Türen öffnen sich, ohne dass du drücken musst. Achte nur auf die Größe: Sag Ja zur Chance und Nein zur zusätzlichen Null.",
        ],
        [R.OPPOSITION]: [
            "{planet} steht deinem Zeichen gegenüber, und das Glück dieses Jahres kommt über andere. Eine Partnerschaft, eine Zusammenarbeit, die Entscheidung eines anderen, die dir am Ende hilft. Sei angenehm in der Zusammenarbeit, dann findet es dich.",
        ],
        [R.QUIET]: [
            "Ein ausgeglichenes Glücksjahr, weder verzaubert noch verflucht. Glück dieser Größe wird gebaut. Stell dich dorthin, wo die guten Dinge passieren, und hab genug Geduld, um noch da zu sein, wenn sie es tun.",
        ],
    },
}

const de: HoroscopeCopy = {
    lang: SupportedLanguages.DE,

    labels: {
        ephemeris: "Ephemeride",
        selectSign: "Wähle ein Zeichen",
        ruledBy: "Herrscher",
        periods: {
            [HoroscopePeriods.DAILY]: "Täglich",
            [HoroscopePeriods.WEEKLY]: "Wöchentlich",
            [HoroscopePeriods.YEARLY]: "Jährlich",
        },
        readings: "Sechs Deutungen",
        strength: "Stärke",
        mood: "Stimmung",
        luckyNumber: "Glückszahl",
        luckyColour: "Glücksfarbe",
        moon: {
            [HoroscopePeriods.DAILY]: "Mond heute",
            [HoroscopePeriods.WEEKLY]: "Mond diese Woche",
            [HoroscopePeriods.YEARLY]: "Mond zur Jahresmitte",
        },
        why: {
            [HoroscopePeriods.DAILY]: "Der Himmel heute · warum diese Deutung",
            [HoroscopePeriods.WEEKLY]:
                "Der Himmel diese Woche · warum diese Deutung",
            [HoroscopePeriods.YEARLY]:
                "Der Himmel dieses Jahr · warum diese Deutung",
        },
        forMyChart: "Lieber für mein Geburtshoroskop deuten",
        email: "Jeden Morgen per E-Mail",
        emailSoon: "Morgen-E-Mails sind noch nicht verfügbar",
    },

    signs: {
        [ZodiacSigns.ARIES]: {
            name: "Widder",
            abbr: "Wid",
            range: "21. März – 19. Apr.",
        },
        [ZodiacSigns.TAURUS]: {
            name: "Stier",
            abbr: "Sti",
            range: "20. Apr. – 20. Mai",
        },
        [ZodiacSigns.GEMINI]: {
            name: "Zwillinge",
            abbr: "Zwi",
            range: "21. Mai – 20. Juni",
        },
        [ZodiacSigns.CANCER]: {
            name: "Krebs",
            abbr: "Kre",
            range: "21. Juni – 22. Juli",
        },
        [ZodiacSigns.LEO]: {
            name: "Löwe",
            abbr: "Löw",
            range: "23. Juli – 22. Aug.",
        },
        [ZodiacSigns.VIRGO]: {
            name: "Jungfrau",
            abbr: "Jun",
            range: "23. Aug. – 22. Sept.",
        },
        [ZodiacSigns.LIBRA]: {
            name: "Waage",
            abbr: "Waa",
            range: "23. Sept. – 22. Okt.",
        },
        [ZodiacSigns.SCORPIO]: {
            name: "Skorpion",
            abbr: "Sko",
            range: "23. Okt. – 21. Nov.",
        },
        [ZodiacSigns.SAGITTARIUS]: {
            name: "Schütze",
            abbr: "Sch",
            range: "22. Nov. – 21. Dez.",
        },
        [ZodiacSigns.CAPRICORN]: {
            name: "Steinbock",
            abbr: "Ste",
            range: "22. Dez. – 19. Jan.",
        },
        [ZodiacSigns.AQUARIUS]: {
            name: "Wassermann",
            abbr: "Was",
            range: "20. Jan. – 18. Feb.",
        },
        [ZodiacSigns.PISCES]: {
            name: "Fische",
            abbr: "Fis",
            range: "19. Feb. – 20. März",
        },
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
        [Bodies.NORTH_NODE]: "Nordknoten",
    },

    lights: {
        [Bodies.SUN]: "die Sonne",
        [Bodies.MOON]: "der Mond",
    },

    aspects: {
        [AspectTypes.CONJUNCTION]: "Konjunktion",
        [AspectTypes.SEXTILE]: "Sextil",
        [AspectTypes.SQUARE]: "Quadrat",
        [AspectTypes.TRINE]: "Trigon",
        [AspectTypes.OPPOSITION]: "Opposition",
    },

    phases: {
        [MoonPhases.NEW]: "Neumond",
        [MoonPhases.WAXING_CRESCENT]: "Zunehmende Sichel",
        [MoonPhases.FIRST_QUARTER]: "Erstes Viertel",
        [MoonPhases.WAXING_GIBBOUS]: "Zunehmender Dreiviertelmond",
        [MoonPhases.FULL]: "Vollmond",
        [MoonPhases.WANING_GIBBOUS]: "Abnehmender Dreiviertelmond",
        [MoonPhases.LAST_QUARTER]: "Letztes Viertel",
        [MoonPhases.WANING_CRESCENT]: "Abnehmende Sichel",
    },

    colours: {
        [ZodiacSigns.ARIES]: "Ochsenblut",
        [ZodiacSigns.TAURUS]: "Moosgrün",
        [ZodiacSigns.GEMINI]: "Safran",
        [ZodiacSigns.CANCER]: "Perlweiß",
        [ZodiacSigns.LEO]: "Altgold",
        [ZodiacSigns.VIRGO]: "Schiefergrau",
        [ZodiacSigns.LIBRA]: "Rosé",
        [ZodiacSigns.SCORPIO]: "Pflaume",
        [ZodiacSigns.SAGITTARIUS]: "Indigo",
        [ZodiacSigns.CAPRICORN]: "Graphit",
        [ZodiacSigns.AQUARIUS]: "Grünspan",
        [ZodiacSigns.PISCES]: "Meerglas",
    },

    moods: {
        [MoodBands.HEAVY]: "Schwer",
        [MoodBands.LEVEL]: "Ausgeglichen",
        [MoodBands.STEADY]: "Beständig",
        [MoodBands.BRIGHT]: "Strahlend",
    },

    categories: {
        [C.PERSONAL]: "Privatleben",
        [C.PROFESSION]: "Beruf",
        [C.EMOTIONS]: "Gefühle",
        [C.HEALTH]: "Gesundheit",
        [C.TRAVEL]: "Reisen",
        [C.LUCK]: "Glück",
    },

    ordinals: [
        "erstes",
        "zweites",
        "drittes",
        "viertes",
        "fünftes",
        "sechstes",
        "siebtes",
        "achtes",
        "neuntes",
        "zehntes",
        "elftes",
        "zwölftes",
    ],

    houses: [
        "der Bereich deines Lebens, in dem es darum geht, wie du wirkst und was du für dich selbst willst",
        "der Bereich deines Lebens, in dem es um Geld, Besitz und das Gefühl von genug geht",
        "der Bereich deines Lebens, in dem es um Gespräche, Erledigungen, Geschwister und den Alltagsverstand geht",
        "der Bereich deines Lebens, in dem es um Zuhause, Familie und Geborgenheit geht",
        "der Bereich deines Lebens, in dem es um Spiel, Romantik, Kinder und Gesehenwerden geht",
        "der Bereich deines Lebens, in dem es um Arbeit, Gesundheit und den Alltag geht",
        "der Bereich deines Lebens, in dem es um Partnerschaft und die Menschen geht, an die du dich bindest",
        "der Bereich deines Lebens, in dem es um Intimität, gemeinsames Geld und das geht, was du für dich behältst",
        "der Bereich deines Lebens, in dem es um Glauben, Reisen und das große Ganze geht",
        "der Bereich deines Lebens, in dem es um Karriere, Ruf und das geht, wofür du bekannt bist",
        "der Bereich deines Lebens, in dem es um Freunde, Gruppen und Hoffnungen für die Zukunft geht",
        "der Bereich deines Lebens, in dem es um Ruhe, Rückzug und das Unausgesprochene geht",
    ],

    headlines: {
        [HoroscopePeriods.DAILY]: {
            [R.CONJUNCTION]: [
                "Der Mond steht in deinem Zeichen. Alles trifft dich etwas stärker und bedeutet etwas mehr.",
                "Ein Tag, der sich ganz um dich dreht, ob du darum gebeten hast oder nicht. Lass es zu.",
            ],
            [R.SEXTILE]: [
                "Ein leichter Tag mit einer kleinen Öffnung darin. Achte darauf, wer hindurchkommt.",
                "Leicht im Gang, leicht in Gesellschaft. Der Tag verlangt wenig und gibt ein wenig zurück.",
            ],
            [R.SQUARE]: [
                "Ein Tag, der dir zeigt, wo es reibt. Schmier es nicht mit Versprechen.",
                "Etwas drückt. Drück sanft zurück oder gar nicht, und bis zum Abend ist es vorbei.",
            ],
            [R.TRINE]: [
                "Ein Tag zum Abschließen, nicht zum Anfangen. Was du heute schließt, bleibt geschlossen.",
                "Die Dinge fügen sich, ohne dass du schieben musst. Nutze die Leichtigkeit für etwas, das zählt.",
            ],
            [R.OPPOSITION]: [
                "Der Tag gehört dem anderen Menschen. Hör zu, dann kommst du am Ende weiter.",
                "Heute wirst du gespiegelt. Schau hin, auch wenn das Spiegelbild nicht schmeichelt.",
            ],
            [R.QUIET]: [
                "Ein schlichter Tag, und an schlichten Tagen findet das meiste Leben statt.",
                "Heute zieht nichts stark. Wähl an jeder Weggabelung das Leichtere.",
            ],
        },
        [HoroscopePeriods.WEEKLY]: {
            [R.CONJUNCTION]: [
                "Deine Woche, mit deinem Namen darauf. Sei bewusst sichtbar.",
                "{planet} steht in deinem Zeichen und macht diese Woche zu deiner. Steck sie in etwas, für das es sich lohnt, gesehen zu werden.",
            ],
            [R.SEXTILE]: [
                "Eine Woche, die hilft, wenn du sie lässt. Sag früh und oft Ja.",
                "Die ganze Woche kleine Öffnungen. Keine davon ist die große, zusammen sind sie es.",
            ],
            [R.SQUARE]: [
                "Eine Woche, die das Gerüst prüft. Repariere, was wackelt, vor Freitag.",
                "Druck, keine Strafe. Kürze den Umfang, halte den Anspruch, bring eine Sache zu Ende.",
            ],
            [R.TRINE]: [
                "Eine Woche, die so läuft, wie du es dir immer erhoffst. Verlang mehr, als höflich wirkt.",
                "Bis Freitag ist der Himmel auf deiner Seite. Stell deine Anfragen früh.",
            ],
            [R.OPPOSITION]: [
                "Eine Woche, die andere entscheiden. Bereite dich vor und warte dann, ohne nachzuhaken.",
                "Die andere Seite des Tisches gibt diese Woche das Tempo vor. Halte mit.",
            ],
            [R.QUIET]: [
                "Eine ruhige Woche, und zwar die nützliche Art. Aufräumen, abschließen, ausruhen.",
                "Diese Woche zieht nichts stark. Bau etwas Kleines, das nächsten Monat noch steht.",
            ],
        },
        [HoroscopePeriods.YEARLY]: {
            [R.CONJUNCTION]: [
                "Ein Jahr mit deinem Namen darauf. Was immer du wirst, du wirst es vor aller Augen.",
                "{planet} steht das ganze Jahr in deinem Zeichen: ein Jahr, in dem du gesehen, geprüft und bestätigt wirst.",
            ],
            [R.SEXTILE]: [
                "Ein Jahr der kleinen Türen. Geh durch die, die sich von selbst öffnen.",
                "Hilfe ist das ganze Jahr nah. Die Menschen, die dieses Jahr zählen, stehen am Rand des Raumes.",
            ],
            [R.SQUARE]: [
                "Ein Jahr, das verdient werden will. Was du unter Druck baust, ist das, was bleibt.",
                "Kein leichtes Jahr, aber ein nützliches. Etwas wird auf festerem Boden neu gebaut.",
            ],
            [R.TRINE]: [
                "Ein Jahr, in dem der Himmel dir zustimmt. Verlang mehr, als höflich wirkt, und meine es ernst.",
                "Dieses Jahr öffnen sich Türen, ohne dass du drücken musst. Wähl, durch welche du gehst.",
            ],
            [R.OPPOSITION]: [
                "Ein Jahr, das du mit jemand anderem entscheidest. Du schaffst es nicht allein, und das sollst du auch nicht versuchen.",
                "Das Jahr läuft über Partnerschaft. Verhandle alles, befiehl nichts.",
            ],
            [R.QUIET]: [
                "Ein Jahr deiner eigenen Wahl. Nichts wird dir genommen und nichts wird dir geschenkt.",
                "Ein ruhiges Jahr am Himmel, und darum ein Jahr zum Aufbauen statt zum Reagieren.",
            ],
        },
    },

    readings: {
        [HoroscopePeriods.DAILY]: daily,
        [HoroscopePeriods.WEEKLY]: weekly,
        [HoroscopePeriods.YEARLY]: yearly,
    },

    moonHouse: [
        "Der Mond zieht heute durch dein Zeichen, also fühlst du alles, was du fühlst, ganz persönlich.",
        "Der Mond steht heute in deinem zweiten Haus, und die Stimmung folgt dem Geld: Gib ruhig ein wenig aus, aber nicht, um dich besser zu fühlen.",
        "Der Mond steht heute in deinem dritten Haus, also will das Gefühl ausgesprochen werden. Such dir den richtigen Zuhörer, nicht den nächstbesten.",
        "Der Mond steht heute ganz unten in deinem Horoskop, im Haus des Zuhauses. Bleib daheim, wenn du kannst, der Abend ist der schönste Teil des Tages.",
        "Der Mond steht heute in deinem fünften Haus, dem Haus des Spiels. Die Stimmung hebt sich in dem Moment, in dem du aufhörst, nützlich zu sein.",
        "Der Mond steht heute in deinem sechsten Haus, und Gefühle zeigen sich als Aufgaben. Erledige zwei davon, und der Rest der Liste verliert seinen Griff.",
        "Der Mond steht heute deinem Zeichen gegenüber, im Haus des anderen Menschen. Deine Stimmung und seine sind verknotet, löse den Knoten sanft.",
        "Der Mond steht heute in deinem achten Haus, wo Gefühle tief und privat sind. Nicht alles muss gesagt werden. Manches muss man nur wissen.",
        "Der Mond steht heute in deinem neunten Haus, und die Stimmung sehnt sich nach Weite. Ein längerer Spaziergang oder ein weiter Blick hilft mehr als jedes Gespräch.",
        "Der Mond steht heute ganz oben in deinem Horoskop, im Haus von Beruf und Ansehen. Gefühl und Pflicht teilen sich den Raum, überlass der Pflicht den Vormittag.",
        "Der Mond steht heute in deinem elften Haus, bei Freunden und Plänen. Gesellschaft hebt die Stimmung heute schneller als Alleinsein.",
        "Der Mond steht heute in deinem zwölften Haus, dem stillen hinter deinem Zeichen. Ruhe ist heute keine Flucht, sie ist die Aufgabe.",
    ],

    phaseNotes: {
        [MoonPhases.NEW]:
            "Ein Neumond leert den Raum: Du wirst weniger wollen und dich an weniger stören, also setz dir in den nächsten zwei Tagen eine kleine Absicht.",
        [MoonPhases.WAXING_CRESCENT]:
            "Der Mond ist jung und wächst, genau wie das, was du diese Woche begonnen hast. Nähre es ein wenig.",
        [MoonPhases.FIRST_QUARTER]:
            "Ein Halbmond rückt ein klares Hindernis ins Blickfeld. Es ist kleiner, als es heute Abend aussieht.",
        [MoonPhases.WAXING_GIBBOUS]:
            "Der Mond ist fast voll, und die Woche auch. Streich, was du kannst, bevor der Höhepunkt kommt.",
        [MoonPhases.FULL]:
            "Ein Vollmond bringt die Dinge auf den Punkt, meist an einem einzigen Abend. Lass es sichtbar werden und dann den Abend still.",
        [MoonPhases.WANING_GIBBOUS]:
            "Der Mond hat den Vollmond hinter sich, und der Druck lässt nach. Bedank dich für etwas und meine es ernst.",
        [MoonPhases.LAST_QUARTER]:
            "Ein abnehmender Halbmond ist dazu da, eine Sache bewusst loszulassen. Wähl sie, bevor sie dich wählt.",
        [MoonPhases.WANING_CRESCENT]:
            "Der alte Mond ist schmal und müde, und du auch. Ruhe zählt diese Woche als Fortschritt.",
    },

    retrograde:
        "{planet} ist rückläufig, also schau dir diesen Teil der Deutung ein zweites Mal an, bevor du danach handelst. Altes kehrt zurück, bevor Neues beginnt.",

    notes: {
        aspect: "{a} {aspect} {b} · Orbis {orb}",
        moon: "Mond {pos}",
        retrograde: "{planet} rückläufig · {pos}",
        direct: "{planet} direktläufig · {pos}",
        stationary: "{planet} stationär",
        lunation: {
            [Lunations.NEW]: "Neumond im Zeichen {sign} · {date}",
            [Lunations.FULL]: "Vollmond im Zeichen {sign} · {date}",
        },
        ingress: "{planet} wechselt ins Zeichen {sign} · {date}",
        moonRun: "Mond zieht durch {signs}",
        house: "{planet} im Zeichen {sign} · dein {ordinal} Haus",
        today: "heute",
    },
}

export default de
