import * as THREE from "three";
import { parseShaderFile } from "./shader.js";
import { deleteSessionStorage, download_image, getSafeAreaInsets, getSmallRotation, isMobile } from "./util.js";
import { getAllFilmNames, getAllFilmRatings, getAllImages } from "./data.js";
import Search from "./search.js";


export default class StartScene {

    constructor(images, films, downloadedImages, imageTextures){
        this.images = images;
        this.allImages = images;
        this.films = films;
        this.isRendering = true;
        this.scene = new THREE.Scene(); 
        this.fragmentShaderPath = "shaders/start_page/frag.glsl";
        this.vertexShaderPath = "shaders/start_page/vert.glsl";
        this.clock = new THREE.Clock();
        this.node = document.getElementById("landing");
        this.film_names_node = document.getElementById("film_names");    
        this.animate = false;
        this.currentRotation = 0;
        this.animationDurationMs = 0.6;
        this.isSearching = false;
        
        this.allFilms = this.films;
        this.allImagesTextures = imageTextures;
        this.imageTextures = imageTextures;
        this.imagePaths = [];
        this.allDownloadedImages = downloadedImages;
        this.downloadedImages = downloadedImages; 

        this.safeSize = getSafeAreaInsets();


        
        this.setup();
        this.currentHoveredFilm = 0;
        
        this.uniforms = {
            image: {
                value: null
            },
            resolution: {
                value: new THREE.Vector2(0,0)
            },

            time: {
                value: 0.0
            },

            noiseOffset: {
              value: new THREE.Vector2(0,0)  
            },

            brightness: {
                value: 0.6
            },

            grayscale: {
                value: 1.0
            },

            transition : {
                value: false
            },

            progress: {
                value: 0.0
            },

            hovered: {
                value: true
            }
        }

    }

    stopRendering(){
        this.isRendering = false;
        this.node.style.display = "none";
        document.getElementById("start_background").style.display = "none";
    }

    startRendering(){
        this.isRendering = true;
        this.node.style.display = "block";
        document.getElementById("start_background").style.display = "block";
    }

    changeData(newData) {

        console.log("n",newData);
        this.films = newData;
        this.generateHTML();
        const imagesPaths = getAllImages(this.films);
        const allImagesPaths = getAllImages(this.allFilms);
        this.downloadedImages = [];
        this.imageTextures = [];
        this.images = imagesPaths;



        for(const imagesPath of imagesPaths) {
            const index = allImagesPaths.indexOf(imagesPath);


            this.downloadedImages.push(this.allDownloadedImages[index]);
            this.imageTextures.push(this.allImagesTextures[index]);
        }





        this.setupScrolling();
        this.setupHovering();
        this.setupClick();
    }


    generateHTML() {

        if(this.film_names_node.childNodes.length > 0) {
            const nameNodes = Array.from(this.film_names_node.childNodes);
            for(const nameNode of nameNodes) {
                nameNode.remove();
            }
        }

        const film_names = getAllFilmNames(this.films);
        const rating = getAllFilmRatings(this.films);
    
        for(const name of film_names) {
            
            const div = document.createElement("div");
            const span = document.createElement("span");
            const sup = document.createElement("sup");
            const year = document.createElement("span");
            const name_container = document.createElement("div");

            span.innerHTML = name;
            sup.innerHTML = rating[film_names.indexOf(name)];
            year.innerHTML = "2025";

            name_container.appendChild(span);
            name_container.appendChild(sup);

            div.appendChild(name_container);
            div.appendChild(year);


            div.classList.add("film_name");
            this.film_names_node.appendChild(div);
        }


    }

    async setup(){

        this.generateHTML();

        this.setupScrolling();
        this.setupHovering();
        this.setupClick();

        await this.setupScene();

       
        await this.changeImage(0);

         if(isMobile()) {
            this.mobile_background_intervall = this.startAnimateSearchBackground(600);
        }

        if(!isMobile()) {
            this.setupSearchHovering();
        } else {
            this.setupMobileSearch();
        }


        document.getElementById("loading").style.display = "none";
    }


    calculateContainerHeight(){
        const items = document.getElementsByClassName("film_name");

        this.containerHeight = Array.from(items).reduce(
            (acc, item) => acc + item.offsetHeight,
            0
        );

    };

