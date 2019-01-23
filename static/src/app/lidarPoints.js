import {Component,h} from 'preact'
import 'react'

var THREE = require('three');

class lidarPoints extends Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    lidarPoints: null
                }
            ],
            stepNumber: props.stepNumber,
            maximumStepNumber: 0,
            images: ['img/360IMGStreet.jpg', 'img/image1.jpg', 'img/image2.jpg', 'img/image3.jpeg'],
        };
    }

    // componentDidMount() {
    //     fetch('http://127.0.0.1:8000/datastored')
    //         .then(response => response.json())
    //         .then(data => {
    //             for (var i = 0; i < data.length; i++) {
    //                 this.state.history = this.state.history.concat([
    //                     {
    //                         lidarPoints: data[i]
    //                     }
    //                 ]);
    //             }
    //             this.state.maximumStepNumber = i;
    //         });
    //
    // }

    removeSpheres() {
        let scenel = document.querySelector('a-scene').object3D;
        let selectedObject = scenel.getObjectByName("Spheres");
        scenel.remove(selectedObject);
    }

    makeBackroundIMG() {
        // let scene = document.querySelector('a-scene').object3D;
        // if(scene.getObjectByName("Background")){
        //     scene.remove(scene.getObjectByName("Background"));
        // }
        // let photoSphere = new THREE.SphereGeometry(100  , 100, 40);
        // photoSphere.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
        // let sphereMaterial = new THREE.MeshBasicMaterial();
        // let texHolder = new THREE.TextureLoader();
        // sphereMaterial.map = texHolder.load('img/360IMGStreet.jpg');
        // // sphereMaterial.map = THREE.ImageUtils.loadTexture('img/360IMGStreet.jpg');
        //
        // let sphereMesh = new THREE.Mesh(photoSphere, sphereMaterial);
        // sphereMesh.name = "Background";
        // scene.add(sphereMesh);

        let scene = document.querySelector('a-scene');

        console.log(this.state.images[this.state.stepNumber % this.state.images.length]);
        scene.children[1].setAttribute('src', this.state.images[this.state.stepNumber % this.state.images.length]);


    }

    takePicturesfromCameras() {
        let scene = document.querySelector('a-scene');
        let renderer = scene.renderer;

        if (renderer == null) {
            return;
        }
        // let camera;
        let groupOfCameras = scene.object3D.getObjectByName("groupOfCameras");

        if (groupOfCameras.children.length > 0) {
            this.createImageFromCameras(scene, renderer, groupOfCameras);
        }
        // let bufferPicture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight,{
        //     minFilter: THREE.NearestFilter,
        //     magFilter: THREE.NearestFilter,
        //     format: THREE.RGBAFormat
        // });
        // renderer.render(scene.object3D,groupOfCameras.children[0],bufferPicture,true);
        // console.log(secCanvas);

        // renderer.render(scene.object3D,groupOfCameras.children[0],secCanvas);


        // var boxMaterial = new THREE.MeshBasicMaterial({map:bufferPicture});
        // var boxGeometry2 = new THREE.BoxGeometry( 14, 8, 8 );
        // var mainBoxObject = new THREE.Mesh(boxGeometry2,boxMaterial);

        // mainBoxObject.position.set(0,0,-15);
        // scene.object3D.add(mainBoxObject);


        //this piece works
        // renderer.render(scene.object3D,groupOfCameras.children[0]);
        // var dataURL = renderer.domElement.toDataURL();
        // console.log(dataURL);

    }

    createImageFromCameras(scene, renderer, groupOfCameras) {
        let dataToSend = [];
        for (let i = 0; i < groupOfCameras.children.length; i++) {
            renderer.render(scene.object3D, groupOfCameras.children[i]);
            let dataURL = renderer.domElement.toDataURL();
            dataToSend.push({
                key: 'camera' + i,
                value: dataURL
            })
            // console.log(dataURL)
        }
        this.sendImagesToServer(JSON.stringify(dataToSend));
    }

    sendImagesToServer(dataToSend) {
        const http = new XMLHttpRequest();
        http.open('POST', '/Images/');
        http.setRequestHeader('Content-type', 'application/json');
        http.send(dataToSend); // Make sure to stringify

        // $.ajax({
        //        url: '/ajax/Images/',
        //        cache: false,
        //        data: {
        //          'data': dataToSend
        //        },
        //        dataType: 'json',
        //        error: function () {
        //            console.log("Data to server couldnt be send");
        //        },
        //      });
    }


    render() {
        this.removeSpheres();
        // this.makeBackroundIMG();
        const scene = document.querySelector('a-scene').object3D;
        let camera = {x: 0, y: 2, z: 0};
        let spheres = new THREE.Group();
        spheres.name = "Spheres";

        let geometry = new THREE.SphereGeometry(0.005, 4, 4);
        let material = new THREE.MeshBasicMaterial({color: 0x39ff14});

        let myDistanceForTesting = this.state.stepNumber / 3;
        // angle is 32 degrees and distance between one laser is 2 deg
        let angleDeg = 90 + 16;
        let angleRad = angleDeg * Math.PI / 180;
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 360; j++) {
                let x = myDistanceForTesting * Math.sin(angleRad) * Math.sin(j * Math.PI / 180);
                let y = myDistanceForTesting * Math.cos(angleRad);
                let z = myDistanceForTesting * Math.sin(angleRad) * Math.cos(j * Math.PI / 180);
                // i * Math.PI / 180
                let sphere = new THREE.Mesh(geometry, material);
                sphere.position.set(x, y + camera.y, z);
                spheres.add(sphere);
            }
            angleDeg -= 2;
            angleRad = angleDeg * Math.PI / 180;
        }

        scene.add(spheres);
        // console.log(this.state.stepNumber);
        // console.log(this);
        this.takePicturesfromCameras();
        return (null);
    }
}

export default (lidarPoints)