import * as THREE from "three";
import { download_image, getSafeAreaInsets, randomAngle } from "./util.js";
import { parseShaderFile } from "./shader.js";

export default class BackgroundImage {

    constructor(id, images, films, downloadedImages, imageTextures){
        this.id = id;
        this.films = films;
        this.images = images;
        this.current_image_path = images[0];
        this.scene = new THREE.Scene();
        this.fragmentShaderPath = "shaders/detail_page/frag.glsl";
        this.vertexShaderPath = "shaders/detail_page/vert.glsl";
        this.clock = new THREE.Clock();
        this.currentAngle = randomAngle();
        this.rendering = false;
        this.downloadedImages = downloadedImages;
        this.imageTextures = imageTextures;
        this.mouse = new THREE.Vector2(0,0);
        this.prevMouse = new THREE.Vector2(0,0);
        this.mouseVelocity = new THREE.Vector2(0,0);
        this.safeSize = getSafeAreaInsets();
        this.window = {
            width: (window.visualViewport ? window.visualViewport.width : window.innerWidth) + (this.safeSize.left + this.safeSize.right),
            height: (window.visualViewport ? window.visualViewport.height : window.innerHeight) + (this.safeSize.top + this.safeSize.bottom)
        }


        this.uniforms = {
            grayscale: {
                value: 1.0 // normalized value
            },

            resolution: {
                value: new THREE.Vector2(0, 0)
            },

            noiseOffset: {
                value: new THREE.Vector2(0, 0)
            },

            brightness: {
                value: 0.6 //normalized value
            },

            time: {
                value: 0.0
                
            },
        
            motionBlurAngle: {
                value: this.currentAngle
            },
            
            image: {
                value: null
            },

            mouseVelocity: {
                value: this.mouseVelocity
            },

            mouse: {
                value: this.mouse
            },

            transition: {
                value: 0.0
            },

            nextImage: {
                value: null
            },

            dispFactor: {
                value: 0.0
            },

            window: {
                value: new THREE.Vector2(this.window.width, this.window.height)
            }
        
        }

        this.setup();
    }

    async setup(){
        
        this.fragmentShader = (await parseShaderFile(this.fragmentShaderPath)).shader;

        
        this.vertexShader = (await parseShaderFile(this.vertexShaderPath)).shader;
        this.current_image = await download_image(this.current_image_path);

         this.window = {
            width: (window.visualViewport ? window.visualViewport.width : window.innerWidth) + (this.safeSize.left + this.safeSize.right),
            height: (window.visualViewport ? window.visualViewport.height : window.innerHeight) + (this.safeSize.top + this.safeSize.bottom)
        }


        const w = this.window.width;
        const h = this.window.height;
        this.camera = new THREE.OrthographicCamera(
            -w / 2,
            w / 2,
            h / 2,
            -h / 2,
            -10,
            10
        );

        this.camera.position.z = 2;
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(w,h);
        this.renderer.domElement.id = this.id;

        const filmNode = document.getElementById("film");
        
        filmNode.appendChild(this.renderer.domElement);
        

        const size = this.calculateImageScale();
        const geometry = new THREE.PlaneGeometry(size.width, size.height);

        const img_texture = new THREE.Texture(this.current_image);
        img_texture.needsUpdate = true;

        this.uniforms.image.value = img_texture;
        this.uniforms.resolution.value = new THREE.Vector2(size.width, size.height);

        const material = new THREE.ShaderMaterial({
            fragmentShader: this.fragmentShader,
            vertexShader: this.vertexShader,
            uniforms: this.uniforms,
            transparent: true
        });


        this.background = new THREE.Mesh(geometry, material);
        this.scene.add(this.background);
        if(this.rendering)  this.renderer.render(this.scene, this.camera);
        this.setupResponsives();
        this.setupMouse();

        this.renderer.setAnimationLoop(this.animate.bind(this));
    }