    setupClick() {
        const items = Array.from(document.getElementsByClassName("film_name"));


        for(let i = 0; i < items.length; i++) {
            const currentItem = items[i];

            currentItem.addEventListener("click", async ()=> {

                const globalIndex = this.allFilms.findIndex((e) => e.title === currentItem.children[0].children[0].innerText);


                this.currentClickedFilm = globalIndex % this.images.length;
            
                this.isClicked = true;

                this.animateSearchBar(-1);

                if(isMobile()) {
                    this.stopAnimateSearchBackground(this.mobile_background_intervall);
                    await this.changeImage(i);
                }

                if(this.transition) {
                    setTimeout(async () => {
                    deleteSessionStorage("search_value");
                    await this.transition.toDetail(i, currentItem);
                    
                },50)
                }

            });
        }
    }


 animateSearchBar(direction) {

    const heightOfFilmName = document.getElementsByClassName("film_name")[0].getBoundingClientRect().height;

    document.getElementById("search").style.height = heightOfFilmName + "px";


    if(direction == 1) {
        gsap.to("#search", 0.5, { y: 0, ease: 'Expo.easeOut'});
        gsap.to("#film_names", 0.5, { y: heightOfFilmName, ease: 'Expo.easeOut'})    
    } else {
         gsap.to("#search", 0.5, { y: -heightOfFilmName, ease: 'Expo.easeOut'});
         gsap.to("#film_names", 0.5, { y: 0, ease: 'Expo.easeOut'})    
    }
 }


 setupMobileSearch(){

    let intervallId = this.mobile_background_intervall;

    const heightOfFilmName = document.getElementsByClassName("film_name")[0].getBoundingClientRect().height;

    const start_value = window.sessionStorage.getItem("search_value");


    document.getElementById("search").style.transform = `translateY(-${heightOfFilmName}px)`;

    //auf handy zeigen wir die immer an die Searchbar!


    if(start_value  && start_value.length > 0) {
        document.getElementById("search_value").value = start_value;
    }

    document.getElementById("search_value").addEventListener("input", async () => {

        if(this.films.length > 1) {
            if(!intervallId) {
                intervallId = this.mobile_background_intervall = this.startAnimateSearchBackground(600);
            }
        } else if(this.films.length == 1) {

             if(intervallId) {
                this.stopAnimateSearchBackground(intervallId);
                intervallId = null;
                this.mobile_background_intervall = null;
             }


             console.log(this.currentImageTexture != this.imageTextures[0]); 

             if(this.currentImageTexture != this.imageTextures[0]) {
                 this.changeImage(0);
             }

        } else  {
            //films == 0;

            if(intervallId) {
                this.stopAnimateSearchBackground(intervallId);
                intervallId = null;
                this.mobile_background_intervall = null;
            }

            this.changeToDefaultBackground();

        }

    })

    document.getElementById("search_value").addEventListener("focus", () => {

        console.log(this.mobile_background_intervall);

        if(document.getElementById("search_value").value.trim().length == 0) {
            this.stopAnimateSearchBackground(intervallId);
            this.changeToDefaultBackground();
            intervallId = null;
        }

        console.log("focus!");


    });


    document.getElementById("search_value").addEventListener("focusout", ()=>{
        console.log("unfocus!");
        
        if(!intervallId)
        this.mobile_background_intervall = intervallId = this.startAnimateSearchBackground(600);

    });



    this.animateSearchBar(1);
 }


