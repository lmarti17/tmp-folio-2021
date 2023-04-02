import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  ShaderMaterial,
  OctahedronGeometry,
  Vector3,
  Color,
  Vector2,
  Clock,
  AmbientLight,
  MeshStandardMaterial,
  DirectionalLight,
  MeshLambertMaterial,
  IcosahedronGeometry,
  TextureLoader,
  MeshPhysicalMaterial
  MirroredRepeatWrapping,
  CircleGeometry,
  VideoTexture,
  RepeatWrapping,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import * as Dat from "lil-gui"

// * Import background Shader
import backgroundVertexShader from "../shaders/backgroundShader/vertex.glsl";
import backgroundFragmentShader from "../shaders/backgroundShader/fragment.glsl";

// * Import diamond Shader
import previewVertexShader from "../shaders/previewShader/vertex.glsl";
import previewFragmentShader from "../shaders/previewShader/fragment.glsl";

// // * Import diamond Shader
// import diamondVertexShader from "../shaders/diamondShader/vertex.glsl";
// import diamondFragmentShader from "../shaders/diamondShader/fragment.glsl";

//* Import texture
import texture from "../assets/texture.png";

const lerp = (a, b, n) => (1 - n) * a + n * b;

export default class Experience {
  constructor() {
    this.scene = new Scene();
    this.canvasDOM = document.querySelector(".webgl-canvas");
    this.button = document.getElementById('swapTexture');
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.target= {
      x: 0,
      y: 0
    }
    

    this.gui = new Dat.GUI()
    this.params = {
      uFrequencyX: 3.6,
      uFrequencyY: 0,
      lerpIntensity: 0.08
    }
    
    
    this.gui.add(this.params, "uFrequencyX").min(0).max(10).step(0.01).onChange(() => {
      this.previewMesh.material.uniforms.uFrequency.value.x = this.params.uFrequencyX
    })
    this.gui.add(this.params, "uFrequencyY").min(0).max(10).step(0.01).onChange(() => {
      this.previewMesh.material.uniforms.uFrequency.value.y = this.params.uFrequencyY
    })

    this.gui.add(this.params, "lerpIntensity").min(0.001).max(0.5).step(0.0001)

    // * Get video DOM elements

    this.videoAssets = [
      {
        path: new URL("../assets/videoTextures/gdevelop.mov",import.meta.url),
        domEl: document.getElementById('video')
      },
      {
        path: new URL("../assets/videoTextures/beige.mov",import.meta.url),
        domEl: document.getElementById('videoNext')
      }
    ]

    this.videoTextures = []

    this.clock = new Clock(false);

    // * Setup Scene
    this.setupCamera();
    // this.setupLights();
    this.setupRenderer();
    this.clock.start();
    this.animate()

    // * add Objects
    
    this.loadVideos()

    
    
  }

  setupCamera() {
    this.camera = new PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      10
    );
    this.camera.position.z = 3;
    this.controls = new OrbitControls(this.camera, this.canvasDOM);