    // Berechne die kleinst mögliche size damit das bild in den screen passt 
    calculateImageScale() { 
        const img = this.current_image;
        const imgRatio = this.current_image.width / this.current_image.height;

        const w = this.window.width;
        const h = this.window.height;

        const widthRatio =  w / img.width;
        const heightRatio = ( w / imgRatio) / img.height;
    
        const widthZoom = w / (img.width * widthRatio);
        const heightZoom = h /(img.height * heightRatio);
        const zoomRatio = Math.max(widthZoom, heightZoom);


        return { width: img.width * widthRatio * zoomRatio, height: img.height * heightRatio * zoomRatio };
}

    setupResponsives() {

        document.body.addEventListener("mouseleave", () => {
            this.mouse = new THREE.Vector2(Infinity, Infinity);
            this.background.material.uniforms.mouse.value = this.mouse;
            console.log("mouse out");
        })
        
        window.visualViewport.addEventListener("resize", () => {

            this.window = {
                width: (window.visualViewport ? window.visualViewport.width : window.innerWidth) + (this.safeSize.left + this.safeSize.right),
                height: (window.visualViewport ? window.visualViewport.height : window.innerHeight) + (this.safeSize.top + this.safeSize.bottom)
            }

            const w = this.window.width;
            const h = this.window.height;
            
            this.background.geometry.dispose(); //in big 26 in js memory freigeben hahahaha
            const newSize = this.calculateImageScale();

            this.background.geometry = new THREE.PlaneGeometry(newSize.width, newSize.height); //ändere Größe der Plane yeah i know könnte man auch clean scalen aber wer bin ich schon!
            this.background.material.uniforms.resolution.value = new THREE.Vector2(newSize.width, newSize.height);
            this.background.material.uniforms.window.value = new THREE.Vector2(w, h);

            this.camera.left = -w / 2;
            this.camera.right = w / 2;
            this.camera.top = h / 2;
            this.camera.bottom = -h / 2; //dieses - hat mir 3 std debugging gekostet 
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(w, h);
        
            if(this.rendering)  this.renderer.render(this.scene, this.camera);
        
        });

    }



    nextImage(newIndex) {
        this.uniforms.transition.value = 1.0;
        const newImage = this.imageTextures[newIndex];
        this.uniforms.nextImage.value = newImage;
        this.uniforms.nextImage.needsUpdate = true;
        
        TweenLite.to( this.uniforms.dispFactor, 1, {
                        value: 1,
                        ease: 'Expo.easeInOut',
                        onComplete: function () {
                            this.uniforms.image.value = this.imageTextures[newIndex];
                            this.uniforms.image.needsUpdate = true;
                            this.uniforms.dispFactor.value = 0.0;
                            this.uniforms.transition.value = 0.0;
            }.bind(this)
        });
    }


    setupMouse(){
        document.body.addEventListener("mousemove", (e)=> {
            
            if(this.rendering) {  
                //classical coord transform 

                this.mouse.x = (e.clientX / window.innerWidth);
                this.mouse.y = 1.0 - e.clientY / window.innerHeight;

                //calc mouse Delta!
                this.mouseVelocity.subVectors(this.mouse, this.prevMouse);
                this.prevMouse.copy(this.mouse);
                
                const smoothMouseVel = new THREE.Vector2();

                smoothMouseVel.lerp(this.mouseVelocity, 0.4);

                this.background.material.uniforms.mouseVelocity.value.copy(smoothMouseVel);
                this.background.material.uniforms.mouse.value.copy(this.mouse);                

            };
            
        })
    }

    animate() {
        const t = this.clock.getElapsedTime();
        this.uniforms.noiseOffset.value = new THREE.Vector2(
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02
        );

        this.uniforms.brightness.value = 0.6 + Math.sin(t * 2.0) * 0.02;
        this.uniforms.time.value = t;
        if(this.rendering) this.renderer.render(this.scene, this.camera);
    }

}


