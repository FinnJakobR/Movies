import CustomAnimation, { ANIMATION_TYPE } from "./animation.js";
import * as THREE from "three";
import { changeDetailScreenData, cutTextAtNearestSentence, formateDate } from "./util.js";

export default class Transition {
    constructor(start_scene, detail_scene) {
        this.start_scene = start_scene;
        this.detail_scene = detail_scene;
    }

    async toDetail(clicked_index, clickedItem) {   
        
        const item = clickedItem;

        const data = this.start_scene.films[clicked_index];

        


        changeDetailScreenData(data);

        item.getElementsByTagName("sup")[0].style.display = "none";


        let currentPos = new THREE.Vector2(item.getBoundingClientRect().left, item.getBoundingClientRect().top);
        
        Array.from(document.getElementsByClassName("film_name"))
        .filter((e,i)  => i != clicked_index)
        .forEach((e) => e.style.display = "none");

        const title_animation = new CustomAnimation(ANIMATION_TYPE.EASE_OUT, currentPos.y, 200);
        const image_animation = new CustomAnimation(ANIMATION_TYPE.LINEAR, 0, 500);

        const title = item.getElementsByTagName("span")[0].textContent;


        await title_animation.animateTo((val) => {
            item.style.transform = `translateY(${val}px)`;
        }, 0);

        item.id = "title";

        await image_animation.animateTo(
        (val) => {
            this.start_scene.uniforms.progress.value = val;
            this.start_scene.uniforms.transition.value = true;
            }, 
        1);

        this.start_scene.uniforms.progress.value = 0;
        this.start_scene.uniforms.transition.value = false; //End Callback

        this.start_scene.stopRendering(); //set display none and stop rendering!
        item.id = "";
        this.detail_scene.setTitle(title);
        this.detail_scene.startRendering();
        
        const img_index = clicked_index;
        const img_path = this.start_scene.current_image_path;
        const img = this.start_scene.downloadedImages[img_index];

        console.log(this.start_scene.allImages, clickedItem, this.start_scene.current_image_path);

        const globalIndex = this.start_scene.allImages.indexOf(img_path);



        this.detail_scene.setCurrentImage(img_path, img);

        this.detail_scene.setFilm(globalIndex);
    


    }
}