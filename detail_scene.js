import BackgroundImage from "./background.js";
import * as THREE from "three";
import { changeDetailScreenData, deleteSessionStorage, getSafeAreaInsets, isMobile, isPhone } from "./util.js";

export default class DetailScene {

    constructor(images, films, downloadedImages, imageTextures) {
        this.images = images;
        this.films = films;
        this.isRendering = false;
        this.background = new BackgroundImage("background", this.images, this.films, downloadedImages, imageTextures);
        this.node = document.getElementById("film");
        this.selectionOverlay = document.getElementById("selection_overlay");
        this.isScrolled = false;
        this.safeSize = getSafeAreaInsets();
        this.mobile = isMobile();
        this.setupScrolling();
        this.setupNextImageClick();
        this.goBack();

        //this.setupCustomSelection();
    }


    setFilm(index) {
        this.currentImage = this.images[index];
        this.currentFilm = this.films[index];
        this.currentindex = index;
        this.isRendering = true;
        this.background.rendering = this.isRendering;
        this.transition(1);
        

    }


    changeImageBackground(newIndex){
            this.currentindex = newIndex;
            const main = document.getElementById("main");
            const title = document.getElementById("title_text");
                // Animation zurücksetzen
            main.style.animation = "none";
            title.style.animation = "none";

            // Reflow erzwingen (sehr wichtig!)
            main.offsetHeight;
            title.offsetHeight;

            // Animation neu setzen
           

            requestAnimationFrame(() => {
                main.style.animation = "0.75s ease-in-out articleTransition";
                //title.style.animation = "0.75s ease-in-out titleTransition";
            setTimeout(() => {
                changeDetailScreenData(this.films[newIndex]);
                title.innerHTML = this.films[newIndex].title;
            }, 375)
            })

            
            this.background.nextImage(this.currentindex);
    }

    setupNextImageClick(){

        let startX = 0;
        let startY = 0;
        const threshold = 50; // Mindestdistanz in px
        const restraint = 100; // maximale vertikale Abweichung

        var gesuredZone = document.body;

        if(this.images.length == 1) {
            document.getElementById("next_film_button").style.display = "none";
            //online one film 
            return
        }

        document.getElementById("next_film_button").addEventListener("click", (e) => {
            const newIndex = ((this.currentindex + 1) % this.images.length);


            this.changeImageBackground(newIndex);
            
            setTimeout(() => {
                this.setContainer();
            }, 500)
        });
        
        document.body.addEventListener("keydown", (e) => {

            if(e.key == 'ArrowRight') {
                const newIndex = Math.abs((this.currentindex + 1) % this.images.length);
                console.log(newIndex, this.images.length);
                this.changeImageBackground(newIndex);
                this.setContainer();

            } 

            if(e.key == 'ArrowLeft') {
                const newIndex = Math.abs((this.currentindex - 1) % this.images.length);
                console.log(newIndex, this.images.length);
                this.changeImageBackground(newIndex);
                this.setContainer()

            }

        });


        gesuredZone.addEventListener("touchstart", (e) => {
            const touch = e.changedTouches[0];
            startX = touch.pageX;
            startY = touch.pageY;
        }, { passive: true });

        gesuredZone.addEventListener("touchend", (e) => {
            const touch = e.changedTouches[0];
            const distX = touch.pageX - startX;
            const distY = Math.abs(touch.pageY - startY);

            // Swipe von rechts nach links
            if (distX < -threshold && distY < restraint) {
                const newIndex = ((this.currentindex + 1) % this.images.length);

                console.log(newIndex, this.currentindex, this.images.length);
                this.changeImageBackground(newIndex);
                
                setTimeout(() => {
                    this.setContainer();
                }, 500)
            }
        }, { passive: true });





    }



    transition(direction){
        
        if(direction == 1) {
        
            this.node.style.display = "block";
        } else if(direction == -1) {

            this.node.style.display = "none";
        }
        
        //TODO;
    }

    setTitle(newTitle) {
         document.getElementById("title_text").innerHTML = newTitle;
    }

