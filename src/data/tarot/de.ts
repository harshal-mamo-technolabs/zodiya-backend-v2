import { SupportedLanguages, TarotSpreads } from "../../constants/index.ts"
import type { TarotCopy } from "../../types/index.ts"

/**
 * Deutsche Tarot-Texte. Jede Karte hat eine aufrechte und eine umgekehrte
 * Deutung, geschrieben für jemanden, der noch nie ein Deck in der Hand hatte.
 */
const de: TarotCopy = {
    lang: SupportedLanguages.DE,

    cards: {
        // ------------------------------------------------------ major arcana
        fool: {
            name: "Der Narr",
            up: {
                lede: "Fang an, bevor du dich bereit fühlst.",
                text: "Das ist die Karte des ersten Schritts, gegangen mit mehr Vertrauen als Beweisen. Du brauchst nicht den ganzen Plan. Du musst den Boden verlassen, auf dem du stehst, und den Rest unterwegs auftauchen lassen.",
                keywords: ["Neubeginn", "Vertrauen", "Ein Sprung"],
            },
            rev: {
                lede: "Du springst gleich, ohne hinzusehen, oder weigerst dich ganz zu springen.",
                text: "Umgekehrt steht der Narr entweder für Leichtsinn oder für Lähmung, und du weißt, welches davon deins ist. Wenn du hetzt, werde langsamer und lies das Kleingedruckte. Wenn du erstarrt bist, gib zu, dass das Warten auf Gewissheit auch eine Entscheidung ist.",
                keywords: ["Zögern", "Leichtsinn", "Angst"],
            },
        },
        magician: {
            name: "Der Magier",
            up: {
                lede: "Du hast schon alles, was es dafür braucht.",
                text: "Die Werkzeuge liegen auf dem Tisch. Können, Timing, die richtigen Worte, die richtigen Menschen. Der Magier verlangt, dass du aufhörst zu sammeln und anfängst zu nutzen. Das ist eine Karte des Könnens, und Bescheidenheit belohnt sie nicht.",
                keywords: ["Können", "Wille", "Ressourcen"],
            },
            rev: {
                lede: "Jemand spielt eine Rolle, statt zu handeln.",
                text: "Umgekehrt ist der Magier reine Fassade. Entweder verkauft dir jemand etwas, der besser redet als liefert, oder du bist derjenige, der redet. Schau darauf, was tatsächlich entstanden ist, nicht darauf, was versprochen wurde.",
                keywords: [
                    "Manipulation",
                    "Leeres Gerede",
                    "Vergeudetes Talent",
                ],
            },
        },
        "high-priestess": {
            name: "Die Hohepriesterin",
            up: {
                lede: "Du weißt es schon. Du wartest nur auf die Erlaubnis, es zu wissen.",
                text: "Etwas wird verschwiegen, und vielleicht bist du es, die oder der schweigt. Die Hohepriesterin ist die Karte des Ungesagten: das Gefühl, das du nicht begründen kannst, die Antwort, die vor der Frage kam. Handle noch nicht. Hör noch eine Weile zu.",
                keywords: ["Intuition", "Stille", "Das Verborgene"],
            },
            rev: {
                lede: "Du hörst nicht mehr auf dich selbst.",
                text: "Umgekehrt ist das die Karte der überstimmten Ahnung. Jemand hat dir ausgeredet, was du gefühlt hast, oder du hast es dir selbst mit Logik ausgeredet. Der Weg zurück ist leise: weniger Input, weniger Meinungen und eine ehrliche Stunde allein.",
                keywords: ["Zweifel", "Lärm", "Überhörter Instinkt"],
            },
        },
        empress: {
            name: "Die Herrscherin",
            up: {
                lede: "Lass es wachsen. Reiß es nicht aus, um die Wurzeln zu prüfen.",
                text: "Die Herrscherin ist Fülle in ihrer schlichtesten Form: Dinge wachsen, weil sie gepflegt werden, nicht weil man sie antreibt. Das begünstigt Erschaffen, Umsorgen und Genießen, was schon gut ist. Gemütlichkeit ist diese Woche keine Schwäche.",
                keywords: ["Wachstum", "Fürsorge", "Fülle"],
            },
            rev: {
                lede: "Du gibst aus einem leeren Schrank.",
                text: "Umgekehrt hat die Herrscherin sich um alle gekümmert außer um sich selbst. Die Kreativität versiegt, das Zuhause fühlt sich nach Arbeit an, und Großzügigkeit kippt in Groll. Versorg zuerst dich selbst. Das ist nicht egoistisch, das ist Wartung.",
                keywords: ["Erschöpfung", "Vernachlässigung", "Erdrücken"],
            },
        },
        emperor: {
            name: "Der Herrscher",
            up: {
                lede: "Gib dem Ganzen eine Struktur.",
                text: "Diese Karte will Regeln, einen Plan, jemanden, der die Verantwortung trägt. Das kannst du sein. Was sich gerade chaotisch anfühlt, reagiert auf Grenzen und einen Zeitplan, nicht auf noch mehr Gefühl. Sei bestimmt, sei fair, und entschuldige dich für keins von beiden.",
                keywords: ["Ordnung", "Autorität", "Grenzen"],
            },
            rev: {
                lede: "Kontrolle ist zum Selbstzweck geworden.",
                text: "Umgekehrt ist der Herrscher starr, wo er stabil sein sollte. Jemand regiert aus Gewohnheit oder mit Gewalt. Wenn du es bist, frag dich, ob die Regel noch irgendwem dient. Wenn es jemand anderes ist, hör auf zu erwarten, dass er von selbst weicher wird.",
                keywords: ["Starrheit", "Dominanz", "Schwache Führung"],
            },
        },
        hierophant: {
            name: "Der Hierophant",
            up: {
                lede: "Mach es so, wie es immer gemacht wurde, fürs Erste.",
                text: "Tradition, Lehrer, Institutionen, der bewährte Weg. Der Hierophant sagt, dass der konventionelle Weg diesmal der richtige ist. Frag jemanden, der es schon gemacht hat. Halte dich an die Form. Zum Improvisieren ist später noch Zeit.",
                keywords: ["Tradition", "Anleitung", "Konvention"],
            },
            rev: {
                lede: "Die Regeln ergeben keinen Sinn mehr.",
                text: "Umgekehrt ist das der Moment, in dem du merkst, dass das Ritual seinen Grund überlebt hat. Ein Glaube, ein Job, eine Familienerwartung, der du gefolgt bist, ohne nach dem Warum zu fragen. Du musst es nicht niederbrennen. Aber du musst selbst entscheiden.",
                keywords: ["Rebellion", "Hinterfragen", "Entwachsen"],
            },
        },
        lovers: {
            name: "Die Liebenden",
            up: {
                lede: "Eine Wahl, und es ist wichtig, wohin du gehst.",
                text: "Ja, in dieser Karte geht es um Liebe. Aber auch um die Entscheidung, die Liebe erzwingt: wer du bist, wenn du mit diesem Menschen zusammen bist, und ob du so sein willst. Wähle mit deinem ganzen Selbst, nicht mit der Hälfte, die Angst vor dem Alleinsein hat.",
                keywords: ["Verbindung", "Wahl", "Einklang"],
            },
            rev: {
                lede: "Du willst zwei Dinge, die nicht beide wahr sein können.",
                text: "Umgekehrt zeigen die Liebenden einen Wertekonflikt. Er kann zwischen zwei Menschen liegen oder zwischen zwei Hälften von dir. Das Unbehagen löst sich nicht, indem du es ignorierst. Benenne, was jede Option kostet, und wähle den Preis, mit dem du leben kannst.",
                keywords: ["Konflikt", "Ungleichgewicht", "Fehlender Einklang"],
            },
        },
        chariot: {
            name: "Der Wagen",
            up: {
                lede: "Fahr los. Lenk nicht per Abstimmung.",
                text: "Der Wagen ist Schwung unter Kontrolle. Du hast gegensätzliche Kräfte zu bändigen, und der Trick ist nicht, eine davon loszuwerden, sondern beide zu halten und trotzdem voranzukommen. Selbstvertrauen ist hier die ganze Strategie. Wähl die Richtung und bleib dabei.",
                keywords: ["Antrieb", "Willenskraft", "Sieg"],
            },
            rev: {
                lede: "Nur Gas, keine Lenkung.",
                text: "Umgekehrt hat der Wagen die Zügel verloren. Entweder drückst du hart gegen etwas, das sich nicht bewegt, oder du wirst in zwei Richtungen gezogen und nennst es Fortschritt. Halt an, schau, wohin du wirklich fährst, und starte dann neu.",
                keywords: ["Aggression", "Richtungslos", "Stillstand"],
            },
        },
        strength: {
            name: "Die Kraft",
            up: {
                lede: "Die sanfte Hand gewinnt hier.",
                text: "Keine Gewalt. Geduld, Beständigkeit, die Art Mut, die kein Publikum braucht. Was dich auch anknurrt, ob ein Mensch, eine Angst oder eine Gewohnheit, findet seinen Meister in Ruhe. Du bist stärker als die Situation. Verhalte dich auch so, leise.",
                keywords: ["Mut", "Geduld", "Innere Stärke"],
            },
            rev: {
                lede: "Du zweifelst an einer Stärke, die du längst bewiesen hast.",
                text: "Umgekehrt ist die Kraft ein Selbstvertrauen, das ins Rutschen geraten ist. Entweder drückst du zu sehr, weil du dich schwach fühlst, oder du hast aufgegeben, weil du dich schwach fühlst. Beides stimmt nicht. Schau dir an, was du schon überstanden hast.",
                keywords: ["Selbstzweifel", "Gewalt", "Zerbrechlichkeit"],
            },
        },
        hermit: {
            name: "Der Eremit",
            up: {
                lede: "Werde bewusst still.",
                text: "Der Eremit ist Rückzug mit Grund. Kein Verstecken, sondern weit genug zurücktreten, um zu sehen, was der Lärm verdeckt hat. Nimm dir die Zeit allein. Lies, geh spazieren, denk nach. Die Antwort, die du suchst, ist nicht in dem Raum mit den anderen Leuten.",
                keywords: ["Alleinsein", "Besinnung", "Weisheit"],
            },
            rev: {
                lede: "Aus Alleinsein ist Einsamkeit geworden.",
                text: "Umgekehrt ist der Eremit zu lange auf dem Berg geblieben. Besinnung wurde zu Vermeidung, Privatsphäre zur Mauer. Du hast genug darüber nachgedacht. Komm wieder herunter und erzähl jemandem, was du gefunden hast.",
                keywords: ["Isolation", "Vermeidung", "Rückzug"],
            },
        },
        "wheel-of-fortune": {
            name: "Das Rad des Schicksals",
            up: {
                lede: "Das Glück dreht sich, und zwar zu deinen Gunsten.",
                text: "Etwas verschiebt sich, das du nicht verursacht hast und nicht kontrollieren kannst. Das Rad ist dir gerade wohlgesonnen, also sag Ja zu dem, was kommt. Das ist die Karte des glücklichen Zufalls, des Anrufs zur rechten Zeit, der Tür, die sich von selbst öffnet.",
                keywords: ["Wandel", "Glück", "Wendepunkt"],
            },
            rev: {
                lede: "Die Drehung geht gegen dich, und das ist nichts Persönliches.",
                text: "Umgekehrt bringt das Rad einen Rückschlag, der nichts mit deiner Mühe zu tun hat. Pläne verrutschen, das Timing versagt, eine Chance geht an jemand anderen. Widersteh dem Drang, darin eine Lektion zu suchen. Manchmal ist es einfach die Drehung. Halt durch, es dreht sich wieder.",
                keywords: [
                    "Schlechtes Timing",
                    "Rückschlag",
                    "Nicht in deiner Hand",
                ],
            },
        },
        justice: {
            name: "Die Gerechtigkeit",
            up: {
                lede: "Es wird fair ausgehen, wenn auch nicht schnell.",
                text: "Die Gerechtigkeit ist Ursache und Wirkung mit langem Gedächtnis. Was getan wurde, wird beantwortet, und was du jetzt tust, auch. Das begünstigt Ehrlichkeit, Verträge und die ganze Wahrheit, selbst wenn eine halbe leichter wäre.",
                keywords: ["Fairness", "Wahrheit", "Konsequenz"],
            },
            rev: {
                lede: "Jemand bekommt nicht, was ihm zusteht.",
                text: "Umgekehrt ist die Gerechtigkeit das unfaire Ergebnis oder die unfaire Ausrede. Entweder wirst du falsch behandelt, oder du drückst dich vor der Verantwortung für etwas, das deins war. Sei ehrlich, was davon zutrifft. Und dann sei es laut.",
                keywords: [
                    "Ungerechtigkeit",
                    "Unehrlichkeit",
                    "Abgewälzte Schuld",
                ],
            },
        },
        "hanged-man": {
            name: "Der Gehängte",
            up: {
                lede: "Hör auf zu kämpfen. Die Pause ist der Sinn.",
                text: "Du hängst in der Schwebe, und nichts, wogegen du drückst, bewegt sich. Der Gehängte sagt: Lass es hängen. Warten ist nicht verlieren. Kopfüber sieht die Lage anders aus, und genau diesen anderen Blick bist du holen gekommen.",
                keywords: ["Hingabe", "Warten", "Neuer Blickwinkel"],
            },
            rev: {
                lede: "Du steckst fest und nennst es Geduld.",
                text: "Umgekehrt hat der Gehängte aufgehört, aus der Pause zu lernen, und angefangen, sich darin zu verstecken. Ein Opfer ohne Sinn ist einfach Verlust. Wenn sich lange nichts verändert hat, schneid dich selbst los.",
                keywords: ["Hinhalten", "Widerstand", "Sinnloses Opfer"],
            },
        },
        death: {
            name: "Der Tod",
            up: {
                lede: "Etwas ist vorbei. Lass es vorbei sein.",
                text: "Diese Karte bedeutet fast nie, was die Leute fürchten. Sie steht für ein Ende, vollständig und notwendig: ein Kapitel, eine Rolle, eine Version von dir. Trauere, wenn du musst, aber versuch nicht, es wiederzubeleben. Was als Nächstes kommt, braucht den Platz.",
                keywords: ["Ende", "Verwandlung", "Loslassen"],
            },
            rev: {
                lede: "Du hältst etwas am Leben, das schon gestorben ist.",
                text: "Umgekehrt ist der Tod das Ende, das du nicht akzeptieren willst. Die Beziehung, die vor einem Jahr endete, der Plan, der nicht mehr möglich ist. Festhalten ist keine Treue. Es ist das, was zwischen dir und dem Nächsten steht.",
                keywords: ["Widerstand", "Klammern", "Verzögerter Wandel"],
            },
        },
        temperance: {
            name: "Die Mäßigkeit",
            up: {
                lede: "Misch, statt zu wählen.",
                text: "Die Mäßigkeit ist der Mittelweg, gelebt statt gepredigt. Zwei Dinge, die gegensätzlich wirken, lassen sich mit Geduld verbinden: Arbeit und Ruhe, Kopf und Herz, du und die anderen. Nichts Extremes diese Woche. Kleine Anpassungen, sorgfältig gemacht.",
                keywords: ["Balance", "Geduld", "Maß"],
            },
            rev: {
                lede: "Alles ist zu laut aufgedreht.",
                text: "Umgekehrt ist die Mäßigkeit Übermaß. Zu viel von etwas, ob Arbeit, Alkohol, Sorgen oder Liebe, auf Kosten von allem anderen. Die Lösung ist langweilig und sie wirkt: weniger von dem einen großen Ding, mehr von den vernachlässigten.",
                keywords: ["Übermaß", "Ungleichgewicht", "Ungeduld"],
            },
        },
        devil: {
            name: "Der Teufel",
            up: {
                lede: "Die Kette ist locker. Du könntest gehen.",
                text: "Der Teufel ist das, was du immer wieder wählst, obwohl es dich etwas kostet: eine Gewohnheit, ein Mensch, eine Geschichte über dich selbst. Merk, dass dich niemand dort festhält. Diese Karte ist keine Strafe. Sie ist der Moment, in dem du siehst, dass die Tür nie verschlossen war.",
                keywords: ["Anhaftung", "Gewohnheit", "Abhängigkeit"],
            },
            rev: {
                lede: "Du kommst frei, und es fühlt sich erst schlechter an, bevor es besser wird.",
                text: "Umgekehrt ist der Teufel Befreiung. Eine Abhängigkeit lockert sich, ein Muster bricht, und die Lücke, die bleibt, ist anfangs unbequem. Füll sie nicht mit der nächsten Version derselben Sache. Halt die Leere eine Weile aus.",
                keywords: ["Befreiung", "Ausbrechen", "Erholung"],
            },
        },
        tower: {
            name: "Der Turm",
            up: {
                lede: "Das Gebäude musste irgendwann fallen.",
                text: "Etwas bricht schneller zusammen, als du es auffangen kannst, und die Erleichterung unter dem Schock sagt dir, dass es nötig war. Was den Fall übersteht, ist das, was wirklich getragen hat. Bau darauf, und auf nichts anderes.",
                keywords: ["Bruch", "Wahrheit", "Befreiung"],
            },
            rev: {
                lede: "Du stützt eine Mauer, die einstürzen will.",
                text: "Umgekehrt ist der Turm ein aufgeschobener Einsturz. Jeder Monat Aufschub kostet mehr, als der Fall kosten würde. Die gnädigste Version davon endet zu deinen Bedingungen, also beende es selbst, bevor es für dich beendet wird.",
                keywords: ["Vermeidung", "Aufschub", "Preis"],
            },
        },
        star: {
            name: "Der Stern",
            up: {
                lede: "Das Schlimmste liegt hinter dir.",
                text: "Nach einer Zeit, die mehr genommen als gegeben hat, kehrt etwas Leises zurück. Keine Gewissheit, aber die Bereitschaft, wieder zu hoffen. Mach nicht gleich einen Plan daraus. Lass es fürs Erste eine Richtung sein.",
                keywords: ["Erneuerung", "Hoffnung", "Klarheit"],
            },
            rev: {
                lede: "Du erwartest nichts Gutes mehr.",
                text: "Umgekehrt zeigt der Stern ein Vertrauen, das so allmählich verblasst ist, dass du es nicht bemerkt hast. Nichts ist kaputt. Du bist müde. Die Reparatur heißt Ruhe und weniger Druck, nicht noch mehr Anstrengung.",
                keywords: ["Erschöpfung", "Zweifel", "Ruhe"],
            },
        },
        moon: {
            name: "Der Mond",
            up: {
                lede: "Du weißt mehr, als du beweisen kannst.",
                text: "Etwas ist absichtlich unklar. Nicht vor dir versteckt, nur noch nicht bereit, benannt zu werden. Vertrau dem Unbehagen, es ist eine Information. Erzwing heute Nacht keine Schlussfolgerung, und unterschreib nichts, was du bei Tageslicht nicht lesen kannst.",
                keywords: ["Intuition", "Ungewissheit", "Illusion"],
            },
            rev: {
                lede: "Der Nebel lichtet sich.",
                text: "Umgekehrt löst der Mond die Verwirrung. Eine Angst, um die du gekreist bist, ist bei Tageslicht kleiner als um drei Uhr morgens. Sprich sie vor einem Menschen laut aus und sieh zu, wie sie schrumpft.",
                keywords: ["Klarheit", "Befreiung", "Wahrheit"],
            },
        },
        sun: {
            name: "Die Sonne",
            up: {
                lede: "Es ist einfach gut. Genieß es, ohne nach dem Haken zu suchen.",
                text: "Die Sonne ist die wärmste Karte im Deck: Erfolg, Gesundheit, ein klarer Himmel. Worum es in deiner Frage auch ging, die Antwort ist großzügig. Der einzige mögliche Fehler ist, ihr zu misstrauen. Sag Ja, und lass dich dabei sehen, wie du es genießt.",
                keywords: ["Freude", "Erfolg", "Klarheit"],
            },
            rev: {
                lede: "Die gute Nachricht ist da. Du stehst in deinem eigenen Schatten.",
                text: "Umgekehrt ist die Sonne immer noch die Sonne, nur teilweise verdeckt. Pessimismus, Erschöpfung oder ein kleiner Kratzer am Ego halten dich von einem Glück fern, das schon dir gehört. Tritt einen Schritt zur Seite und lass es zu dir durch.",
                keywords: ["Getrübt", "Pessimismus", "Aufgeschobene Freude"],
            },
        },
        judgement: {
            name: "Das Gericht",
            up: {
                lede: "Du wirst gerufen. Antworte.",
                text: "Das Gericht ist die Abrechnung, die dich befreit: ein ehrlicher Blick darauf, wo du warst, und ein klarer Ruf dorthin, wo du hingehst. Vergib, was vergeben werden muss, auch dir selbst, und dann steh auf. Das ist eine Karte der genutzten zweiten Chancen.",
                keywords: ["Abrechnung", "Erwachen", "Vergebung"],
            },
            rev: {
                lede: "Du stellst dich immer wieder selbst vor Gericht.",
                text: "Umgekehrt ist das Gericht Selbstkritik ohne Urteil. Die Vergangenheit wird zum zehnten Mal neu gelesen, und es kommen keine neuen Informationen. Die Lektion ist gelernt. Beende die Verhandlung und geh leben.",
                keywords: ["Selbstzweifel", "Reue", "Den Ruf überhören"],
            },
        },
        world: {
            name: "Die Welt",
            up: {
                lede: "Es ist vollbracht, und es ist ganz.",
                text: "Die Welt ist Vollendung: der Abschluss geschafft, der Umzug gemacht, der Kreis geschlossen, ohne dass etwas offen bleibt. Nimm dir einen Moment, um zu merken, dass du es geschafft hast. Dann, und erst dann, schau, was der nächste Kreis sein könnte.",
                keywords: ["Vollendung", "Ganzheit", "Ankommen"],
            },
            rev: {
                lede: "So nah dran, und am letzten Schritt hängen geblieben.",
                text: "Umgekehrt ist die Welt das, was fast fertig ist und sich nicht ganz schließen lässt. Ein loses Ende, ein fehlendes Gespräch, ein ungesagter Abschied. Finde das Stück, das du übersprungen hast. Abschließen ist eine eigene Aufgabe.",
                keywords: ["Unvollendet", "Lose Enden", "Verzögerung"],
            },
        },

        // -------------------------------------------------------------- wands
        "wands-ace": {
            name: "Ass der Stäbe",
            up: {
                lede: "Ein Funke, und er ist echt.",
                text: "Die Idee, die diese Woche aufgetaucht ist, ist etwas wert. Das Ass der Stäbe ist roher Anfang: Energie, bevor sie eine Form hat. Warte nicht darauf, sie zu verfeinern. Tu heute etwas Konkretes damit, egal wie klein, solange sie noch heiß ist.",
                keywords: ["Inspiration", "Anfang", "Antrieb"],
            },
            rev: {
                lede: "Der Funke geht immer wieder aus.",
                text: "Umgekehrt ist das Begeisterung, die nicht zündet. Ideen kommen und sterben auf dem Schreibtisch. Das Problem ist nicht die Idee, sondern dass nichts die Chance bekommt zu wachsen. Wähl eine aus und schütz sie vor der nächsten.",
                keywords: [
                    "Fehlstart",
                    "Verzögerung",
                    "Verlorene Begeisterung",
                ],
            },
        },
        "wands-two": {
            name: "Zwei der Stäbe",
            up: {
                lede: "Plane den Aufbruch, bevor du aufbrichst.",
                text: "Du stehst an einem sicheren Ort und blickst auf etwas Größeres. Die Zwei der Stäbe ist der durchdachte Plan, die Karte vor der Reise. Ehrgeiz ist richtig. Vorbereitung auch. Entscheide, wohin, und dann, wie.",
                keywords: ["Planung", "Ehrgeiz", "Der weite Blick"],
            },
            rev: {
                lede: "Auf Nummer sicher gehen ist der ganze Plan geworden.",
                text: "Umgekehrt ist diese Karte ein Horizont, auf den du immer schaust und nie zugehst. Die Angst vor dem Unbekannten hat sich als vernünftige Vorsicht verkleidet. Wenn der Plan seit Monaten steht, fehlt nur noch der Mut.",
                keywords: ["Angst", "Zerplanen", "Kleinbleiben"],
            },
        },
        "wands-three": {
            name: "Drei der Stäbe",
            up: {
                lede: "Es hat abgelegt. Jetzt wartest du, bis es zurückkommt.",
                text: "Die Mühe ist in der Welt und außerhalb deiner Kontrolle. Die Drei der Stäbe ist Expansion im Gange: Türen, die sich in der Ferne öffnen, Ergebnisse, die noch zu dir unterwegs sind. Schau weiter nach außen. Etwas kommt.",
                keywords: ["Expansion", "Weitblick", "Fortschritt"],
            },
            rev: {
                lede: "Die Schiffe sind spät, und du läufst auf und ab.",
                text: "Umgekehrt ist das eine Verzögerung, die du nicht beschleunigen kannst, plus die Ungeduld, die sie länger wirken lässt. Etwas, das du losgeschickt hast, ist noch nicht zurück. Prüf, ob der Plan solide war, und hör dann auf, stündlich zum Horizont zu schauen.",
                keywords: ["Verzögerung", "Hindernisse", "Ungeduld"],
            },
        },
        "wands-four": {
            name: "Vier der Stäbe",
            up: {
                lede: "Feier es. Du hast dir einen schönen Abend verdient.",
                text: "Die Vier der Stäbe ist Zuhause, ein Fest, der Meilenstein mit Menschen drumherum. Etwas Stabiles ist erreicht und verdient es, gewürdigt zu werden. Lass die Feier nicht ausfallen, nur weil noch Arbeit wartet. Es wartet immer Arbeit.",
                keywords: ["Feier", "Zuhause", "Stabilität"],
            },
            rev: {
                lede: "Zu Hause ist es unruhig.",
                text: "Umgekehrt zeigt diese Karte Spannung, wo Leichtigkeit sein sollte: Stress in der Familie, ein Umzug, der nicht zur Ruhe kommt, ein Fest, das sich wie eine Pflicht anfühlt. Sprich das Unangenehme vor dem Treffen an, nicht danach.",
                keywords: ["Instabilität", "Spannung", "Unruhiges Zuhause"],
            },
        },
        "wands-five": {
            name: "Fünf der Stäbe",
            up: {
                lede: "Alle reden, und niemand hört zu.",
                text: "Die Fünf der Stäbe ist Reibung: Konkurrenz, Streit, fünf Leute mit fünf Plänen. Es ist eher laut als gefährlich. Der Weg hindurch ist nicht gewinnen, sondern ordnen. Irgendwer muss die Agenda setzen, und das kannst genauso gut du sein.",
                keywords: ["Konflikt", "Konkurrenz", "Chaos"],
            },
            rev: {
                lede: "Du weichst einem Streit aus, der geführt werden muss.",
                text: "Umgekehrt ist der Streit in den Untergrund gegangen. Niemand schreit, und nichts ist geklärt. Frieden durch Schweigen ist kein Frieden. Sprich das an, um das alle herumschleichen, und lass es eine Stunde lang laut sein.",
                keywords: ["Vermeidung", "Unterdrückte Spannung", "Klärung"],
            },
        },
        "wands-six": {
            name: "Sechs der Stäbe",
            up: {
                lede: "Du hast gewonnen. Lass es die Leute sehen.",
                text: "Anerkennung kommt, und zwar öffentlich. Die Sechs der Stäbe ist die Ehrenrunde, das Lob vor versammelter Runde. Nimm es an, ohne abzuwinken. Beim Erfolg gesehen zu werden gehört zum Erfolg dazu, und Bescheidenheit wirkt hier unecht.",
                keywords: ["Sieg", "Anerkennung", "Selbstvertrauen"],
            },
            rev: {
                lede: "Der Applaus bleibt aus, und das nagt an dir.",
                text: "Umgekehrt ist das entweder ein Fall aus der Gunst oder die Angst davor. Du hast die Arbeit gemacht und jemand anderes hat sich verbeugt, oder du hast die Arbeit gemacht und niemand hat hingeschaut. Frag dich, ob du den Applaus brauchst oder ob die Arbeit etwas bedeutet haben soll.",
                keywords: ["Ego", "Fehlende Anerkennung", "Absturz"],
            },
        },
        "wands-seven": {
            name: "Sieben der Stäbe",
            up: {
                lede: "Halte die Stellung. Du stehst oben.",
                text: "Du wirst herausgefordert, und es ist richtig, dass du dich verteidigst. Die Sieben der Stäbe heißt, standhaft zu bleiben gegen Druck, ob von einem Rivalen, einem Kritiker oder einer Menge Meinungen. Es ist anstrengend, und du schaffst es. Steig nicht herab, nur um es ihnen leichter zu machen.",
                keywords: ["Verteidigung", "Ausdauer", "Standhaftigkeit"],
            },
            rev: {
                lede: "Du bist zu müde, um es weiter zu verteidigen.",
                text: "Umgekehrt ist das der Kampf, den du nicht verlierst, weil du im Unrecht bist, sondern weil du erschöpft bist. Bitte um Hilfe. Oder frag dich, ob das, was du verteidigst, deine Verteidigung überhaupt noch braucht.",
                keywords: ["Überforderung", "Aufgeben", "Erschöpfung"],
            },
        },
        "wands-eight": {
            name: "Acht der Stäbe",
            up: {
                lede: "Alles bewegt sich gleichzeitig. Bleib dran.",
                text: "Die Acht der Stäbe ist Tempo: Nachrichten, Reisen, Neuigkeiten, Entscheidungen, die schneller kommen als sonst. Es ist ein gutes Tempo. Antworte zügig, buch das Ticket, sag Ja, solange das Fenster offen ist. Abwägen ist was für eine ruhigere Woche.",
                keywords: ["Tempo", "Bewegung", "Neuigkeiten"],
            },
            rev: {
                lede: "Alles hängt fest, und das Warten ist das Schlimmste.",
                text: "Umgekehrt ist das die verspätete Nachricht, die verschobene Reise, die Entscheidung, die nicht fällt. Hinterherjagen hilft nicht. Nutz die Pause, um zu prüfen, ob das, worauf du zuhetzt, wirklich da ist, wo du ankommen willst.",
                keywords: ["Verzögerung", "Frust", "Missverständnis"],
            },
        },
        "wands-nine": {
            name: "Neun der Stäbe",
            up: {
                lede: "Noch ein Schub. Du bist näher dran, als es sich anfühlt.",
                text: "Die Neun der Stäbe ist Widerstandskraft mit blauen Flecken. Du hast viel durchgemacht und stehst noch, wachsam. Bleib noch ein wenig auf der Hut, aber wisse: Das ist die letzte harte Strecke, nicht die Mitte davon.",
                keywords: ["Widerstandskraft", "Beharrlichkeit", "Wachsamkeit"],
            },
            rev: {
                lede: "Du verteidigst dich in einer Schlacht, die längst vorbei ist.",
                text: "Umgekehrt ist das der Mensch, der den Schild nicht ablegen kann. Alte Verletzungen lassen jede neue Situation wie die alte aussehen. Nicht jeder ist ein Angreifer. Senk die Deckung ein kleines Stück und sieh, was passiert.",
                keywords: ["Misstrauen", "Erschöpfung", "Alte Wunden"],
            },
        },
        "wands-ten": {
            name: "Zehn der Stäbe",
            up: {
                lede: "Du trägst zu viel, und niemand hat dich darum gebeten.",
                text: "Die Zehn der Stäbe ist die Überlast, die du dir selbst aufgebaut hast: Verantwortungen, eine nach der anderen aufgesammelt, bis der ganze Stapel die Sicht versperrt. Leg etwas davon ab. Gib ab, sag ab oder lass fallen. Nichts wird einstürzen. Manches davon war nie deins.",
                keywords: ["Last", "Überarbeitung", "Verantwortung"],
            },
            rev: {
                lede: "Etwas muss nachgeben, und gleich ist es so weit.",
                text: "Umgekehrt wird die Last abgeworfen, freiwillig oder durch Zusammenbruch. Wenn freiwillig, gut. Wenn durch Zusammenbruch, sei nachsichtig mit dir. So oder so: Heb denselben Stapel nicht aus Gewohnheit wieder auf.",
                keywords: ["Entlastung", "Burnout", "Loslassen"],
            },
        },
        "wands-page": {
            name: "Bube der Stäbe",
            up: {
                lede: "Sei bewusst Anfänger in etwas.",
                text: "Der Bube der Stäbe ist Begeisterung ohne Erfolgsbilanz, und genau das macht seinen Charme aus. Ein neues Interesse, eine mutige Nachricht, ein Plan, der naiv klingt für Leute, die aufgehört haben, Dinge anzufangen. Folge ihm mit Neugier statt mit Strategie.",
                keywords: ["Neugier", "Entdecken", "Freigeist"],
            },
            rev: {
                lede: "Viel Gerede über die Idee, und keine Idee.",
                text: "Umgekehrt ist der Bube zu jemandem geworden, der Pläne ankündigt, statt sie umzusetzen. Begeisterung ohne Durchhaltevermögen. Wenn das du bist, bring eine kleine Sache zu Ende, bevor du die nächste große anfängst.",
                keywords: ["Zögern", "Unvollendet", "Großspurigkeit"],
            },
        },
        "wands-knight": {
            name: "Ritter der Stäbe",
            up: {
                lede: "Geh jetzt, bevor du es dir ausredest.",
                text: "Der Schwung ist auf deiner Seite, und er hält nicht ewig. Diese Karte bevorzugt den unperfekten Start vor dem gut geplanten Warten. Bring die Begeisterung mit, und leih dir die Geduld von jemand anderem.",
                keywords: ["Schwung", "Kühnheit", "Jetzt"],
            },
            rev: {
                lede: "Nur Motor, keine Richtung.",
                text: "Umgekehrt verbrennt der Ritter Energie im Kreis. Dir fehlt es nicht an Antrieb, dir fehlt ein Ziel, das den Treibstoff wert ist. Wähl eine Sache und lass die anderen drei fallen.",
                keywords: ["Zerstreut", "Impuls", "Fokus"],
            },
        },
        "wands-queen": {
            name: "Königin der Stäbe",
            up: {
                lede: "Nimm den ganzen Raum ein. Es steht dir.",
                text: "Die Königin der Stäbe ist Wärme mit Rückgrat: selbstbewusst, großzügig und unmöglich zu übersehen. Ob das du bist oder jemand in deiner Nähe, der Rat ist derselbe. Führe, indem du ganz da bist, und lass die Leute davon angezogen werden.",
                keywords: ["Selbstvertrauen", "Wärme", "Ausstrahlung"],
            },
            rev: {
                lede: "Die Wärme ist scharf geworden.",
                text: "Umgekehrt ist die Königin ein Selbstbewusstsein, das in Anspruch umgeschlagen ist: Eifersucht, Launen, das Bedürfnis, im Mittelpunkt zu stehen. Oder das Gegenteil, ein Feuer, das so lange gedämpft wurde, dass es sich selbst vergessen hat. Finde die Mitte. Warm, nicht heiß.",
                keywords: ["Eifersucht", "Fordernd", "Selbstzweifel"],
            },
        },
        "wands-king": {
            name: "König der Stäbe",
            up: {
                lede: "Gib die Vision vor und lass andere die Details tragen.",
                text: "Der König der Stäbe ist Führung in ihrer natürlichsten Form: eine klare Idee, ein mutiger Plan und das Charisma, das andere mitmachen lassen will. Übernimm die größere Rolle. Du musst nicht alles selbst machen, du musst die Richtung zeigen.",
                keywords: ["Führung", "Vision", "Kühnheit"],
            },
            rev: {
                lede: "Jemand führt nur, um vorne zu stehen.",
                text: "Umgekehrt ist der König eine Vision, die zur Forderung nach Gefolgschaft geworden ist. Ungeduld, Arroganz, Entscheidungen, die zu schnell fallen und nicht erklärt werden. Nimm das Tempo raus und hör der Person ganz hinten im Raum zu.",
                keywords: ["Arroganz", "Impulsivität", "Tyrannei"],
            },
        },

        // --------------------------------------------------------------- cups
        "cups-ace": {
            name: "Ass der Kelche",
            up: {
                lede: "Etwas in dir hat sich geöffnet.",
                text: "Das Ass der Kelche ist der Anfang eines Gefühls: neue Liebe, eine Freundschaft, die tiefer wird, eine kreative Flut, eine Zärtlichkeit, die du nicht geplant hast. Lass es ein bisschen überlaufen. Diese Karte belohnt es nicht, den Deckel draufzuhalten.",
                keywords: ["Neues Gefühl", "Liebe", "Offenheit"],
            },
            rev: {
                lede: "Du hast den Hahn zugedreht.",
                text: "Umgekehrt ist das zurückgehaltenes Gefühl: nicht fühlen oder dich nicht fühlen lassen. Vielleicht ist es Selbstschutz, nachdem dich etwas verletzt hat. Das ist verständlich, und es kann trotzdem nicht für immer sein. Lass eine kleine Sache herein.",
                keywords: ["Blockiert", "Verdrängung", "Leere"],
            },
        },
        "cups-two": {
            name: "Zwei der Kelche",
            up: {
                lede: "Ein gleichwertiger Austausch, freiwillig gegeben.",
                text: "Zwei Menschen, die sich in derselben Tiefe und zur selben Zeit begegnen. Was es auch ist, ob neue Liebe, eine reparierte Freundschaft oder eine Arbeitspartnerschaft, seine Stärke liegt darin, dass keine Seite etwas vorspielt.",
                keywords: ["Verbindung", "Gegenseitigkeit", "Vertrauen"],
            },
            rev: {
                lede: "Einer von euch trägt mehr als die Hälfte.",
                text: "Umgekehrt zeigt die Zwei der Kelche ein Ungleichgewicht, das keiner von beiden laut ausgesprochen hat. Die Lösung ist unspektakulär: Sag klar, was du brauchst, und lass den anderen ehrlich antworten.",
                keywords: ["Ungleichgewicht", "Zurückhalten", "Versöhnung"],
            },
        },
        "cups-three": {
            name: "Drei der Kelche",
            up: {
                lede: "Ruf deine Leute an.",
                text: "Die Drei der Kelche ist Freundschaft und Feiern: das Abendessen, das lang wird, die Freunde, die dich von früher kennen. Worum es in deiner Frage auch ging, die Antwort hat mit anderen Menschen zu tun und vermutlich mit einem Tisch. Mach das hier nicht allein.",
                keywords: ["Freundschaft", "Feier", "Gemeinschaft"],
            },
            rev: {
                lede: "Die Gruppe ist still geworden, oder sauer.",
                text: "Umgekehrt ist das entweder Abstand zu deinem Kreis oder ein Kreis, der sich gewendet hat. Tratsch, ein Zerwürfnis, zu viele Abende unterwegs und zu wenig echte Gespräche. Such die eine Freundin oder den einen Freund, der dir die Wahrheit sagt, und fang dort an.",
                keywords: ["Isolation", "Tratsch", "Übermaß"],
            },
        },
        "cups-four": {
            name: "Vier der Kelche",
            up: {
                lede: "Dir wird etwas angeboten, und du siehst es nicht.",
                text: "Die Vier der Kelche ist Langeweile mit den Optionen vor dir, während eine bessere knapp außer Sicht liegt. Gleichgültigkeit ist ein Nebel, keine Tatsache. Schau dir an, was du in letzter Zeit abgetan hast. Einer dieser Kelche ist es wert, aufgehoben zu werden.",
                keywords: ["Gleichgültigkeit", "Verpasste Angebote", "Grübeln"],
            },
            rev: {
                lede: "Der Nebel hebt sich, und du willst wieder etwas.",
                text: "Umgekehrt ist das der Weg aus einer flachen Phase. Das Interesse kehrt zurück, eine Chance, die du ignoriert hast, sieht anders aus, und du bist bereit, Ja zu etwas zu sagen. Vertrau dem Appetit. Er war eine Weile weg.",
                keywords: ["Neues Interesse", "Bereitschaft", "Klarheit"],
            },
        },
        "cups-five": {
            name: "Fünf der Kelche",
            up: {
                lede: "Drei verschüttet, zwei stehen noch.",
                text: "Die Fünf der Kelche ist Trauer um das Verlorene, und sie ist echt. Aber die Karte zeigt auch, was unbemerkt hinter dir noch steht. Trauere richtig. Dann dreh dich um. Der Verlust ist wahr, und er ist nicht das ganze Bild.",
                keywords: ["Verlust", "Trauer", "Was bleibt"],
            },
            rev: {
                lede: "Du bist bereit, dich umzudrehen.",
                text: "Umgekehrt ist die Fünf der Kelche der erste Tag, an dem der Verlust nicht der erste Gedanke ist. Annahme, Vergebung oder einfach Müdigkeit vom Traurigsein. Was es auch ist, es zählt. Nimm es als Zeichen, dass du dich bewegen kannst.",
                keywords: ["Annahme", "Weitergehen", "Vergebung"],
            },
        },
        "cups-six": {
            name: "Sechs der Kelche",
            up: {
                lede: "Etwas aus der Vergangenheit kehrt freundlich zurück.",
                text: "Die Sechs der Kelche ist Nostalgie in ihrer nützlichsten Form: ein alter Freund, ein Ort aus der Kindheit, eine Erinnerung, die eine Antwort enthält. Erlaub dir, sentimental zu sein. Wer du vor all dem warst, weiß vielleicht etwas, das du vergessen hast.",
                keywords: ["Nostalgie", "Unschuld", "Wiedersehen"],
            },
            rev: {
                lede: "Du lebst in einem Foto.",
                text: "Umgekehrt ist das die Vergangenheit als Versteck. Das Verklären dessen, was war, oder die Weigerung, darüber hinauszuwachsen. Die alten Zeiten waren gut, und sie sind vorbei. Nimm eine Sache daraus mit und lass den Rest, wo er hingehört.",
                keywords: [
                    "In der Vergangenheit feststecken",
                    "Naivität",
                    "Erwachsenwerden",
                ],
            },
        },
        "cups-seven": {
            name: "Sieben der Kelche",
            up: {
                lede: "Zu viele Optionen, und die meisten sind Nebel.",
                text: "Die Sieben der Kelche ist der Tagtraum mit einem Dutzend Türen. Manche sind echt, die meisten Wunschdenken, und wer alle anstarrt, geht durch keine. Wähl die, mit der du morgen früh anfangen könntest. Das ist die echte.",
                keywords: ["Wahlmöglichkeiten", "Illusion", "Wunschdenken"],
            },
            rev: {
                lede: "Die Wahl wird offensichtlich.",
                text: "Umgekehrt lichtet sich der Nebel, und die Optionen schrumpfen auf eine oder zwei. Entweder hast du dich entschieden, oder die Situation hat für dich entschieden. So oder so, nimm die Eingrenzung an. Fokus ist hier das Geschenk.",
                keywords: ["Klarheit", "Entscheidung", "Fokus"],
            },
        },
        "cups-eight": {
            name: "Acht der Kelche",
            up: {
                lede: "Geh weg von etwas, das noch funktioniert.",
                text: "Die Acht der Kelche ist das schwere Gehen: nicht vor einer Katastrophe, sondern weg von etwas, das in Ordnung ist und nicht mehr reicht. Du wirst es nicht allen erklären können. Das musst du auch nicht. Geh, und geh leise.",
                keywords: ["Aufbruch", "Suche", "Loslassen"],
            },
            rev: {
                lede: "Aus Angst bleiben, oder aus Angst gehen.",
                text: "Umgekehrt ist das Vermeidung in einem von zwei Kostümen: nicht verlassen wollen, was vorbei ist, oder davonlaufen vor dem, was bloß schwierig geworden ist. Frag dich ehrlich, was zutrifft. Dann tu das Mutigere von beiden, was immer das für dich ist.",
                keywords: ["Angst vor Veränderung", "Ziellos", "Vermeidung"],
            },
        },
        "cups-nine": {
            name: "Neun der Kelche",
            up: {
                lede: "Der Wunsch ist erfüllt. Sag Danke.",
                text: "Die Neun der Kelche ist die Wunschkarte, und sie meint es ernst. Zufriedenheit, Erfüllung, ein guter Ausgang für das, wonach du gefragt hast. Genieß es einfach. Es hängt keine Lektion daran. Manche Wochen sind einfach gut.",
                keywords: ["Zufriedenheit", "Erfüllter Wunsch", "Genuss"],
            },
            rev: {
                lede: "Du hast es bekommen, und es hat das Eigentliche nicht gelöst.",
                text: "Umgekehrt ist das der Wunsch, der ankam und dich leer zurückließ. Das Problem war nie das Fehlende. Schau, was du darunter eigentlich wolltest, denn das wartet immer noch darauf, dass du darum bittest.",
                keywords: ["Unzufriedenheit", "Gier", "Leerer Sieg"],
            },
        },
        "cups-ten": {
            name: "Zehn der Kelche",
            up: {
                lede: "Dafür war das alles.",
                text: "Die Zehn der Kelche ist Zuhause im vollsten Sinn: Liebe, die gehalten hat, eine Familie, die funktioniert, ein Frieden, der keine Erklärung braucht. Wenn du das hast, nimm es wahr. Wenn du darauf hinbaust, sagt sie dir, dass du richtig baust.",
                keywords: ["Harmonie", "Familie", "Beständige Liebe"],
            },
            rev: {
                lede: "Von außen sieht das Bild richtig aus.",
                text: "Umgekehrt ist das die glückliche Familie, die keine ist, oder die Angst, dass deine keine ist. Zu Hause bleibt etwas unausgesprochen. Mit einem schöneren Abendessen repariert sich das nicht. Ein ehrliches Gespräch ist mehr wert als ein Jahr Vorspielen.",
                keywords: ["Entfremdung", "Zerbrochenes Zuhause", "Fassade"],
            },
        },
        "cups-page": {
            name: "Bube der Kelche",
            up: {
                lede: "Eine kleine, zärtliche Überraschung.",
                text: "Der Bube der Kelche ist das unerwartete Gefühl: eine Nachricht, die dich berührt, ein kreativer Impuls aus dem Nichts, jemand ist lieb zu dir, wenn du es nicht erwartest. Sei offen dafür. Zynismus ist kein Schutz, er ist einfach weniger.",
                keywords: ["Feingefühl", "Überraschung", "Kreativität"],
            },
            rev: {
                lede: "Das Gefühl ist echt, und die Art, es zu zeigen, ist ein Chaos.",
                text: "Umgekehrt ist der Bube emotionale Unreife: Launen, Schmollen oder Gefühle als Druckmittel. Wenn es jemand anderes ist, beiß nicht an. Wenn du es bist, sag die schlichte Version dessen, was du fühlst, und lass das Theater weg.",
                keywords: [
                    "Unreife",
                    "Launenhaftigkeit",
                    "Blockierte Kreativität",
                ],
            },
        },
        "cups-knight": {
            name: "Ritter der Kelche",
            up: {
                lede: "Ein Angebot von Herzen.",
                text: "Der Ritter der Kelche ist Romantik in Bewegung: die Einladung, die große Geste, der Mensch, der es ernst meint. Oder du bist dieser Mensch. Nimm das Angebot an, oder mach es selbst. Diese Karte bevorzugt die offene Hand vor der vorsichtigen.",
                keywords: ["Romantik", "Einladung", "Idealismus"],
            },
            rev: {
                lede: "Nur Charme, keine Verlässlichkeit.",
                text: "Umgekehrt verspricht der Ritter den Mond und liefert eine Nachricht um Mitternacht. Vorsicht bei jemandem, dessen Gesten weiter reichen als seine Zuverlässigkeit. Wenn das du bist, gib diese Woche ein kleines Versprechen und halte es vollständig.",
                keywords: ["Unzuverlässig", "Launisch", "Enttäuschung"],
            },
        },
        "cups-queen": {
            name: "Königin der Kelche",
            up: {
                lede: "Fühl es ganz und bleib trotzdem ruhig.",
                text: "Die Königin der Kelche ist emotionale Tiefe mit Bodenhaftung: mitfühlend, intuitiv und nicht mitgerissen. Vertrau deiner Einschätzung der beteiligten Menschen. Führe mit Fürsorge, und verwechsle Sanftheit nicht mit Schwäche.",
                keywords: ["Mitgefühl", "Intuition", "Emotionale Tiefe"],
            },
            rev: {
                lede: "Die Gefühle bestimmen den Raum.",
                text: "Umgekehrt ist die Königin überwältigt: zu durchlässig, zu verstrickt, sie übernimmt die Stimmung aller anderen. Oder sie hat ganz dichtgemacht, um klarzukommen. So oder so, zieh wieder eine Grenze. Fürsorge für andere beginnt mit einer Tür, die sich schließen lässt.",
                keywords: ["Überforderung", "Co-Abhängigkeit", "Dichtgemacht"],
            },
        },
        "cups-king": {
            name: "König der Kelche",
            up: {
                lede: "Ruhe im Sturm, und sie gehört dir.",
                text: "Der König der Kelche ist emotionale Reife: alles fühlen und trotzdem die weise Reaktion wählen. Sei diese Woche der Ruhepol. Jemand braucht einen Menschen, der nicht reagiert, und du kannst das besser, als du denkst.",
                keywords: ["Balance", "Weisheit", "Diplomatie"],
            },
            rev: {
                lede: "Die Ruhe ist eine Maske, und sie bekommt Risse.",
                text: "Umgekehrt ist der König Kontrolle statt Gelassenheit. Gefühle, so lange hinuntergedrückt, bis sie seitlich austreten, als Kälte, Manipulation oder plötzliche Flut. Lass bewusst etwas heraus, bevor es von selbst herauskommt.",
                keywords: ["Verdrängung", "Manipulation", "Unberechenbarkeit"],
            },
        },

        // ------------------------------------------------------------- swords
        "swords-ace": {
            name: "Ass der Schwerter",
            up: {
                lede: "Plötzlich ist es offensichtlich.",
                text: "Das Ass der Schwerter ist der Moment der Klarheit: die Wahrheit, die durchschneidet, die Idee, die den Streit beendet. Sag es klar und deutlich. Diese Karte belohnt den klaren Satz statt des diplomatischen Absatzes.",
                keywords: ["Klarheit", "Wahrheit", "Durchbruch"],
            },
            rev: {
                lede: "Jeder hat ein Argument, und keins ergibt ein Ganzes.",
                text: "Umgekehrt ist das Verwirrung, wo Klarheit sein sollte, oder eine Wahrheit, die als Waffe benutzt wird. Wenn du nicht klar denken kannst, hör auf zu entscheiden. Wenn jemand brutal ist und es Ehrlichkeit nennt, darfst du den Raum verlassen.",
                keywords: ["Verwirrung", "Grausamkeit", "Wirres Denken"],
            },
        },
        "swords-two": {
            name: "Zwei der Schwerter",
            up: {
                lede: "Du weigerst dich zu entscheiden, und das ist auch eine Entscheidung.",
                text: "Die Zwei der Schwerter ist die Pattsituation: zwei Optionen auf Armlänge, die Augen vor beiden verschlossen. Die Information, auf die du wartest, kommt nicht. Öffne die Augen, wähl die, mit der du leben kannst, und lass die andere gehen.",
                keywords: ["Patt", "Vermeidung", "Schwere Wahl"],
            },
            rev: {
                lede: "Die Augenbinde fällt.",
                text: "Umgekehrt löst sich die Blockade, manchmal unangenehm. Informationen kommen an, oder deine Geduld ist am Ende. So oder so siehst du jetzt, und sehen heißt handeln. Leg die Augenbinde nicht wieder an, nur weil der Anblick schwer ist.",
                keywords: ["Befreiung", "Überlastung", "Enthüllte Wahrheit"],
            },
        },
        "swords-three": {
            name: "Drei der Schwerter",
            up: {
                lede: "Es tut weh, und das soll es auch.",
                text: "Die Drei der Schwerter ist Herzschmerz, ganz schlicht. Ein Verlust, ein Verrat, eine Wahrheit, die wie ein Schlag trifft. Hetz nicht daran vorbei und rede es dir nicht aus. Ein so klarer Schmerz ist wenigstens ehrlich. Lass ihn spüren, und er geht vorüber.",
                keywords: ["Herzschmerz", "Trauer", "Schmerzhafte Wahrheit"],
            },
            rev: {
                lede: "Die Wunde schließt sich.",
                text: "Umgekehrt ist das entweder Heilung oder die Weigerung zu fühlen, und du weißt, was davon. Wenn der Schmerz nachlässt, gut, lass ihn. Wenn du so beschäftigt warst, dass du nie damit stillsitzen musstest, wartet er noch, und er ist geduldig.",
                keywords: ["Heilung", "Verdrängung", "Vergebung"],
            },
        },
        "swords-four": {
            name: "Vier der Schwerter",
            up: {
                lede: "Ruh dich aus. Richtig, nicht mit schlechtem Gewissen.",
                text: "Die Vier der Schwerter ist Erholung: die Pause nach der Anstrengung, der Rückzug, der den nächsten Schritt möglich macht. Worum es in deiner Frage auch ging, die Antwort lautet: noch nicht. Schlaf, tritt zurück, und entschuldige dich nicht dafür.",
                keywords: ["Ruhe", "Erholung", "Rückzug"],
            },
            rev: {
                lede: "Du hast lange genug geruht. Oder gar nicht.",
                text: "Umgekehrt ist das entweder Unruhe nach einer Pause, die ihren Zweck erfüllt hat, oder Burnout, weil du keine Pause machen wolltest. Wenn es dich juckt loszulegen, leg los. Wenn du auf Reserve läufst, ist das kein Vorschlag.",
                keywords: ["Unruhe", "Burnout", "Wiedereinstieg"],
            },
        },
        "swords-five": {
            name: "Fünf der Schwerter",
            up: {
                lede: "Du kannst das gewinnen und alle verlieren.",
                text: "Die Fünf der Schwerter ist der leere Sieg: recht haben auf Kosten der Beziehung, der Streit, der den Gewinner allein auf dem Feld zurücklässt. Frag dich, was du wirklich willst. Wenn es Frieden ist, musst du vielleicht aufhören, recht zu haben.",
                keywords: ["Konflikt", "Leerer Sieg", "Preis"],
            },
            rev: {
                lede: "Zeit, das Schwert niederzulegen.",
                text: "Umgekehrt ist das das Ende eines Kampfes oder der Wunsch danach. Versöhnung, oder zumindest die Entscheidung aufzuhören. Jemand muss den ersten Schritt machen, und die Karte deutet an, dass du es sein könntest. Den Streit zu verlieren heißt nicht zu verlieren.",
                keywords: ["Versöhnung", "Loslassen", "Wiedergutmachung"],
            },
        },
        "swords-six": {
            name: "Sechs der Schwerter",
            up: {
                lede: "Du verlässt raues Wasser. Schau noch nicht zurück.",
                text: "Die Sechs der Schwerter ist Übergang: die stille Überfahrt von einem harten Ort zu einem ruhigeren. Sie ist nicht triumphierend. Sie ist Erleichterung. Lass eine Weile jemand anderen rudern, und vertrau darauf, dass das andere Ufer echt ist.",
                keywords: ["Übergang", "Erholung", "Weitergehen"],
            },
            rev: {
                lede: "Du kehrst immer wieder zum Ufer zurück, das du verlassen hast.",
                text: "Umgekehrt gerät die Überfahrt ins Stocken. Ballast, den du hättest zurücklassen sollen, ist im Boot, oder du drehst auf halbem Weg um. Etwas Ungeklärtes zieht. Kümmere dich darum, aber vom anderen Ufer aus, nicht durch Umkehren.",
                keywords: ["Widerstand", "Ballast", "Festgefahren"],
            },
        },
        "swords-seven": {
            name: "Sieben der Schwerter",
            up: {
                lede: "Jemand ist gerissen, und vielleicht bist du es.",
                text: "Die Sieben der Schwerter ist Strategie mit verborgener Kante: zu bekommen, was du brauchst, indem du drumherum gehst statt mittendurch. Manchmal ist das klug. Manchmal ist es einfach Schleichen. Prüf, ob es dir recht wäre, wenn alle zusehen könnten.",
                keywords: ["Strategie", "Täuschung", "Damit durchkommen"],
            },
            rev: {
                lede: "Das Geheimnis kommt gleich ans Licht.",
                text: "Umgekehrt taucht das Verborgene auf. Ob deine oder die von jemand anderem, eine Täuschung kommt ans Ende ihres Weges. Wenn es deine ist, steh dazu, bevor sie entdeckt wird. Das Geständnis kostet weniger als die Entdeckung.",
                keywords: ["Enthüllung", "Geständnis", "Gewissen"],
            },
        },
        "swords-eight": {
            name: "Acht der Schwerter",
            up: {
                lede: "Die Fesseln sind locker. Du hast sie nur nicht geprüft.",
                text: "Die Acht der Schwerter ist die Falle, die vor allem aus Glauben besteht: sich festgefahren, machtlos, eingesperrt fühlen, während die Ausgänge offen sind. Die Angst macht die Knoten. Prüf eine Annahme, die du noch nie geprüft hast. Sie wird wahrscheinlich nachgeben.",
                keywords: ["Einschränkung", "Angst", "Selbst gesetzte Grenzen"],
            },
            rev: {
                lede: "Du arbeitest dich frei.",
                text: "Umgekehrt ist die Acht der Schwerter der erste Schritt hinaus: eine Grenze hinterfragt, eine Geschichte über dich endlich angezweifelt. Es geht langsam, und es zählt. Mach weiter. Die Augenbinde ist ab, als Nächstes kommen die Hände.",
                keywords: ["Befreiung", "Neue Perspektive", "Freiheit"],
            },
        },
        "swords-nine": {
            name: "Neun der Schwerter",
            up: {
                lede: "Drei Uhr morgens ist kein verlässlicher Erzähler.",
                text: "Die Neun der Schwerter ist Sorge in ihrer schlimmsten Form: die schlaflose Schleife, die Katastrophe hundertmal durchgespielt. Das meiste davon wird nicht passieren. Schreib es auf, sag es einem Menschen, und merk, wie es im Licht schrumpft.",
                keywords: ["Angst", "Schlaflosigkeit", "Grauen"],
            },
            rev: {
                lede: "Die schlimmste Nacht liegt hinter dir.",
                text: "Umgekehrt ist das der Morgen danach: Die Perspektive kehrt zurück, die Angst schrumpft auf ihre echte Größe. Oder, weniger freundlich, es ist eine Sorge, die du dir nicht eingestehen willst. So oder so ist der Ausweg derselbe. Sprich sie laut vor jemandem aus.",
                keywords: ["Erleichterung", "Perspektive", "Verborgene Sorge"],
            },
        },
        "swords-ten": {
            name: "Zehn der Schwerter",
            up: {
                lede: "Es ist ganz und gar vorbei. Das ist die gute Nachricht.",
                text: "Die Zehn der Schwerter ist der Tiefpunkt, und der Tiefpunkt hat einen Vorzug: Tiefer fallen geht nicht. Etwas ist schlecht und endgültig zu Ende gegangen. Hör auf, es retten zu wollen. Die Sonne am Horizont dieser Karte geht auf, nicht unter.",
                keywords: ["Ende", "Tiefpunkt", "Endgültigkeit"],
            },
            rev: {
                lede: "Du stehst wieder auf.",
                text: "Umgekehrt ist die Zehn der Schwerter die Erholung vom Schlimmsten oder die Weigerung zuzugeben, dass es vorbei ist. Wenn du wieder aufstehst, mach langsam. Wenn du noch daliegst und hoffst, sagt dir die Karte, dass es vorbei ist.",
                keywords: ["Erholung", "Überleben", "Das Ende nicht wahrhaben"],
            },
        },
        "swords-page": {
            name: "Bube der Schwerter",
            up: {
                lede: "Stell die Frage, für die alle anderen zu höflich sind.",
                text: "Der Bube der Schwerter ist Neugier mit Schärfe: wachsam, schnell, ohne Scheu vor der unbequemen Frage. Etwas muss untersucht werden. Sei die Person, die hinschaut. Halt den Ton leicht und die Notizen gründlich.",
                keywords: ["Neugier", "Wachsamkeit", "Direktheit"],
            },
            rev: {
                lede: "Nur Gerede, und nicht alles davon freundlich.",
                text: "Umgekehrt ist der Bube Tratsch, vorschnelle Worte oder ein Streit, nur aus Spaß angefangen. Wenn jemand Unruhe stiftet, steig nicht ein. Wenn du es bist, frag dich, was du vermeidest, indem du alles laut hältst.",
                keywords: ["Tratsch", "Hast", "Abwehrhaltung"],
            },
        },
        "swords-knight": {
            name: "Ritter der Schwerter",
            up: {
                lede: "Angriff. Nachdenken unterwegs.",
                text: "Der Ritter der Schwerter ist Tempo und Gewissheit: die Entscheidung getroffen, die Nachricht verschickt, die Idee mit voller Wucht verfolgt. Das passt zu einem Moment, der lange genug gewartet hat. Sei direkt und schnell, und akzeptier, dass du dabei nicht sanft sein wirst.",
                keywords: ["Handeln", "Tempo", "Überzeugung"],
            },
            rev: {
                lede: "Schnell, laut, und aufs Falsche gerichtet.",
                text: "Umgekehrt ist der Ritter Aggression ohne Ziel oder eine Hast, die Schäden hinterlässt. Worte zu schnell gesagt, Entscheidungen getroffen, um entschlossen zu wirken. Werde langsam genug, um zu prüfen, wohin das Schwert zeigt.",
                keywords: ["Leichtsinn", "Aggression", "Falsches Ziel"],
            },
        },
        "swords-queen": {
            name: "Königin der Schwerter",
            up: {
                lede: "Sag es klar. Du musst es nicht abmildern.",
                text: "Die Königin der Schwerter ist Ehrlichkeit mit Anmut: klar sehen, direkt sprechen und sich nicht von Sentimentalität manipulieren lassen. Sei diese Woche wie sie. Zieh die Grenze, nenn die Tatsache, und lass die Leute erwachsen damit umgehen.",
                keywords: ["Klarheit", "Ehrlichkeit", "Unabhängigkeit"],
            },
            rev: {
                lede: "Aus scharf ist kalt geworden.",
                text: "Umgekehrt ist die Königin Verbitterung, die sich als Realismus ausgibt, oder eine Grenze, die zur Mauer geworden ist. Jemand ist verletzend und nennt es Ehrlichkeit. Wenn du es bist, denk daran, dass Klarheit und Grausamkeit verschiedene Werkzeuge sind.",
                keywords: ["Verbitterung", "Kälte", "Härte"],
            },
        },
        "swords-king": {
            name: "König der Schwerter",
            up: {
                lede: "Entscheide nach den Fakten, und dann entscheide.",
                text: "Der König der Schwerter ist Autorität durch Vernunft: fair, klar, unbeeindruckt von Schmeichelei oder Druck. Das begünstigt den logischen Weg, das Expertenurteil, den Vertrag, der vollständig gelesen wird. Denk es durch, dann urteile.",
                keywords: ["Autorität", "Logik", "Urteilskraft"],
            },
            rev: {
                lede: "Recht zu haben ist zur Ausrede für Härte geworden.",
                text: "Umgekehrt regiert der König allein mit dem Verstand und nennt es Fairness. Kalte Entscheidungen, Manipulation, der Buchstabe des Gesetzes über seinem Geist. Hol den Menschen zurück in die Rechnung, bevor du urteilst.",
                keywords: ["Tyrannei", "Manipulation", "Kälte"],
            },
        },

        // ---------------------------------------------------------- pentacles
        "pentacles-ace": {
            name: "Ass der Münzen",
            up: {
                lede: "Eine echte Chance, mit Geld darin.",
                text: "Das Ass der Münzen ist der Samen von etwas Materiellem: ein Job, ein Angebot, eine Wohnung, ein Plan, der sich auszahlen könnte. Es ist ein Anfang, also braucht es Pflege. Nimm es ernst und geh es langsam an, dann wächst es.",
                keywords: ["Chance", "Wohlstand", "Neues Vorhaben"],
            },
            rev: {
                lede: "Das Angebot ist nicht, wonach es aussieht.",
                text: "Umgekehrt ist das der Deal, der platzt, die Chance mit einem Loch darin oder Geldsorgen, die das Urteilsvermögen verdrängen. Lies die Bedingungen zweimal. Wenn es sich zu leicht anfühlt, ist es das wahrscheinlich auch. Warte auf den nächsten Samen.",
                keywords: ["Verpasste Chance", "Schlechte Planung", "Mangel"],
            },
        },
        "pentacles-two": {
            name: "Zwei der Münzen",
            up: {
                lede: "Du hältst gerade alles in der Luft, fürs Erste.",
                text: "Die Zwei der Münzen ist das Jonglieren: zwei Jobs, zwei Prioritäten, Geld, das am selben Tag rein- und rausgeht. Du kriegst es hin, und das ist beeindruckend. Wisse nur, dass das eine Phase ist, kein System. Plane die Landung.",
                keywords: ["Balance", "Jonglieren", "Anpassungsfähigkeit"],
            },
            rev: {
                lede: "Gleich fällt etwas herunter.",
                text: "Umgekehrt misslingt das Jonglieren. Zu viele Zusagen, verpasste Zahlungen, ein Zeitplan, der endgültig bricht. Wähl selbst, was du fallen lässt, bevor es für dich gewählt wird. Zwei Dinge gut gemacht schlagen vier halb gemachte.",
                keywords: ["Überforderung", "Unordnung", "Ungleichgewicht"],
            },
        },
        "pentacles-three": {
            name: "Drei der Münzen",
            up: {
                lede: "Mach es mit Leuten, die wissen, was sie tun.",
                text: "Die Drei der Münzen ist gekonnte Zusammenarbeit: Arbeit, die besser wird, weil mehr als ein Profi daran war. Bitte jemand Gutes um Hilfe. Zeig deine Arbeit. Diese Karte belohnt Handwerk, und sie belohnt Teams.",
                keywords: ["Teamarbeit", "Handwerk", "Anerkennung"],
            },
            rev: {
                lede: "Niemand zieht in dieselbe Richtung.",
                text: "Umgekehrt funktioniert das Team nicht: schlampige Arbeit, fehlende Fähigkeiten oder Leute, die einander nicht zuhören. Sag, was der Maßstab ist. Wenn deine eigene Arbeit nachlässt, finde heraus, warum, bevor jemand anderes dich darauf hinweisen muss.",
                keywords: [
                    "Schlechte Teamarbeit",
                    "Mangelnde Qualität",
                    "Disharmonie",
                ],
            },
        },
        "pentacles-four": {
            name: "Vier der Münzen",
            up: {
                lede: "Halt fest, was du hast. Nur nicht so fest.",
                text: "Die Vier der Münzen ist bewahrte Sicherheit: sparen, schützen, Grenzen fest halten. Das ist vernünftig, bis zu einem gewissen Punkt. Der Punkt ist dort, wo es aufhört, Sicherheit zu sein, und anfängt, Angst zu sein. Behalt die Ersparnisse. Lockere den Griff.",
                keywords: ["Sicherheit", "Kontrolle", "Sparen"],
            },
            rev: {
                lede: "Der Griff lockert sich, freiwillig oder gezwungen.",
                text: "Umgekehrt ist das entweder zurückkehrende Großzügigkeit oder Geld, das dir entgleitet. Wenn du freier ausgibst, sorg dafür, dass es Absicht ist. Wenn du es verlierst, schau dir an, woran du dich geklammert hast und ob es den Griff je wert war.",
                keywords: ["Großzügigkeit", "Verlust", "Loslassen"],
            },
        },
        "pentacles-five": {
            name: "Fünf der Münzen",
            up: {
                lede: "Es ist kalt hier draußen, und hinter dir ist eine Tür.",
                text: "Die Fünf der Münzen ist Not: Geld knapp, Gesundheit angeschlagen, das Gefühl, draußen zu stehen. Die Karte zeigt aber auch Hilfe in der Nähe, um die du nicht gebeten hast. Stolz ist teuer. Klopf an die Tür.",
                keywords: ["Not", "Mangel", "Isolation"],
            },
            rev: {
                lede: "Das Schlimmste der mageren Zeit geht zu Ende.",
                text: "Umgekehrt ist das Erholung vom Mangel: Geld kommt zurück, die Gesundheit bessert sich, jemand lässt endlich Hilfe zu. Es geht langsam. Es ist echt. Gib den ersten guten Monat nicht aus, als hätte es die schlechten nie gegeben.",
                keywords: ["Erholung", "Hilfe kommt", "Neue Hoffnung"],
            },
        },
        "pentacles-six": {
            name: "Sechs der Münzen",
            up: {
                lede: "Gib oder nimm, und bleib dabei fair.",
                text: "Die Sechs der Münzen ist Großzügigkeit mit Ausgleich: ein Geschenk, ein Darlehen, ein Gefallen, eine Gehaltserhöhung. Jemand gibt und jemand empfängt, und die Karte verlangt, dass der Austausch ehrlich ist. Führ keine Strichliste, und tu nicht so, als würdest du keine führen.",
                keywords: ["Großzügigkeit", "Austausch", "Fairness"],
            },
            rev: {
                lede: "Das Geschenk hat einen Haken.",
                text: "Umgekehrt ist das Wohltätigkeit mit Widerhaken: Hilfe, die eine Schuld erzeugt, oder Großzügigkeit, die jemanden klein hält. Prüf die Bedingungen dessen, was du gibst oder nimmst. Echte Hilfe muss nicht in Erinnerung gerufen werden.",
                keywords: ["Mit Bedingungen", "Schuld", "Ungleichheit"],
            },
        },
        "pentacles-seven": {
            name: "Sieben der Münzen",
            up: {
                lede: "Es wächst, du kannst es nur noch nicht sehen.",
                text: "Die Arbeit, die du reingesteckt hast, ist von deinem Standpunkt aus nicht sichtbar. Diese Karte verlangt die Geduld eines Gärtners, nicht die Nervosität eines Spielers. Schau in einer Saison wieder nach.",
                keywords: ["Geduld", "Investition", "Langsames Wachstum"],
            },
            rev: {
                lede: "Du gießt etwas, das keine Früchte tragen wird.",
                text: "Umgekehrt ist das die Karte der versunkenen Kosten. Mühe ist nicht dasselbe wie Fortschritt. Schau ehrlich darauf, was du tatsächlich geerntet hast, und sei bereit, anderswo zu pflanzen.",
                keywords: ["Versunkene Kosten", "Neu bewerten", "Loslassen"],
            },
        },
        "pentacles-eight": {
            name: "Acht der Münzen",
            up: {
                lede: "Mach es noch einmal, ein bisschen besser.",
                text: "Die Acht der Münzen ist Handwerk: die unspektakuläre Wiederholung, die Können in Meisterschaft verwandelt. Keine Abkürzungen diese Woche. Investier die Stunden, achte auf die Details, und lass die Qualität später für sich sprechen.",
                keywords: ["Handwerk", "Fleiß", "Meisterschaft"],
            },
            rev: {
                lede: "Dienst nach Vorschrift.",
                text: "Umgekehrt ist die Arbeit mechanisch oder nachlässig geworden, oder du schuftest an etwas, an das du nicht mehr glaubst. Auch Perfektionismus kann so aussehen. Frag dich, ob die Mühe noch einen Sinn hat. Wenn nicht, lenk sie um.",
                keywords: ["Nachlässigkeit", "Burnout", "Sinnlose Mühe"],
            },
        },
        "pentacles-nine": {
            name: "Neun der Münzen",
            up: {
                lede: "Du hast das aufgebaut, und du darfst es allein genießen.",
                text: "Die Neun der Münzen ist verdiente Unabhängigkeit: Komfort, Sicherheit und Geschmack, alles aus eigener Kraft. Genieß es ohne Entschuldigung. Du brauchst weder Partner noch Erlaubnisschein, um so zufrieden zu sein. Kauf den guten Wein.",
                keywords: ["Unabhängigkeit", "Luxus", "Selbstständigkeit"],
            },
            rev: {
                lede: "Die Unabhängigkeit hat mehr gekostet, als sie gebracht hat.",
                text: "Umgekehrt ist das Komfort ohne Gesellschaft oder Geldausgeben, um sich etwas wert zu fühlen. Der Garten ist schön und leer. Lass jemanden herein, oder gib weniger für Dinge aus und mehr für Nachmittage. Sicherheit ist nicht dasselbe wie ein Leben.",
                keywords: ["Einsamkeit", "Zu viel ausgeben", "Leerer Erfolg"],
            },
        },
        "pentacles-ten": {
            name: "Zehn der Münzen",
            up: {
                lede: "Denk in Generationen, nicht in Wochenenden.",
                text: "Die Zehn der Münzen ist Vermächtnis: Wohlstand, der bleibt, Familie, die zusammenhält, ein Fundament, auf dem andere stehen werden. Entscheide mit dem langen Blick. Was du jetzt aufbaust, überdauert den Moment, also bau es richtig auf.",
                keywords: ["Vermächtnis", "Wohlstand", "Familie"],
            },
            rev: {
                lede: "Das Familienvermögen ist ein Familienstreit.",
                text: "Umgekehrt ist das Ärger ums Erbe, Geld, das eine Familie belastet, oder eine Tradition, die zur Last geworden ist. Die Stabilität, die alle vorausgesetzt haben, wird geprüft. Sprecht offen darüber, bevor es die Anwälte tun müssen.",
                keywords: ["Familienkonflikt", "Instabilität", "Verlust"],
            },
        },
        "pentacles-page": {
            name: "Bube der Münzen",
            up: {
                lede: "Lern es richtig. Du hast Zeit.",
                text: "Der Bube der Münzen ist der Lernende: eine neue Fähigkeit, ein Kurs, ein erster Job, ein Ehrgeiz, der noch Form annimmt. Sei Anfänger, ohne dich zu schämen. Fleiß schlägt hier Talent, und den Fleiß hast du.",
                keywords: ["Lernen", "Ehrgeiz", "Neue Fähigkeit"],
            },
            rev: {
                lede: "Abgelenkt, und du nennst es Recherche.",
                text: "Umgekehrt hat der Bube den Fokus verloren: Aufschieberei, ein Plan ohne ersten Schritt, Lernen als Methode, nie anzufangen. Wähl eine praktische Aufgabe und bring sie heute zu Ende. Schwung wird aufgebaut, nicht gefunden.",
                keywords: ["Aufschieben", "Mangelnder Fokus", "Unrealistisch"],
            },
        },
        "pentacles-knight": {
            name: "Ritter der Münzen",
            up: {
                lede: "Langsam, stetig und nicht aufzuhalten.",
                text: "Der Ritter der Münzen ist der Verlässliche: methodisch, unspektakulär und immer da, wenn die Frist kommt. Sei diese Woche wie er. Nicht schnell, nicht clever. Anwesend, jeden Tag, bis es erledigt ist.",
                keywords: ["Verlässlichkeit", "Routine", "Harte Arbeit"],
            },
            rev: {
                lede: "Im Trott festgefahren und es Disziplin nennen.",
                text: "Umgekehrt ist der Ritter Routine, die zur Trägheit geworden ist: Langeweile, Sturheit, es immer gleich machen, weil man es eben so macht. Ändere eine Variable. Die Verlässlichkeit darf bleiben, der Trott nicht.",
                keywords: ["Langeweile", "Sturheit", "Stillstand"],
            },
        },
        "pentacles-queen": {
            name: "Königin der Münzen",
            up: {
                lede: "Mach es gemütlich, und mach, dass es funktioniert.",
                text: "Die Königin der Münzen ist praktische Fürsorge: das Zuhause, das läuft, das Geld, das verwaltet wird, der Mensch, der alle satt macht und trotzdem die Bücher ausgleicht. Worum es in deiner Frage auch ging, die Antwort ist geerdet. Kümmere dich gut um die Grundlagen.",
                keywords: ["Fürsorge", "Praktischer Sinn", "Sicherheit"],
            },
            rev: {
                lede: "Alle sind versorgt, nur du nicht.",
                text: "Umgekehrt hat die Königin so viel gegeben, dass der Haushalt auf ihren letzten Reserven läuft. Oder das Gleichgewicht ist in die andere Richtung gekippt, in Materialismus und Kontrolle. Setz deinen eigenen Namen auf die Liste der Menschen, um die du dich kümmerst.",
                keywords: [
                    "Selbstvernachlässigung",
                    "Ungleichgewicht",
                    "Materialismus",
                ],
            },
        },
        "pentacles-king": {
            name: "König der Münzen",
            up: {
                lede: "Du bist angekommen. Verwalte es gut.",
                text: "Der König der Münzen ist Erfolg, der sich gesetzt hat: Wohlstand, Stabilität, die Autorität, die daraus kommt, etwas Echtes aufgebaut zu haben. Handle mit diesem Selbstvertrauen. Investiere, sorge vor und sei großzügig auf eine Art, die bleibt.",
                keywords: ["Erfolg", "Stabilität", "Fülle"],
            },
            rev: {
                lede: "Wohlstand ist die ganze Identität geworden.",
                text: "Umgekehrt ist der König Gier, Sturheit oder ein Status, der um jeden Preis verteidigt werden muss. Geld ist ein Werkzeug, und er hat einen Thron daraus gemacht. Frag dich, wer du ohne es wärst. Dann geh und sei ein Stück davon.",
                keywords: ["Gier", "Materialismus", "Starrheit"],
            },
        },
    },

    spreads: {
        [TarotSpreads.SINGLE]: {
            label: "Eine Karte",
            headline: "Eine Karte für heute.",
            subline:
                "Eine einzelne Karte zum Nachspüren. Komm morgen wieder für die nächste.",
            positions: ["Deine Karte"],
        },
        [TarotSpreads.THREE]: {
            label: "Drei Karten",
            headline: "Drei Karten, ein roter Faden.",
            subline:
                "Vergangenheit, Gegenwart und was folgt, zusammen gelesen statt einzeln.",
            positions: ["Vergangenheit", "Gegenwart", "Was folgt"],
        },
        [TarotSpreads.YES_NO]: {
            label: "Ja / Nein",
            headline: "Frag klar und deck eine Karte auf.",
            subline:
                "Die Karte beantwortet die Frage, die du wirklich gestellt hast, nicht die, auf die du gehofft hast.",
            positions: ["Deine Frage"],
        },
    },

    orientation: { upright: "Aufrecht", reversed: "Umgekehrt" },

    verdict: {
        yes: {
            title: "Ja",
            line: "Die Karte kam aufrecht und eindeutig. Leg los, und verbring die Woche nicht damit, eine zweite Meinung zu suchen.",
        },
        notYet: {
            title: "Noch nicht",
            line: "Die Karte kam umgekehrt. Die Antwort ist nicht Nein. Die Bedingungen sind nur noch nicht gegeben. Frag noch einmal, wenn sich eine davon ändert.",
        },
    },

    prompt: "Halte eine Frage im Kopf und deck dann eine Karte auf. Nichts wird gedeutet, bevor du sie berührst.",
    shuffle: "Neu mischen und legen",
}

export default de