 setupSearchHovering(){

    const heightOfFilmName = document.getElementsByClassName("film_name")[0].getBoundingClientRect().height;

    let intervallId;

    let isHover = false;

    const start_value = window.sessionStorage.getItem("search_value");
    
    //delete es wieder!     

    console.log("s",start_value);


    if(start_value  && start_value.length > 0) {
        document.getElementById("search_value").value = start_value;
        this.animateSearchBar(1);
    }

    document.getElementById("search").style.transform = `translateY(-${heightOfFilmName}px)`;

    document.getElementById("search_value").addEventListener("input", async (e) => {

        if(this.films.length > 1) {

            if(!intervallId) {
                intervallId = this.startAnimateSearchBackground(600);
                
            }
        }

        if(this.films.length == 1) {
            if(intervallId) {
                this.stopAnimateSearchBackground(intervallId);
                intervallId = null
            }



             if(this.currentImageTexture != this.imageTextures[0]) {
                await this.changeImage(0);

             }
             


        }

        if(this.films.length == 0) {

            if(intervallId) {
                this.stopAnimateSearchBackground(intervallId);
                intervallId = null;
            }

            this.changeToDefaultBackground();

        }
        
    });



    document.getElementById("landing").addEventListener("mousemove", async (e) => {

        if(this.currentHoveredFilm <= 0) {
            const y = e.clientY;
            const film_y = document.getElementsByClassName("film_name")[0].getBoundingClientRect().top;

            const hover_limit = (film_y + heightOfFilmName) / 2;

            if(y > hover_limit) this.isSearching = false;

            if(y <= hover_limit) {
                this.animateSearchBar(1);
                this.isSearching = true;


                if(!isHover) {
                    
                    if(document.getElementById("search_value").value.trim().length > 0) {
                        
                        if(this.films.length == 1) {
                            await this.changeImage(0);
                        } 

                        if(this.films.length > 1) {

                            if(!intervallId) {
                                intervallId = this.startAnimateSearchBackground(600);
                            }

                        }

                    } else {
                        this.changeToDefaultBackground();
                    }

                    isHover = true;
                }

            }else if(!document.getElementById("search_value").value.trim()) {
                this.animateSearchBar(-1);
                this.stopAnimateSearchBackground(intervallId);
                intervallId = null;
                isHover = false;
            } else if(document.getElementById("search_value").value.trim()) {
                 this.stopAnimateSearchBackground(intervallId);
                intervallId = null;
                isHover = false;
            }
        }
    });
}


stopAnimateSearchBackground(id) {
    clearInterval(id);
}

startAnimateSearchBackground(intervall){
        
    this.currentHoveredFilm = 0;
    let i = this.currentHoveredFilm;

    
    const searchBackgroundTimeOutId = setInterval(() => {


        if(this.images.length > 1) {
            i = Math.min((i  + 1) % this.images.length);
            this.changeImage(i);
        }
        
    }, intervall);

    return searchBackgroundTimeOutId;

}


changeToDefaultBackground(){
    console.log("change to default!");
    this.changeImage(-1);
}


setupHovering() {



    const items = Array.from(document.getElementsByClassName("film_name"));

    for(const film_index in items) {

        const currentItem = items[film_index];

        currentItem.addEventListener("mouseenter", () => {

            //if(this.currentHoveredFilm  == film_index) return;
            
            this.currentHoveredFilm = film_index % this.images.length;

            console.log(this.currentHoveredFilm);
            
            this.changeImage(this.currentHoveredFilm);        
        });

        currentItem.addEventListener("mouseleave", () => {
            if(this.isClicked) {
                this.isClicked = false;
                return;

            }
            this.currentHoveredFilm = -1;

            if(!this.isSearching) {
                this.changeToDefaultBackground();
            }

        });

    }
}

    async changeImage(index){

        if(index < 0) {
            this.uniforms.hovered.value = false;
            this.current_image_path = "";
            this.current_image = null;
            this.currentImageTexture = "";
            return;
        }
        


        this.uniforms.hovered.value = true;

        this.current_image_path = this.images[index];
        this.current_image = this.downloadedImages[index];
        this.currentImageTexture = this.imageTextures[index];
        this.currentImageTexture.needsUpdate = true;

        this.currentIndex = index;



        
        this.background.geometry.dispose();
        const newSize = this.calculateImageScale();
        this.background.geometry = new THREE.PlaneGeometry(newSize.width, newSize.height);
        this.background.geometry.needsUpdate = true; 
        this.uniforms.image.value =  this.currentImageTexture;
        
        this.animate = true;
        this.currentAnimateTime = 0;
        
        const rot = getSmallRotation();
        const scale =  1.4;
        this.startRotation = rot;
        this.currentRotation = rot;
        this.currentScale = scale;
        this.startScale = scale;

        this.animateStartTime = this.clock.getElapsedTime();
        this.animateTimeStamp = this.clock.getElapsedTime();
    }


setupScrolling() {
        this.viewPortHeight = window.visualViewport ? window.visualViewport.height +(this.safeSize.top + this.safeSize.bottom) : window.innerHeight +(this.safeSize.top + this.safeSize.bottom);
        this.calculateContainerHeight(); // TODO call on rezise 

        this.currentY = 0;
        this.targetY = 0;

        const margin = 100;

        const animate = () => {
            // LERP 
            this.currentY += (this.targetY - this.currentY) * 0.08;

            this.node.style.transform = `translateY(${this.currentY}px)`;
            requestAnimationFrame(animate);
        };

        animate();

        this.node.addEventListener("mousemove", (e) => {
            if (this.containerHeight <= this.viewPortHeight || !this.isRendering) return;

            const mouseYPercent = e.clientY / this.viewPortHeight;

            const translateYAtTop = margin;
            const translateYAtBottom =
                this.viewPortHeight - this.containerHeight - margin;

            this.targetY =
                translateYAtTop +
                mouseYPercent * (translateYAtBottom - translateYAtTop);
        });
    }