    setCurrentImage(path, img) {
        this.background.current_image_path = path;
        this.background.current_image = img;
        const newTexture = new THREE.Texture(img);
        newTexture.needsUpdate = true;
        this.background.uniforms.image.value = newTexture;
        return;
    }

    
    setBottom(){
        const main = document.getElementById("main");
        const gap = -10;
        const bottom = document.getElementById("article").getBoundingClientRect().height;

        if(isPhone()) {
            const height_story = document.getElementById("story").getBoundingClientRect().height;
            const height_article_tilte = document.getElementById("article_infos").getBoundingClientRect().height;

            main.style.bottom = -(bottom + height_story + height_article_tilte) + "px";
        } else {
            main.style.bottom = -(bottom + gap) + "px";

        }

    }

    calculateContainerHeight(){
        const height = document.getElementById("article").getBoundingClientRect().height;
        this.containerHeight = height;
    }

    setContainer() {
    
        const bottom = document.getElementById("article").getBoundingClientRect().height;


        if(!isPhone()) {
            document.getElementById("main").style.bottom = (-bottom) +"px";
            this.currentY = 0;
            this.targetY = 0;
            document.getElementById("main").style.transform = "translate3d(0px,0px,0px)"
        } else {
            console.log("set Container!");
            this.setBottom();

        }
        
    }


    goBack(){
        document.getElementById("back_button").addEventListener("click", (e) => {
            window.location.reload(); //silly way to handle this
        });
    }





    

setupScrolling() {

    window.visualViewport.addEventListener("resize", () => {
        this.viewPortHeight = window.visualViewport ? window.visualViewport.height + (this.safeSize.top + this.safeSize.bottom) : window.innerHeight + (this.safeSize.top + this.safeSize.bottom);
        this.calculateContainerHeight();
        this.setContainer();
        
    });

    if(this.mobile) return;

    this.viewPortHeight = window.visualViewport ? window.visualViewport.height + (this.safeSize.top + this.safeSize.bottom) : window.innerHeight + (this.safeSize.top + this.safeSize.bottom);
    this.calculateContainerHeight();

    this.currentY = 0;
    this.targetY = 0;
    this.scrollPos = 0;
    const margin = 40;

    const node =  document.getElementById("main");
    const animate = () => {
        this.currentY += (this.targetY - this.currentY) * 0.08;


        if(this.currentY == 0 || this.currentY <= -0.4) {
 node.style.transform =
                `translate3d(0, ${this.currentY}px, 0)`;

        }
       


        
        requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener(
    "wheel",
    (e) => {
        this.calculateContainerHeight();
        
        this.selectionOverlay.innerHTML = "";
        window.getSelection().removeAllRanges();

        this.maxScroll = Math.max(
            this.containerHeight + margin * 2,
            0
        );
        e.preventDefault(); // WICHTIG

        const speed = 0.9; // feinjustieren
        this.scrollPos += e.deltaY * speed;

        this.scrollPos = Math.min(
        Math.max(this.scrollPos, 0),
        this.maxScroll
        );

        const progress =
        this.maxScroll === 0
            ? 0
            : this.scrollPos / this.maxScroll;



        const translateYAtTop = 0;
        const translateYAtBottom =
        -this.containerHeight;

        this.targetY =
        translateYAtTop +
        progress * (translateYAtBottom - translateYAtTop);
    },
    { passive: false }
    );
 }

    


    startRendering() {
        this.isRendering = true;
        this.background.rendering = this.isRendering;
        document.body.style.cursor = "cell"
        document.body.style.overflow = "none";

        if(this.mobile) {
            document.body.style.overflow = "scroll";
        }

        document.body.classList.add("disable_selection");

        this.transition(1);
        
        this.setBottom();

    }

    stopRendering(){
        this.isRendering = false;
        this.background.rendering = this.isRendering;
        document.body.style.cursor = "auto";

        if(this.mobile) {
            document.body.style.overflow = "hidden";
        }

        document.body.classList.remove("disable_selection");

        this.transition(-1);
    }

    setupCustomSelection(){

        if(this.mobile) return;

        const overlay = this.selectionOverlay;


        document.addEventListener("selectionchange", () => {
            
            if(!this.isRendering) return;

            const s = window.getSelection();

            overlay.innerHTML = "";
            
            if(s.toString().length == 0) return;



            const oRange = s.getRangeAt(0); //get the text range
            const rects = oRange.getClientRects();


            [...rects].forEach(r => {
                const part = document.createElement("div");

                part.classList.add("selection_line");

                part.style.position = "absolute";
                part.style.left = `${r.left}px`;
                part.style.top = `${r.top}px`;
                part.style.width = `${r.width}px`;
                part.style.height = `${r.height}px`;

                overlay.appendChild(part);
                });

        })

    }


    


}
