

export class Director {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }
}

export class Tag {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }
}


export default class FilmShortData {
    constructor(img, title, rating, release_date, story, duration, director, tags, articleTitle, article){
        this.img = img;
        this.title = title;
        this.rating = rating;
        this.release = release_date;
        this.story = story;
        this.duration = duration;
        this.year = this.release.getFullYear();
        this.director = director;
        this.tags = tags;
        this.articleTitle = articleTitle;
        this.article = article
    }
}


export function getAllFilmNames(films){
    return films.map((e) => e.title);
}

export function getAllImages(films) {
    return films.map((e) => e.img);
}

export function getAllFilmRatings(films) {
    return films.map((e) => e.rating);
}
 

export const DUMMY_DATA = [

    new FilmShortData(
        "assets/housemaid.jpg",
        "Housemaid",
        "7",
        new Date('2026-01-15T00:00:00Z'),
        "Nicht jeder Neuanfang bietet eine zweite Chance. Die 27-jährige Millie hofft nach der Entlassung aus dem Gefängnis als Hausmädchen bei einem wohlhabenden Ehepaar neu anzufangen. Doch schon bald merkt sie, dass sich hinter der Fassade aus Luxus und Eleganz eine dunkle Wahrheit verbirgt, die weitaus gefährlicher ist als ihre eigene. Ein verführerisches Spiel um Geheimnisse, Skandale und Macht beginnt",
        "02:11:00",
        new Director(
            "Paul Feig",
            "d5d40f10-c60e-4e97-9aca-32a3da9c038e",
        ),
        [
        new Tag(
            "Sidney Sweeney",
            "a56891be-3fe3-43c9-b18b-68aaba86b9d7"
        ),

    
        new Tag(
            "Mistery",
            "bac9357e-5e61-44b7-8833-1050cd55f306"
        ),

            new Tag(
            "based on a Book",
            "f93626f7-139f-4a0a-bd64-c5284a1af023"
        ),
        ],
        "Eine Adaption des American Psycho.",
        `articles/housemaid.txt`

        
    )

]
//     new FilmShortData(
//         "assets/housemade.jpg",
//         "Bugonia",
//         4.0,
//         new Date(),
//         "In einer nahen Zukunft, ist The Running Man die meistgesehene Show im Fernsehen. Ein tödlicher Wettbewerb, in dem die Mitspieler, die man Runner nennt, 30 Tage lang überleben müssen, während sie von Profikillern gejagt werden. Dabei wird jede ihrer Bewegungen einem blutrünstigen Publikum live übertragen. Jeder Tag, den sie durchhalten, wird mit mehr Geld belohnt. Ben Richards stammt aus der Arbeiterklasse und versucht verzweifelt, seine kranke Tochter zu retten. Daher lässt er sich von Dan Killian, dem charmanten, aber rücksichtslosen Produzenten der Show, als letzte Hoffnung überreden, bei dem Spiel mitzumachen. Bens Trotz, Instinkte und Mut machen ihn bald unerwartet zum Fan-Favoriten – und zu einer Bedrohung für das gesamte System. Während die Einschaltquoten durch die Decke gehen, steigt auch die Gefahr und Ben muss nicht nur die Jäger überlisten, sondern auch eine ganze Nation, die süchtig danach ist, ihn scheitern zu sehen.",
//         "00:00:40",
//         new Director(
//             "Mister Cool",
//             "fsdlkfjhsdf-dfsfjksdkjhfkjsdh-adklw2e2jkwahwsjkfsh22421"
//         ),
//         [
//             new Tag(
//                 "Stephan King", 
//                 "dlöfskfdf-kajsljaslkjsfslkjsaf"
//             )
//         ]
//     ),