    async setupScene() {
        this.fragmentShader = (await parseShaderFile(this.fragmentShaderPath)).shader;
        this.vertexShader = (await parseShaderFile(this.vertexShaderPath)).shader;

        const w = window.innerWidth;
        const h = window.visualViewport ? window.visualViewport.height +(this.safeSize.top + this.safeSize.bottom) : window.innerHeight +(this.safeSize.top + this.safeSize.bottom);
        this.camera = new THREE.OrthographicCamera(
            -w / 2,
            w / 2,
            h / 2, 
            -h / 2, 
            -10, 
            10
        );

        this.renderer = new THREE.WebGLRenderer({antialias: false});
        this.renderer.setSize(w,h);

        this.renderer.domElement.id = "start_background";
        document.body.appendChild(this.renderer.domElement);
        const geometry = new THREE.PlaneGeometry(w,h);
        
        const material = new THREE.ShaderMaterial({
            fragmentShader: this.fragmentShader, 
            vertexShader: this.vertexShader,
            uniforms: this.uniforms,
            transparent: true
        });

        this.background = new THREE.Mesh(geometry, material);
        this.scene.add(this.background);
        this.renderer.render(this.scene, this.camera);
        this.renderer.setAnimationLoop(this.animateBackground.bind(this));
        this.setupResponsives();
    
    }

    setupResponsives() {
        window.visualViewport.addEventListener("resize", () => {

            if(!this.isRendering) return;
            
            const w = window.innerWidth;
            const h =   window.visualViewport ? window.visualViewport.height+(this.safeSize.top + this.safeSize.bottom) : window.innerHeight +(this.safeSize.top + this.safeSize.bottom);

            this.background.geometry.dispose();
            const newSize = this.calculateImageScale();

            this.background.geometry = new THREE.PlaneGeometry(newSize.width, newSize.height);
            this.background.material.uniforms.resolution.value = new THREE.Vector2(newSize.width, newSize.height);

            this.camera.left = -w / 2;
            this.camera.right = w / 2;
            this.camera.top = h / 2;
            this.camera.bottom = -h / 2; //dieses - hat mir 3 std debugging gekostet 
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(w, h);
            if(this.isRendering) this.renderer.render(this.scene, this.camera);

            this.calculateContainerHeight();
        })


    }

    animateBackground(){

    const t = this.clock.getElapsedTime();
    this.uniforms.noiseOffset.value = new THREE.Vector2(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02
            );

    this.uniforms.brightness.value = 0.6 + Math.sin(t * 2.0) * 0.02;
    this.uniforms.time.value = t;


    if (this.animate) {

    this.animateTimeStamp = this.clock.getElapsedTime();

    const elapsed = this.animateTimeStamp - this.animateStartTime;
    const time = Math.min(elapsed / this.animationDurationMs, 1);

    const easedT = 1 - Math.pow(1 - time, 2);

    this.currentRotation = this.startRotation * (1 - easedT);
    this.currentScale = this.startScale + easedT* (1.0 - this.startScale);

    this.background.rotation.set(0,0,this.currentRotation);
    this.background.scale.setScalar(this.currentScale);

        if (time >= 1) {
            this.animate = false;
            this.currentRotation = 0;
            this.currentScale = 0;
        }

    }


    if(this.isRendering) this.renderer.render(this.scene, this.camera);

    }

    setTransition(transition) {
        this.transition = transition;
    }

    
 calculateImageScale() { 

    if(!this.current_image) {
        return {width: window.innerWidth, height: window.visualViewport ? window.visualViewport.height +(this.safeSize.top + this.safeSize.bottom) : window.innerHeight +(this.safeSize.top + this.safeSize.bottom)
            
        };
    }

    const img = this.current_image;
    const imgRatio = this.current_image.width / this.current_image.height;
    const w = window.innerWidth;
    const h = window.visualViewport ? window.visualViewport.height+ (this.safeSize.top + this.safeSize.bottom) : window.innerHeight +(this.safeSize.top + this.safeSize.bottom);

    const widthRatio =  w / img.width;
    const heightRatio = ( w / imgRatio) / img.height;
   
    const widthZoom = w / (img.width * widthRatio);
    const heightZoom = h /(img.height * heightRatio);
    const zoomRatio = Math.max(widthZoom, heightZoom);


    return { width: img.width * widthRatio * zoomRatio, height: img.height * heightRatio * zoomRatio };
}

}