    this.scene.add(this.camera);
  }

  setupRenderer() {
    this.renderer = new WebGLRenderer({
      canvas: this.canvasDOM,
      alpha: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.sizes.width, this.sizes.height);

    this.renderer.render(this.scene, this.camera);
  }

  setupLights() {
    this.ambientLight = new AmbientLight(0xffffff, 0.3);

    this.directionalLight = new DirectionalLight(0xff00ff, 0.5);
    this.directionalLight.position.z = 3;
    this.directionalLight.lookAt(0, 0, 0);

    this.scene.add(this.ambientLight, this.directionalLight);
  }

  loadVideos(){

    const VideoLoaderWorker = new Worker(
      new URL('../workers/loader.js',import.meta.url)
    )

    VideoLoaderWorker.addEventListener('message', event => {
      const videoData = event.data;

      const videoUrl = URL.createObjectURL(videoData.blob);
      
      const video = document.createElement('video');
      video.src = videoUrl;
      document.body.appendChild(video)
      video.load()
      // video.autoplay = true;
      video.loop = true;

      video.poster = new URL("../assets/texture.png", import.meta.url)
      video.muted = true;
      video.play();

      video.oncanplay = () => {
        let videoTexture = new VideoTexture(video)
        // videoTexture.wrapS = videoTexture.wrapT = MirroredRepeatWrapping;
        // videoTexture.wrapS = videoTexture.wrapT = RepeatWrapping;
        videoTexture.flipY = false;
        
        this.videoTextures.push({
          resolution: video.videoWidth / video.videoHeight,
          texture: videoTexture,
          name: videoData.videoURL
        })
        
        if(!this.previewMesh && this.videoTextures.length === this.videoAssets.length){
          this.createMesh()
        }
        
        
        // cleanup blob
        // URL.revokeObjectURL(videoUrl)
      }

      //  video.onended = () =>{ 
      //   if(this.previewMesh.material){
      //     this.previewMesh.material.needsUpdate = true;
      //     this.previewMesh.material.uniforms.uTexture.value.needsUpdate = true;
      //   } 
      // }
      
    })

    this.videoAssets.forEach((video) => {
      VideoLoaderWorker.postMessage(video.path.href);
    })

  }

  createMesh(){
    this.addPreviewMesh()
    
    this.addEvents();

  }

  addBackground() {
    let fov_y =
      (this.camera.position.z * this.camera.getFilmHeight()) /
      this.camera.getFocalLength();
    var planeGeometry = new PlaneGeometry(fov_y * this.camera.aspect, fov_y);

    this.background = new Mesh(
      planeGeometry,
      new ShaderMaterial({
        vertexShader: backgroundVertexShader,
        fragmentShader: backgroundFragmentShader,
        uniforms: {
          uColor1Min: { value: new Color("rgb(236, 90, 70)") },
          uColor1Max: { value: new Color("rgb(197, 63, 47)") },
          uColor2Min: { value: new Color("rgb(174, 154, 135)") },
          uColor2Max: { value: new Color("rgb(203, 188, 144)") },
          uCenter: { value: new Vector2(0, 0.8) },
          uScroll: { value: 0 },
          uTime: { value: 0 },
        },
      })
    );

    this.scene.add(this.background);
  }


  addPreviewMesh(){
    console.log(this.videoTextures)
    this.previewMesh = new Mesh(
      new PlaneGeometry(1, 1 / this.videoTextures[0].resolution, 512, 512),
      new ShaderMaterial({
        vertexShader: previewVertexShader,
        fragmentShader: previewFragmentShader,
        uniforms: {
          uTexture: { value: this.videoTextures[0].texture },
          uNextTexture: { value: this.videoTextures[1].texture },
          uVideoTextureResolution: { value: this.videoTextures[0].resolution },
          uResolution: { value: new Vector2(window.innerWidth, window.innerHeight)},
          uFrequency: {value: new Vector2(this.params.uFrequencyX, this.params.uFrequencyY)},
          uMouse: {value: new Vector2(0.5, 0.5)},
          uTime: { value: 0 },
        },
      })
    )

    // this.previewMesh.position.x = -.75;
    this.previewMesh.rotation.y = Math.PI / 6
    this.scene.add(this.previewMesh)
  }

  addDiamond() {
    let diamondTexture = new TextureLoader().load(texture);
    diamondTexture.wrapS = diamondTexture.wrapT = MirroredRepeatWrapping;


    this.diamond = new Mesh(
      new IcosahedronGeometry(0.5, 1),
      new ShaderMaterial({
        vertexShader: diamondVertexShader,
        fragmentShader: diamondFragmentShader,
        uniforms: {
          // uColor1Min: { value: new Color("rgb(236, 90, 70)") },
          // uColor1Max: { value: new Color("rgb(197, 63, 47)") },
          // uColor2Min: { value: new Color("rgb(174, 154, 135)") },
          // uColor2Max: { value: new Color("rgb(203, 188, 144)") },
          uTexture: { value: diamondTexture },
          uResolution: { value: new Vector2(window.innerWidth, window.innerHeight)},
          // uCenter: { value: new Vector2(0, 0.8) },
          // uScroll: { value: 0 },
          // uTime: { value: 0 },
        },
      })
    );

    // this.diamond.position.x = -1;
    this.diamond.position.z = 0.5;
    this.diamond.scale.set(0.75, 0.75, 0.75);
    this.scene.add(this.diamond);
  }

  addEvents() {
    window.addEventListener("scroll", (e) => {
      this.background.material.uniforms.uScroll.value =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
    });

    window.addEventListener("resize", () => {
      this.sizes.width = window.innerWidth;
      this.sizes.height = window.innerHeight;

      // * update camera aspect
      this.camera.aspect = this.sizes.width / this.sizes.height;
      this.camera.updateProjectionMatrix();

      // * update plane size to cover up the camera field of view
      let fov_y =
        (this.camera.position.z * this.camera.getFilmHeight()) /
        this.camera.getFocalLength();
      //  var planeGeometry = new PlaneGeometry(fov_y * this.camera.aspect, fov_y);

      this.background.scale.set(fov_y * this.camera.aspect, fov_y);

      // * update rendere size and pixel ratio
      this.renderer.setSize(this.sizes.width, this.sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    window.addEventListener('mousemove', ({clientX, clientY}) => {
      // let newX = clientX * 2/ window.innerWidth - 1;
      // let newY =  0.5 - (clientY / window.innerHeight);

      this.target.x = clientX * 2/ window.innerWidth - 1;
      this.target.y = 0.5 - (clientY / window.innerHeight);
    
    })


    this.button.addEventListener('click', () => {
      
      

    })
  }

  animate() {
    // * Sent elapsed time in shader uniforms
    const elapsedTime = this.clock.getElapsedTime();
    // this.background.material.uniforms.uTime.value = elapsedTime;
    
    if(this.previewMesh){
      this.previewMesh.material.uniforms.uTime.value = elapsedTime;

      this.previewMesh.material.uniforms.uMouse.value.x = lerp(
        this.previewMesh.material.uniforms.uMouse.value.x,
        this.target.x,
        this.params.lerpIntensity
      );
      this.previewMesh.material.uniforms.uMouse.value.y = lerp(
        this.previewMesh.material.uniforms.uMouse.value.y,
        this.target.y,
        this.params.lerpIntensity
      );
    }

    // * update OrbitControls
    // this.controls.update();

    // * Animate objects
    // this.diamond.rotation.y += 0.01;

    this.renderer.render(this.scene, this.camera);

    window.requestAnimationFrame(() => this.animate());
  }
}
