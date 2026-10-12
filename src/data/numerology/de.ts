import { NumerologyNumbers, SupportedLanguages } from "../../constants/index.ts"
import type { NumerologyCopy } from "../../types/index.ts"

/**
 * German numerology copy, mirroring en.ts key for key. Informal "du"
 * throughout. Every value is "die Zahl", so the article is always "eine".
 */
const de: NumerologyCopy = {
    lang: SupportedLanguages.DE,

    labels: {
        [NumerologyNumbers.LIFE_PATH]: {
            label: "Lebensweg",
            sub: "Der Weg, auf dem du bist",
        },
        [NumerologyNumbers.BIRTH]: {
            label: "Geburtstag",
            sub: "Die Gabe, mit der du kamst",
        },
        [NumerologyNumbers.DESTINY]: {
            label: "Schicksal",
            sub: "Wofür dein Name steht",
        },
        [NumerologyNumbers.SOUL_URGE]: {
            label: "Seelenwunsch",
            sub: "Was du dir im Stillen wünschst",
        },
        [NumerologyNumbers.PERSONALITY]: {
            label: "Persönlichkeit",
            sub: "Was andere zuerst sehen",
        },
    },

    meanings: {
        [NumerologyNumbers.LIFE_PATH]: {
            1: "Auf deinem Weg geht es darum, voranzugehen. Du bist zum Führen gemacht, nicht zum Folgen, und dir liegt die Arbeit, die noch niemand auf deine Art gemacht hat.",
            2: "Auf deinem Weg geht es um Partnerschaft. Gemeinsam mit jemandem kommst du weiter als allein an der Spitze, und deine eigentliche Stärke ist, zu spüren, was eine Situation braucht, bevor es jemand ausspricht.",
            3: "Auf deinem Weg geht es um Ausdruck. Du sollst gehört werden, und das Leben wird flach, sobald du aufhörst, Dinge zu erschaffen und anderen davon zu erzählen.",
            4: "Auf deinem Weg geht es ums Aufbauen. Langsame, solide, gut fundierte Arbeit liegt dir, und am Ende vertraut man dir alles an, was Bestand haben muss.",
            5: "Auf deinem Weg geht es um Veränderung. Du sollst in Bewegung sein, Dinge ausprobieren und Erfahrungen sammeln, und du wirst schal, wenn du dich zu früh niederlässt.",
            6: "Auf deinem Weg geht es um Fürsorge. Zuhause, Familie und Verantwortung finden dich, und du bist am besten, wenn du dich um etwas kümmerst, das zählt.",
            7: "Auf deinem Weg geht es ums Verstehen. Du sollst in die Tiefe gehen statt in die Breite, und dafür brauchst du echte Zeit für dich allein.",
            8: "Auf deinem Weg geht es um die praktische Welt. Geld, Autorität und Konsequenzen sind dein Thema, und du sollst damit umgehen, statt ihnen auszuweichen.",
            9: "Auf deinem Weg geht es um das große Ganze. Du sollst etwas zurückgeben, und ein Leben, das sich nur um dich dreht, wird dich nie ganz erfüllen.",
            11: "Dein Weg steht unter höherer Spannung. Du nimmst weit mehr wahr, als du erklären kannst, und die Aufgabe ist, all diese Feinfühligkeit in etwas zu verwandeln, das anderen nützt.",
            22: "Auf deinem Weg geht es darum, etwas Großes und Echtes aufzubauen. Die Vision ist groß, und die praktische Kraft dazu auch. Das Schwierige ist der Anfang.",
            33: "Auf deinem Weg geht es darum, durch dein Vorbild zu lehren. Deine Fürsorge soll weit über deinen eigenen Haushalt hinausreichen.",
        },
        [NumerologyNumbers.BIRTH]: {
            1: "Du kamst mit eigenem Antrieb. Schon als Kind hast du lieber alles selbst gemacht, als es dir zeigen zu lassen.",
            2: "Du kamst mit Feingefühl. Du konntest schon immer eine Stimmung lesen und etwas glätten, ohne dass man dich darum bat.",
            3: "Du kamst ausdrucksstark. Worte, Humor und Auftreten fielen dir leicht und früh zu.",
            4: "Du kamst verlässlich. Man konnte dir schon immer etwas in die Hand geben und es dann vergessen.",
            5: "Du kamst neugierig und schwer zu fassen. Du warst die Person, die um die nächste Ecke schauen wollte.",
            6: "Du kamst verantwortungsvoll. Du hast dich um andere gekümmert, lange bevor dich jemand darum bat.",
            7: "Du kamst nachdenklich. Du brauchtest dein eigenes Zimmer und deine eigene Zeit, lange bevor du erklären konntest, warum.",
            8: "Du kamst mit praktischem Verstand. Du hast Wert, Fairness und Konsequenzen früh verstanden.",
            9: "Du kamst mit einem weiten Herzen. Du hast das, was anderen passiert, gefühlt, als würde es dir passieren.",
            11: "Du kamst ungewöhnlich feinfühlig. Das war Gabe und Last in etwa zu gleichen Teilen.",
            22: "Du kamst mit seltener praktischer Weitsicht. Du siehst das fertige Ergebnis und die Schritte dorthin zugleich.",
            33: "Du kamst mit einem starken Instinkt, dich um Menschen zu kümmern, und der hat nie bei deiner eigenen Familie aufgehört.",
        },
        [NumerologyNumbers.DESTINY]: {
            1: "Dein Name weist auf Unabhängigkeit. Was du hier erschaffen sollst, trägt deine eigene Handschrift.",
            2: "Dein Name weist auf Zusammenarbeit. Was du aufbaust, baust du mit jemandem, und das ist keine geringere Form des Aufbauens.",
            3: "Dein Name weist auf Kommunikation. Was immer du am Ende tust, es wird darum gehen, etwas zu erschaffen und es Menschen zu zeigen.",
            4: "Dein Name weist auf Struktur. Du bist hier, um Dinge zu schaffen, die halten: Systeme, Institutionen oder einfach Arbeit, die nicht umkippt.",
            5: "Dein Name weist auf Freiheit und Vielfalt. Ein einziges festes Gleis wird nie auch nur die Hälfte von dem nutzen, was du mitbringst.",
            6: "Dein Name weist auf Dienst und Schönheit. Du bist hier, um dich um Menschen zu kümmern oder Dinge zu schaffen, mit denen es sich besser lebt.",
            7: "Dein Name weist auf Wissen. Du bist hier, um etwas gründlich herauszufinden und die Person zu sein, die es wirklich weiß.",
            8: "Dein Name weist auf Erfolg. Du bist hier, um etwas mit Gewicht aufzubauen und dich mit dem wohlzufühlen, was dazugehört.",
            9: "Dein Name weist auf Beitrag. Du bist hier, um an etwas zu arbeiten, das größer ist als dein eigener Haushalt.",
            11: "Dein Name weist auf Inspiration. Du bist hier, um zu bemerken, was andere übersehen, und einen Weg zu finden, es weiterzugeben.",
            22: "Dein Name weist auf Aufbau im großen Maßstab. Du bist hier, um eine große Idee in etwas zu verwandeln, das tatsächlich steht.",
            33: "Dein Name weist auf Lehren und Heilen. Du bist hier, um dich um Menschen zu kümmern, in einem Maß, das über das Persönliche hinausgeht.",
        },
        [NumerologyNumbers.SOUL_URGE]: {
            1: "Tief im Inneren willst du dein eigener Mensch sein. Geführt zu werden, wie freundlich auch immer, scheuert.",
            2: "Tief im Inneren willst du Frieden und Nähe. Streit kostet dich mehr als die meisten anderen.",
            3: "Tief im Inneren willst du gehört werden. Übergangen zu werden ist das, was dich wirklich verletzt.",
            4: "Tief im Inneren willst du Sicherheit. Du willst wissen, dass der Boden trägt, bevor du es genießen kannst, darauf zu stehen.",
            5: "Tief im Inneren willst du Freiheit. Worauf du dich auch einlässt, du musst wissen, dass du noch gehen könntest.",
            6: "Tief im Inneren willst du gebraucht werden. Du willst ein Zuhause und Menschen darin, die sich auf dich verlassen.",
            7: "Tief im Inneren willst du verstehen. Du willst die echte Antwort, nicht die bequeme.",
            8: "Tief im Inneren willst du handeln können. Geld und Stellung sind dir wichtig, weil sie dich in Bewegung bringen.",
            9: "Tief im Inneren willst du, dass dein Leben für etwas gezählt hat, das über dich hinausgeht.",
            11: "Tief im Inneren willst du Sinn. Ein vollkommen bequemes Leben macht dich auf eine Weise unruhig, die man anderen schwer erklären kann.",
            22: "Tief im Inneren willst du etwas aufbauen, das dich überdauert.",
            33: "Tief im Inneren willst du nützlich sein, und dir wird leicht unbehaglich, wenn sich die Aufmerksamkeit stattdessen auf dich richtet.",
        },
        [NumerologyNumbers.PERSONALITY]: {
            1: "Andere erleben dich als selbstsicher und in dir ruhend. Du wirkst entschlossen, selbst wenn du es nicht bist.",
            2: "Andere erleben dich als sanft und angenehm. Du bist zugänglich, bevor du beeindruckend bist.",
            3: "Andere erleben dich als warm und unterhaltsam. Man mag dich leicht und bezieht dich schnell ein.",
            4: "Andere erleben dich als solide und geradlinig. Man vertraut dir Dinge an, bevor man viel über dich weiß.",
            5: "Andere erleben dich als lebhaft und ein wenig unberechenbar. Du bringst Energie mit in den Raum.",
            6: "Andere erleben dich als freundlich und verantwortungsvoll. Man bringt dir seine Probleme, oft früher, als dir lieb ist.",
            7: "Andere erleben dich als zurückhaltend und etwas schwer zu durchschauen. Das wirkt tiefgründig, und das ist es auch.",
            8: "Andere erleben dich als fähig und souverän. Man geht davon aus, dass du Autorität hast, ob sie dir jemand gegeben hat oder nicht.",
            9: "Andere erleben dich als großzügig und ein wenig fern, als würde ein Teil von dir auf etwas Entfernteres blicken.",
            11: "Andere erleben dich als ungewöhnlich und still fesselnd. Man weiß nicht immer, warum man sich an dich erinnert.",
            22: "Andere erleben dich als ernsthaft und fähig im großen Maßstab. Du wirkst nicht wie jemand, der sich mit Kleinigkeiten abgibt.",
            33: "Andere erleben dich als ungewöhnlich warmherzig. Menschen vertrauen sich dir schnell an, manchmal völlig Fremde.",
        },
    },

    days: {
        1: "Sonntag",
        2: "Montag",
        3: "Donnerstag",
        4: "Samstag",
        5: "Mittwoch",
        6: "Freitag",
        7: "Montag",
        8: "Samstag",
        9: "Dienstag",
        11: "Montag",
        22: "Samstag",
        33: "Freitag",
    },

    // every value is "die Zahl", so always "eine"
    articles: {
        1: "eine",
        2: "eine",
        3: "eine",
        4: "eine",
        5: "eine",
        6: "eine",
        7: "eine",
        8: "eine",
        9: "eine",
        11: "eine",
        22: "eine",
        33: "eine",
    },

    templates: {
        masterOne:
            "Deine Zahl für {labels} ist eine Meisterzahl, mit mehr Spannung als die meisten und auch mehr zu tragen. ",
        masterMany:
            "Deine Zahlen für {labels} sind alle Meisterzahlen, mit mehr Spannung als die meisten und auch mehr zu tragen. ",
        agree: "{lifePathArticle} {lifePath} als Lebenszahl und {destinyArticle} {destiny} als Schicksalszahl. Weg und Name sind sich einig, und das ist seltener, als es klingt.",
        tension:
            "{lifePathArticle} {lifePath} als Lebenszahl und {destinyArticle} {destiny} als Schicksalszahl. Der Weg verlangt eines von dir und der Name etwas anderes, und das Spannende an einem Leben liegt meist genau in dieser Lücke.",
        ages: "Von {from} bis {to} Jahren",
        agesOpen: "Ab {from} Jahren",
        chapter: "{ordinal} Kapitel",
        passion:
            "Die {value} kommt {count}-mal in deinem Namen vor, öfter als jede andere Zahl.",
        challengeAgain:
            "Dieselbe Lektion wie in einem früheren Kapitel. Wenn sich eine wiederholt, heißt das meist, dass der erste Durchgang sie nicht abgeschlossen hat.",
        and: "und",
    },

    ordinals: ["Erstes", "Zweites", "Drittes", "Viertes"],

    sections: {
        personalYear: {
            title: "Wo du gerade stehst",
            sub: "Deine Zahlen bleiben ein Leben lang gleich. Diese hier wechselt jeden Januar.",
        },
        chapters: {
            title: "Das Leben in vier Kapiteln",
            sub: "Jedes Kapitel schenkt dir etwas und verlangt etwas von dir.",
            pinnacle: "Was es dir schenkt",
            challenge: "Was es von dir verlangt",
        },
        name: {
            title: "Dein Name, Buchstabe für Buchstabe",
            sub: "Jeder Buchstabe oben fließt in eine der drei Namenszahlen ein. Hier ist dein ganzes Alphabet.",
            vowels: "Vokale bilden den Seelenwunsch",
            consonants: "Konsonanten bilden die Persönlichkeit",
            karmic: "Zahlen, die dein Name nie verwendet",
            passion: "Die Zahl, auf die sich dein Name stützt",
        },
    },

    personalYear: {
        heading: "{year} ist ein Jahr der {value}",
        meanings: {
            1: "Ein Jahr des Anfangs. Was du jetzt beginnst, gibt meist die Form der nächsten neun Jahre vor, also ist es ein schlechtes Jahr zum Treibenlassen und ein gutes zum Entscheiden. Rechne damit, dass du allen ein Stück voraus bist und dich dabei ein wenig allein fühlst.",
            2: "Ein bewusst langsameres Jahr. Was du letztes Jahr begonnen hast, braucht Geduld statt Druck, und das meiste, was dieses Jahr zählt, geschieht über andere Menschen. Fortschritt fühlt sich unsichtbar an, bis er es plötzlich nicht mehr ist.",
            3: "Ein Jahr, das dich sichtbar haben will. Sprich es aus, veröffentliche es, geh zur Party. Die Gefahr ist, dich auf zehn schöne Dinge zu verteilen und keines davon zu beenden.",
            4: "Ein Arbeitsjahr. Unspektakulär, nützlich, und genau das Jahr, das die späteren möglich macht. Bring jetzt die langweiligen Systeme in Ordnung: den Papierkram, das Sparen, die Gewohnheit, die du ständig auslässt.",
            5: "Etwas lockert sich. Reisen, ein Umzug, ein neuer Job oder eine neue Sichtweise, meist mehr als eines davon. Behalte etwas Boden unter den Füßen, denn dieses Jahr nimmt ihn dir sonst gern komplett weg.",
            6: "Das Jahr, in dem dein Zuhause und die Menschen darin an erster Stelle stehen. Verantwortung kommt, ob du dich gemeldet hast oder nicht, und es ist auch ein starkes Jahr, um sesshaft zu werden, jemanden bei dir aufzunehmen oder endlich das Haus in Ordnung zu bringen.",
            7: "Ein stilles, nach innen gewandtes Jahr. Du wirst weniger Gesellschaft wollen als sonst, und das solltest du dir nehmen. Es ist ein Jahr zum Lernen, Ausruhen und Herausfinden, was du wirklich denkst, nicht zum Erzwingen.",
            8: "Geld, Arbeit und Konsequenzen spitzen sich zu. Mühe, die du vor Jahren investiert hast, zahlt sich jetzt meist aus, und die Abkürzungen, die du genommen hast, auch. Ein starkes Jahr zum Verhandeln, Investieren oder um zu verlangen, was du wert bist.",
            9: "Ein Jahr des Abschlusses, und genau darum geht es. Was du hinter dir gelassen hast, geht, manchmal unschön. Lass es gehen. Den Boden freizuräumen ist die ganze Aufgabe, denn nächstes Jahr beginnt der Zyklus von vorn.",
        },
    },

    pinnacles: {
        1: "Eine Phase, in der du auf eigenen Füßen stehst. Du wirst gedrängt, zu entscheiden, anzufangen und zu führen, oft bevor du dich bereit fühlst, und dich auf andere zu stützen funktioniert hier schlechter als früher.",
        2: "Eine Phase, die über Menschen wirkt. Partnerschaft, Geduld und Feingefühl bringen dich weiter als Kraft, und die Erfolge dieser Zeit tragen meist auch den Namen eines anderen.",
        3: "Eine Phase des Ausdrucks. Deine Stimme, deine Arbeit und dein soziales Leben öffnen sich, und was du in dieser Zeit erschaffst, erreicht meist Menschen. Deine Energie zu verzetteln ist die einzige echte Gefahr.",
        4: "Eine Phase des Aufbaus. Hart, beständig und nicht besonders spannend zu erzählen, aber hier wird das Fundament gelegt: die Laufbahn, das Haus, die Disziplin, die dich den Rest deines Lebens begleitet.",
        5: "Eine Phase der Bewegung und Veränderung. Jobs, Städte und Beziehungen wechseln öfter als sonst. Das ist berauschend, wenn du etwas Beständiges hast, zu dem du zurückkehren kannst, und chaotisch, wenn nicht.",
        6: "Eine Phase rund um Zuhause und Pflicht. Familie, ein Partner oder Menschen, die von dir abhängen, rücken nach vorn, und deine Vorstellung von einem guten Leben ordnet sich still um sie herum neu.",
        7: "Eine Phase der Tiefe statt der Breite. Lernen, Handwerk, Glaube oder Alleinsein übernehmen, und du kommst mit einem Wissen heraus, das du nirgendwo hättest nachlesen können.",
        8: "Eine Phase mit echtem weltlichem Gewicht. Geld, Autorität und Ergebnisse kommen, zusammen mit dem Druck, der daran hängt. Gut gemeistert, legt sie den Grundstein für lange Zeit.",
        9: "Eine Phase, die den Blick weitet. Am Ende gibst du etwas zurück, arbeitest für etwas Größeres als dich selbst oder lässt eine Version deines Lebens los, aus der du herausgewachsen bist.",
        11: "Eine Phase unter höherer Spannung. Intuition, Druck und Sichtbarkeit steigen gemeinsam. Ungeheuer produktiv, wenn deine Nerven halten, und hart für dich, wenn nicht.",
        22: "Eine Phase mit ungewöhnlicher Reichweite. Hier bietet sich die Chance, etwas aufzubauen, das größer ist als dein eigenes Leben, und mit ihr die Arbeit, die dazugehört. Selten, und nicht erholsam.",
    },

    challenges: {
        0: "Kein einzelnes Hindernis. Das klingt nach einem Geschenk und ist meist eine Prüfung, was du mit freier Hand anfängst, denn hier entscheidet nichts von außen für dich.",
        1: "Für dich selbst einzustehen. Du gerätst immer wieder in Situationen, in denen du allein entscheiden musst, und die Gewohnheit, auf Erlaubnis zu warten, ist das, was du ablegen sollst.",
        2: "Übersensibilität. Du spürst Kränkungen, die nicht so gemeint waren, und führst im Stillen Buch. Die Aufgabe ist, das Schwierige laut auszusprechen, statt es zu schlucken.",
        3: "Zu sagen, was du meinst. Selbstzweifel zeigen sich entweder als Schweigen oder als zerstreutes Plaudern, und zu lernen, einen ehrlichen Punkt klar zu machen, ist die ganze Aufgabe.",
        4: "Die unspektakuläre Arbeit zu erledigen. Unordnung und halb Fertiges kosten dich mehr als jeder Rivale. Struktur ist kein Charakterfehler, sie ist die Lösung.",
        5: "Impulsivität. Freiheit ist das, was du dir am meisten wünschst, und das, was du am meisten überstrapazierst. Rastlosigkeit, Maßlosigkeit und zu frühes Aufgeben sind die Formen, auf die du achten solltest.",
        6: "Unerreichbare Ansprüche. Du erwartest viel von den Menschen, die dir nahestehen, und noch mehr von dir selbst, und die Enttäuschung, die folgt, machst du dir größtenteils selbst.",
        7: "Vertrauen. Du hältst Menschen auf Abstand und nennst es Diskretion. Die Aufgabe ist, jemanden nah genug heranzulassen, um sich in dir zu irren, und trotzdem zu bleiben.",
        8: "Dein Verhältnis zu Geld und Macht. Beides kann dich beherrschen, wenn du es zulässt, ob du ihm hinterherjagst oder so tust, als stündest du darüber.",
    },

    karmicLessons: {
        1: "Keine 1 in deinem Namen. Allein anzufangen und die Führung zu übernehmen liegt dir nicht von Natur aus, und du wirst in Situationen kommen, in denen niemand sonst für dich entscheidet.",
        2: "Keine 2 in deinem Namen. Geduld, Takt und das Arbeiten im Tempo anderer sind erlernt statt geschenkt, und das Leben stellt dir diese Lektion immer wieder.",
        3: "Keine 3 in deinem Namen. Dich leicht und spielerisch auszudrücken ist harte Arbeit. Vielleicht unterschätzt du deine eigene Kreativität oder tust Vergnügen als unernst ab.",
        4: "Keine 4 in deinem Namen. Ordnung, Routine und Durchhalten kosten bewusste Mühe, und der Preis fürs Ausweichen kommt meist auf einen Schlag.",
        5: "Keine 5 in deinem Namen. Veränderung verunsichert dich mehr als die meisten, und vielleicht hältst du an etwas fest, lange nachdem es aufgehört hat zu funktionieren.",
        6: "Keine 6 in deinem Namen. Verbindlichkeit und häusliche Verantwortung fühlen sich schwerer an, als sie aussehen, und du lernst sie, indem du gebraucht wirst, nicht indem du sie wählst.",
        7: "Keine 7 in deinem Namen. Mit einer Frage zu verweilen, statt sie schnell zu lösen, fällt dir nicht leicht, und für Tiefe musst du dir bewusst Zeit nehmen.",
        8: "Keine 8 in deinem Namen. Geld, Autorität und dein eigener Wert sind die wiederkehrende Lektion, meist gelernt, indem du es erst ein- oder zweimal falsch machst.",
        9: "Keine 9 in deinem Namen. Loszulassen und über deine eigene Lage hinauszusehen ist die Aufgabe, und das Leben lehrt es meist durch Abschiede, die du nicht gewählt hast.",
    },

    karmicNone:
        "Dein Name nutzt alle neun Zahlen, und das ist selten. Nichts fehlt, und nichts wird dir doppelt geschenkt.",

    hiddenPassion: {
        1: "Du strebst immer wieder nach Unabhängigkeit. Egal in welcher Lage, ein Teil von dir sucht die Version, in der du entscheidest.",
        2: "Du strebst immer wieder nach Harmonie. Dir ist ein befriedeter Raum lieber, als darin recht zu behalten.",
        3: "Du strebst immer wieder nach Ausdruck. Wenn du es nicht sagen, zeichnen oder vorführen kannst, fühlt es sich an, als wäre es nicht passiert.",
        4: "Du strebst immer wieder nach festem Boden. Du willst, dass etwas ordentlich gebaut wird, und Improvisation macht dich unruhig, selbst wenn sie funktioniert.",
        5: "Du strebst immer wieder nach Freiheit. Eine verschlossene Tür stört dich mehr als eine schwierige, und Routine zermürbt dich schneller als Druck.",
        6: "Du suchst immer wieder Menschen, um die du dich kümmern kannst. Es zieht dich dazu, diejenige Person zu sein, die alles zusammenhält, manchmal mehr, als dir guttut.",
        7: "Du strebst immer wieder nach Verständnis. Eine oberflächliche Antwort stellt dich nie zufrieden, und du bist lieber allein, als dir etwas Seichtes anzuhören.",
        8: "Du strebst immer wieder nach zählbaren Ergebnissen. Status, Geld oder Größe: Du willst, dass sich die Mühe in etwas Messbarem zeigt.",
        9: "Du strebst immer wieder nach Sinn. Kleine Ziele langweilen dich, und du willst, dass deine Mühe für mehr als nur dich selbst zählt.",
    },

    footnote:
        "Die Buchstaben A bis I entsprechen 1 bis 9, danach wiederholt sich das Alphabet. In der Rechnung ist nichts versteckt.",
}

export default de
