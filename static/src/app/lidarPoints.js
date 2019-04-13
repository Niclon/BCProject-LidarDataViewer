import {Component, h} from 'preact'
import 'react'
import {CustomFrustum} from "./customFrustum";

var THREE = require('three');

class lidarPoints extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lidarPoints: null,
            spheres: null,
            stepNumber: props.stepNumber,
            maximumStepNumber: 0,
            images: ['img/360IMGStreet.jpg', 'img/image1.jpg', 'img/image2.jpg', 'img/image3.jpeg'],
        };
    }

    // componentDidMount() {
    //     fetch('http://127.0.0.1:8000/datastored/' + this.props.stepNumber)
    //         .then(response => {
    //             response.json();
    //             console.log(response);
    //         })
    //         .then(data => {
    //             this.state.lidarPoints = JSON.parse(data);
    //             console.log(data);
    //             console.log(this);
    //         });
    //
    // }

    removeSpheres() {
        let scenel = document.querySelector('a-scene').object3D;
        let selectedObject = scenel.getObjectByName("groupOfPoints");
        if (selectedObject) {
            selectedObject.children = [];
        }
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
            });
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

    loadDataFromServerAndRenderPoints() {
        let that = this;
        let request = new XMLHttpRequest();
        request.open('GET', '/dataStored/' + this.state.stepNumber, true);  // `false` makes the request synchronous
        request.setRequestHeader('Content-Type', 'application/json');
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                that.state.lidarPoints = JSON.parse(request.response);
                that.renderPointsFromData();
                that.hideLoadingModal();
                that.createFrustumForShape();
            }
        };
        request.send(null);


        // $.ajax({
        //     url: 'dataStored/' + this.state.stepNumber,
        //     async: false,
        //     dataType: 'json',
        //     success: function (response) {
        //         // do stuff with response.
        //         this.state.lidarPoints = response;
        //     }
        // });rendere
    }

    renderPointsFromData() {
        let scene = document.querySelector('a-scene').object3D;
        let spheres = scene.getObjectByName("groupOfPoints");

        if (!spheres) {
            return;
        }

        let geometry = new THREE.SphereGeometry(0.005, 5, 5);
        let material = new THREE.MeshLambertMaterial({color: 0x39ff14});

        // let spheres = new THREE.Group();
        // spheres.name = "Spheres";

        let that = this.state.lidarPoints;

        Object.keys(this.state.lidarPoints).forEach(function (key) {
            let value = that[key];
            let sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(value[0], value[2], -value[1]);
            spheres.add(sphere);
        });
        this.state.spheres = spheres;
        // this.state.lidarPoints.forEach(function (key, value) {
        //     let sphere = new THREE.Mesh(geometry, material);
        //     sphere.position.set(value[0], value[1] + camera.y, value[2]);
        //     spheres.add(sphere);
        // });


        // scene.add(spheres);
    }

    showLoadingModal() {
        (function () {
            document.querySelector('#loadModal').hidden = false;
        })();
    }

    hideLoadingModal() {
        (function () {
            document.querySelector('#loadModal').hidden = true;
        })();
    }

    sendSelectedDataToBackend() {

    }

    getSelectedData() {

    }

    createFrustumForShape() {
        let scene = document.querySelector('a-scene').object3D;
        let spheres = scene.getObjectByName("groupOfPoints");
        let lines = scene.getObjectByName('groupOfLines');
        let vec1, vec2, vec3, vec4, vec5, vec6, vec7, vec8, vec9, vec10, vec11, vec12;
        let plane1, plane2, plane3, plane4, plane5, plane6;
        let result = {};

        if (!lines) {
            return;
        }
        let that = this;
        if (lines.children.length > 0) {
            let index = 0;
            lines.children.forEach(function (line) {

                vec1 = line.position.clone();
                vec2 = vec1.clone();
                vec2.y = vec2.y + line.userData.yLength;
                vec3 = new THREE.Vector3();
                plane1 = new THREE.Plane();
                plane1.setFromCoplanarPoints(vec1, vec2, vec3);
                let rotationMatrix = that.createRotationMatrix4AroudYAxis(Math.PI);

                plane1.applyMatrix4(rotationMatrix);

                // var helper1 = new THREE.PlaneHelper(plane1, 6, 0xffff00);
                // scene.add(helper1);

                vec4 = line.position.clone();
                vec5 = vec4.clone();
                vec5.x = vec5.x + line.userData.xLength;
                vec6 = new THREE.Vector3();
                plane2 = new THREE.Plane();
                plane2.setFromCoplanarPoints(vec4, vec5, vec6);

                // var helper2 = new THREE.PlaneHelper(plane2, 6, 0xffff00);
                // scene.add(helper2);

                vec7 = line.position.clone();
                vec7.x = vec7.x + line.userData.xLength;
                vec8 = vec7.clone();
                vec8.y = vec8.y + line.userData.yLength;
                vec9 = new THREE.Vector3();
                plane3 = new THREE.Plane();
                plane3.setFromCoplanarPoints(vec7, vec8, vec9);

                // var helper3 = new THREE.PlaneHelper(plane3, 6, 0xffff00);
                // scene.add(helper3);

                vec10 = line.position.clone();
                vec10.y = vec10.y + line.userData.yLength;
                vec11 = vec10.clone();
                vec11.x = vec11.x + line.userData.xLength;
                vec12 = new THREE.Vector3();
                plane4 = new THREE.Plane();
                plane4.setFromCoplanarPoints(vec10, vec11, vec12);
                plane4.applyMatrix4(that.createRotationMatrix4AroudXAxis(Math.PI));
                plane4.applyMatrix4(that.createRotationMatrix4AroudYAxis(Math.PI));
                plane4.applyMatrix4(that.createRotationMatrix4AroudZAxis(Math.PI));
                // var helper4 = new THREE.PlaneHelper(plane4, 6, 0xffff00);
                // scene.add(helper4);


                // let point = line.userData.camera.getWorldDirection().clone();
                //
                // plane5 = new THREE.Plane();
                // plane5.setFromNormalAndCoplanarPoint(line.userData.camera.getWorldDirection(plane5.normal), point.setLength(100));
                //
                // plane6 = new THREE.Plane();
                // plane6.setFromNormalAndCoplanarPoint(line.userData.camera.getWorldDirection(plane6.normal), point.clone().setLength(0.2));


                // let frustum = new THREE.Frustum(plane1, plane2, plane3, plane4, plane5, plane6);
                let frustum = new CustomFrustum(plane1, plane2, plane3, plane4);

                //add line to result

                spheres.children.forEach(function (sphere) {
                    if (frustum.containsPoint(sphere.position)) {
                        result[index] = sphere.position;
                        index++;
                    }
                });
                console.log(result);

            });

        }


    }

    createRotationMatrix4AroudYAxis(angleInRad) {
        let rotationMatrix4 = new THREE.Matrix4();
        rotationMatrix4.set(
            Math.cos(angleInRad), 0, Math.sin(angleInRad), 0,
            0, 1, 0, 0,
            -Math.sin(angleInRad), 0, Math.cos(angleInRad), 0,
            0, 0, 0, 1
        );
        return rotationMatrix4;
    }

    createRotationMatrix4AroudZAxis(angleInRad) {
        let rotationMatrix4 = new THREE.Matrix4();
        rotationMatrix4.set(
            Math.cos(angleInRad), Math.sin(angleInRad), 0, 0,
            -Math.sin(angleInRad), Math.cos(angleInRad), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
        return rotationMatrix4;
    }

    createRotationMatrix4AroudXAxis(angleInRad) {
        let rotationMatrix4 = new THREE.Matrix4();
        rotationMatrix4.set(
            1, 0, 0, 0,
            0, Math.cos(angleInRad), -Math.sin(angleInRad), 0,
            0, Math.sin(angleInRad), Math.cos(angleInRad), 0,
            0, 0, 0, 1
        );
        return rotationMatrix4;
    }

    render() {
        this.showLoadingModal();
        this.removeSpheres();
        // this.makeBackroundIMG();
        // this.takePicturesfromCameras();
//        todo uncoment this and coment second one
        this.loadDataFromServerAndRenderPoints();
//         this.sendSelectedDataToBackend();
        this.createFrustumForShape();
        // this.renderPointsFromData();
        // this.hideLoadingModal();


        return (null);
    }

}

export default (lidarPoints)