import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import autoBind from "auto-bind";

class EffectShell {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        this.loader = new GLTFLoader();
        this.clock = new THREE.Clock();

        autoBind(this);

        this.init();
    }

    init() {
        this.camera.position.z = 175;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        document.body.appendChild(this.renderer.domElement);

        this.addEventListeners();
        this.addControls();
        this.loadModel();
        this.render();
    }

    addEventListeners() {
        window.addEventListener("resize", this.onResize);
    }

    addControls() {
        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );

        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
    }

    async loadModel() {
        this.model = await this.loader.loadAsync(
            "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Flamingo.glb"
        );
        const clip = this.model.animations[0];
        this.mixer = new THREE.AnimationMixer(this.model.scene.children[0]);
        const action = this.mixer.clipAction(clip);

        action.play();

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);

        this.model.scene.children[0].rotation.y = -75;

        this.scene.add(
            this.model.scene.children[0],
            ambientLight,
            directionalLight
        );
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render() {
        const delta = this.clock.getDelta();

        this.renderer.render(this.scene, this.camera);
        this.controls.update();

        if (this.mixer) {
            this.mixer.update(delta);
        }

        requestAnimationFrame(this.render);
    }
}

new EffectShell();