//       new FilmShortData(
//         "assets/bugonia2.jpg",
//         "Hamnet",
//         8,
//         new Date(),
//         "Nach dem verheerenden Krieg gegen die RDA und dem Verlust ihres ältesten Sohnes sehen sich Jake Sully und Neytiri mit einer neuen Bedrohung auf Pandora konfrontiert: dem Aschvolk, einem gewalttätigen und machthungrigen Na'vi-Stamm unter der Führung des skrupellosen Varang. Jakes Familie muss in einem Konflikt, der sie an ihre emotionalen und physischen Grenzen bringt, um ihr Überleben und die Zukunft von Pandora kämpfen. *Der Film enthält Sequenzen, die sich auf photosensitive Menschen oder Menschen mit photosensitiver Epilepsie auswirken könnten.",
//         "00:00:40",
//         new Director(
//             "James Cameron",
//             "fsdlkfjhsdf-dfsfjksdkjhfkjsdh-adklw2e2jkwahwsjkfsh22421"
//         ),
//         [
//             new Tag(
//                 "Action", 
//                 "dlöfskfdf-kajsljaslkjsfslkjsaf"
//             )
//         ]
//     ),

//     new FilmShortData(
//         "assets/running_man2.jpg",
//         "The Running Man",
//         8,
//         new Date(),
//         "Nach dem verheerenden Krieg gegen die RDA und dem Verlust ihres ältesten Sohnes sehen sich Jake Sully und Neytiri mit einer neuen Bedrohung auf Pandora konfrontiert: dem Aschvolk, einem gewalttätigen und machthungrigen Na'vi-Stamm unter der Führung des skrupellosen Varang. Jakes Familie muss in einem Konflikt, der sie an ihre emotionalen und physischen Grenzen bringt, um ihr Überleben und die Zukunft von Pandora kämpfen. *Der Film enthält Sequenzen, die sich auf photosensitive Menschen oder Menschen mit photosensitiver Epilepsie auswirken könnten.",
//         "00:00:40",
//         new Director(
//             "Glen Powell",
//             "fsdlkfjhsdf-dfsfjksdkjhfkjsdh-adklw2e2jkwahwsjkfsh22421"
//         ),
//         [
//             new Tag(
//                 "Action", 
//                 "dlöfskfdf-kajsljaslkjsfslkjsaf"
//             )
//         ]
//     ),


//        new FilmShortData(
//         "assets/oBaA.jpg",
//         "One Battle After Another",
//         8,
//         new Date(),
//         "Nach dem verheerenden Krieg gegen die RDA und dem Verlust ihres ältesten Sohnes sehen sich Jake Sully und Neytiri mit einer neuen Bedrohung auf Pandora konfrontiert: dem Aschvolk, einem gewalttätigen und machthungrigen Na'vi-Stamm unter der Führung des skrupellosen Varang. Jakes Familie muss in einem Konflikt, der sie an ihre emotionalen und physischen Grenzen bringt, um ihr Überleben und die Zukunft von Pandora kämpfen. *Der Film enthält Sequenzen, die sich auf photosensitive Menschen oder Menschen mit photosensitiver Epilepsie auswirken könnten.",
//         "00:00:40",
//         new Director(
//             "Glen Powell",
//             "fsdlkfjhsdf-dfsfjksdkjhfkjsdh-adklw2e2jkwahwsjkfsh22421"
//         ),
//         [
//             new Tag(
//                 "Action", 
//                 "dlöfskfdf-kajsljaslkjsfslkjsaf"
//             )
//         ]
//     ),

//        new FilmShortData(
//         "assets/marty.jpg",
//         "Marty Supreme",
//         8,
//         new Date(),
//         "Nach dem verheerenden Krieg gegen die RDA und dem Verlust ihres ältesten Sohnes sehen sich Jake Sully und Neytiri mit einer neuen Bedrohung auf Pandora konfrontiert: dem Aschvolk, einem gewalttätigen und machthungrigen Na'vi-Stamm unter der Führung des skrupellosen Varang. Jakes Familie muss in einem Konflikt, der sie an ihre emotionalen und physischen Grenzen bringt, um ihr Überleben und die Zukunft von Pandora kämpfen. *Der Film enthält Sequenzen, die sich auf photosensitive Menschen oder Menschen mit photosensitiver Epilepsie auswirken könnten.",
//         "00:00:40",
//         new Director(
//             "Glen Powell",
//             "fsdlkfjhsdf-dfsfjksdkjhfkjsdh-adklw2e2jkwahwsjkfsh22421"
//         ),
//         [
//             new Tag(
//                 "Action", 
//                 "dlöfskfdf-kajsljaslkjsfslkjsaf"
//             )
//         ]
//     )
// ];


