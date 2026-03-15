import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.1.0/dist/fuse.mjs'
import { saveSessionStorage } from './util.js';




export default class Search {

    constructor(start_screen, data) {
        this.start_screen = start_screen;
        this.input = document.getElementById("search_value");
        this.data = data;

        console.log(data);
    }

    init(){


        this.engine = new Fuse(
            this.data, 
            { 
                keys: [
                "story", 
                "director.name", 
                "tags.name",
                "title",
                "rating",
                "year"
            ],
                threshold: 0.3,        // wie unscharf die Suche ist
                ignoreLocation: true,
                minMatchCharLength: 1,
                useExtendedSearch: true,
        });

        const tag_search_value = window.sessionStorage.getItem("search_value");
        console.log("Search Value", tag_search_value);


        if(tag_search_value) {
            const res = this.engine.search(tag_search_value);
            const items = res.map(e => e.item); 

            console.log(res);

            this.start_screen.changeData(items);
        }


        this.input.addEventListener("input", (e) => {

            const isEmpty = e.target.value.trim().length == 0;


            if(!isEmpty) {
                const res = this.engine.search(e.target.value);
                const items = res.map(e => e.item); 
                console.log("i", items);

                saveSessionStorage("search_value", e.target.value);


                this.start_screen.changeData(items);

            }
             else {
                this.start_screen.changeData(this.data);
            }

            
        });

    }


}

