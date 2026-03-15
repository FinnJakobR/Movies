import { DUMMY_DATA, getAllImages } from "./data.js";
import DetailScene from "./detail_scene.js";
import StartScene from "./start_scene.js";
import Transition from "./transition.js";
import * as THREE from "three";
import { deleteSessionStorage, download_image, getSafeAreaInsets, readFile } from "./util.js";
import Search from "./search.js";
import { getFilms } from "./api.js";
import Markdown, { renderHTML } from "./md.js";




async function downloadImages(images) {

    const downloadedImages = [];
    const imageTextures = [];
    for(const img of images){
        const downloadedImage = await download_image(img);
        downloadedImages.push(downloadedImage);
        
        const imageTex = new THREE.Texture(downloadedImage);

        imageTextures.push(imageTex);
    }

    return {downloadedImages, imageTextures};
}




async function main() {

const FILMS = await getFilms();

const IMAGES = getAllImages(FILMS);

for(const f of FILMS) {

    const article = await readFile(f.article);
    f.article = article;
}



//fix for iphone ios26

const landingDom = document.getElementById("landing");
const landingTop = landingDom.getBoundingClientRect().top;


if(landingTop < 0) {
    landingDom.style.top = "40px";
}


const article = await readFile("articles/housemaid.txt");

const md = new Markdown(article);

const parsed_md = md.parse();


console.log(renderHTML(parsed_md));





const {downloadedImages, imageTextures} = await downloadImages(IMAGES);

const detailScene = new DetailScene(IMAGES, FILMS, downloadedImages, imageTextures);
const startScene = new StartScene(IMAGES, FILMS, downloadedImages, imageTextures) ;
const transition = new Transition(startScene, detailScene);

const search = new Search(startScene, JSON.parse(JSON.stringify(DUMMY_DATA)));
startScene.setTransition(transition);
search.init();



}


main();


