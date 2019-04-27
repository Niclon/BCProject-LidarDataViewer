import {Component, h, render} from 'preact'
import 'react'
import {CustomFrustum} from "./customFrustum";

var THREE = require('three');

class lidarPoints extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stepNumber: props.stepNumber,
            isReplay: props.isReplay,
            images: ['img/360IMGStreet.jpg', 'img/image1.jpg', 'img/image2.jpg', 'img/image3.jpeg'],
        };
        this.createDatGuiUI(props.maxStepNumber);
    }

    createDatGuiUI(maxStepNumber) {
        const dat = require('dat.gui');
        const gui = new dat.GUI();
        var guiFunction = function () {
            this.stepNumber = 0;
        };
        let variable = new guiFunction();

        let stepNumber = gui.add(variable, 'stepNumber').min(0).max(maxStepNumber).step(1);
        let that = this;

        stepNumber.onChange(function (value) {
            if (value === that.state.stepNumber) {
                return;
            }
            that.setState({
                stepNumber: value,
            });

        });
        let customContainer = document.querySelector('#my-gui-container');
        if (customContainer != null) customContainer.appendChild(gui.domElement);
    }

    removeSpheres() {
        let scenel = document.querySelector('a-scene').object3D;
        let selectedObject = scenel.getObjectByName("groupOfPoints");
        if (selectedObject) {
            selectedObject.children = [];
        }
        if (this.state.isReplay) {
            let lines = scenel.getObjectByName("groupOfLines");
            if (selectedObject) {
                lines.children = [];
            }
        }
    }

    makeBackroundIMG() {
        let scene = document.querySelector('a-scene').object3D;
        if (scene.getObjectByName("Background")) {
            scene.remove(scene.getObjectByName("Background"));
        }
        let photoSphere = new THREE.SphereBufferGeometry(90, 32, 32);
        photoSphere.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
        let sphereMaterial = new THREE.MeshBasicMaterial();
        let texHolder = new THREE.TextureLoader();
        // sphereMaterial.map = texHolder.load('static/dist/img/360IMGStreet.jpg');
        // sphereMaterial.map = THREE.ImageUtils.loadTexture('img/360IMGStreet.jpg');

        let that = this;
        texHolder.load('static/dist/img/360IMGStreet.jpg', (texture) => {
            sphereMaterial.map = texture;
            let sphereMesh = new THREE.Mesh(photoSphere, sphereMaterial);
            sphereMesh.name = "Background";
            scene.add(sphereMesh);
            that.takePicturesfromCameras();
        });
        // let sphereMesh = new THREE.Mesh(photoSphere, sphereMaterial);
        // sphereMesh.name = "Background";
        // scene.add(sphereMesh);
        //
        // let scene = document.querySelector('a-scene');
        //
        // console.log(this.state.images[this.state.stepNumber % this.state.images.length]);
        // scene.children[1].setAttribute('src', this.state.images[this.state.stepNumber % this.state.images.length]);


    }

    takePicturesfromCameras() {
        let scene = document.querySelector('a-scene');
        let renderer = scene.renderer;

        if (renderer == null) {
            return;
        }
        // let camera;
        let groupOfCameras = scene.object3D.getObjectByName("groupOfCameras");
        let groupOfLines = scene.object3D.getObjectByName("groupOfLines");

        if (groupOfCameras) {
            if (groupOfCameras.children.length > 0) {
                this.createImageFromCameras(scene, renderer, groupOfCameras, groupOfLines);
            }
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

    createImageFromCameras(scene, renderer, groupOfCameras, groupOfLines) {
        let that = this;
        let dataToSend = [];

        for (let i = 0; i < groupOfLines.children.length; i++) {
            renderer.render(scene.object3D, groupOfLines.children[i].userData.camera);
            let dataURL = renderer.domElement.toDataURL();
            dataToSend.push({
                key: 'Frame_' + that.state.stepNumber + groupOfLines.children[i].userData.name,
                value: dataURL
            });
        }

        // for (let i = 0; i < groupOfCameras.children.length; i++) {
        //     renderer.render(scene.object3D, groupOfCameras.children[i]);
        //     let dataURL = renderer.domElement.toDataURL();
        //     dataToSend.push({
        //         key: 'Frame_' + that.state.stepNumber + i,
        //         value: dataURL
        //     });
        //     // console.log(dataURL)
        // }
        this.sendImagesToServer(JSON.stringify(dataToSend));
    }

    sendImagesToServer(dataToSend) {
        const http = new XMLHttpRequest();
        http.open('POST', '/Images/');
        http.setRequestHeader('Content-type', 'application/json');
        http.send(dataToSend); // Make sure to stringify
    }

    loadDataFromServerAndRenderPoints() {
        let that = this;
        let request = new XMLHttpRequest();
        if (this.state.isReplay) {
            request.open('GET', '/dataStoredReplay/' + this.state.stepNumber, true);  // `false` makes the request synchronous
        } else {
            request.open('GET', '/dataStored/' + this.state.stepNumber, true);  // `false` makes the request synchronous
        }


        request.setRequestHeader('Content-Type', 'application/json');
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                console.log(request.response);
                that.props.lidarPoints = JSON.parse(request.response);
                that.renderPointsFromData();
                that.hideLoadingModal();
                if (!that.state.isReplay) {
                    that.getAndSendSelectedDataToBackend();
                }
            }
        };
        request.send(null);
    }

    renderPointsFromData() {
        let scene = document.querySelector('a-scene').object3D;
        let spheres = scene.getObjectByName("groupOfPoints");

        if (!spheres) {
            return;
        }

        let geometry = new THREE.SphereBufferGeometry(0.005, 5, 5);
        geometry.verticesNeedUpdate = true;
        let material = new THREE.MeshLambertMaterial({color: 0x39ff14});

        // let spheres = new THREE.Group();
        // spheres.name = "Spheres";

        let that = this;
        let thatPoints = this.props.lidarPoints;
        if (that.state.isReplay) {
            thatPoints = JSON.parse(thatPoints);
        }
        // console.log(thatPoints);

        for (let index in thatPoints) {
            if (that.state.isReplay) {
                let current = thatPoints[index];
                for (let innerOne in current) {
                    let value = current[innerOne];
                    if (innerOne.toLowerCase().indexOf("line") >= 0) {
                        that.createBorderAndRotate(value);
                        continue;
                    }
                    let sphere = new THREE.Mesh(geometry, material);
                    sphere.position.set(value.x, value.y, value.z);
                    spheres.add(sphere);
                }
                continue;
            }
            let value = thatPoints[index];
            let sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(value[0], value[2], -value[1]);
            spheres.add(sphere);
        }

        // Object.keys(this.state.lidarPoints).forEach(function (key) {
        //     //for replay only
        //     if (that.state.isReplay) {
        //         // let innerOne = thatPoints[key];
        //         // Object.keys(innerOne).forEach(function (keyInner) {
        //         //     if (keyInner.toLowerCase().indexOf("line") >= 0) {
        //         //         console.log(keyInner);
        //         //         that.createBorderAndRotate(innerOne[keyInner]);
        //         //         return;
        //         //     }
        //         //     let value = innerOne[keyInner];
        //         //     console.log(value);
        //         //     let sphere = new THREE.Mesh(geometry, material);
        //         //     sphere.position.set(value.x, value.y, value.z);
        //         //     spheres.add(sphere);
        //         // });
        //         let value = thatPoints[key];
        //         if (key.toLowerCase().indexOf("line") >= 0) {
        //             console.log(keyInner);
        //             that.createBorderAndRotate(value);
        //             return;
        //         }
        //         let sphere = new THREE.Mesh(geometry, material);
        //         sphere.position.set(value.x, value.y, value.z);
        //         spheres.add(sphere);
        //         return;
        //     }
        //     let value = thatPoints[key];
        //     let sphere = new THREE.Mesh(geometry, material);
        //     sphere.position.set(value[0], value[2], -value[1]);
        //     spheres.add(sphere);
        // });
        // this.state.spheres = spheres;
        // this.state.lidarPoints.forEach(function (key, value) {
        //     let sphere = new THREE.Mesh(geometry, material);
        //     sphere.position.set(value[0], value[1] + camera.y, value[2]);
        //     spheres.add(sphere);
        // });


        // scene.add(spheres);
    }

    createBorderAndRotate(line) {
        let lines = document.querySelector('a-scene').object3D.getObjectByName("groupOfLines");
        let borderLine = this.create3DLineBorder(line.xLength, line.yLength);
        borderLine.position.set(line.position.x, line.position.y, line.position.z);
        borderLine.rotation.set(line.rotationEuler._x, line.rotationEuler._y, line.rotationEuler._z);
        lines.add(borderLine);

    }

    create3DLineBorder(xLength, yLength) {
        var rectShape = new THREE.Shape();
        rectShape.moveTo(0, yLength);
        rectShape.lineTo(xLength, yLength);
        rectShape.lineTo(xLength, 0);
        rectShape.lineTo(0, 0);
        rectShape.lineTo(0, yLength);

        let geometry = new THREE.ShapeBufferGeometry(rectShape);
        let material = new THREE.LineBasicMaterial({color: 0xff00ff, linewidth: 2});
        return new THREE.Line(geometry, material);
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

    getAndSendSelectedDataToBackend() {
        const http = new XMLHttpRequest();
        http.open('POST', '/SelectedData/');
        http.setRequestHeader('Content-type', 'application/json');
        http.send(JSON.stringify(this.createFrustumForShapeAndGetData()));
    }

    createFrustumForShapeAndGetData() {
        let scene = document.querySelector('a-scene').object3D;
        let spheres = scene.getObjectByName("groupOfPoints");
        let lines = scene.getObjectByName('groupOfLines');
        let cameraPosition = new THREE.Vector3(0, 0.4, 0);
        let vec1, vec2, vec3, vec4, vec5, vec6, vec7, vec8, vec9, vec10, vec11, vec12;
        var plane1, plane2, plane3, plane4;
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
                vec2.y += line.userData.yLength;
                vec3 = cameraPosition.clone();
                plane1 = new THREE.Plane();
                plane1.setFromCoplanarPoints(vec1, vec2, vec3);
                let rotationMatrix = that.createRotationMatrix4AroudYAxis(Math.PI);
                plane1.applyMatrix4(rotationMatrix);


                vec4 = line.position.clone();
                vec5 = that.rotateVectorAndReturnPosition(new THREE.Vector3(line.userData.xLength, 0, 0), line);
                vec6 = cameraPosition.clone();
                plane2 = new THREE.Plane();
                plane2.setFromCoplanarPoints(vec4, vec5, vec6);

                vec7 = vec5.clone();
                vec8 = that.rotateVectorAndReturnPosition(new THREE.Vector3(line.userData.xLength, line.userData.yLength, 0), line);
                vec9 = cameraPosition.clone();
                plane3 = new THREE.Plane();
                plane3.setFromCoplanarPoints(vec7, vec8, vec9);

                vec10 = line.position.clone();
                vec10.y += line.userData.yLength;
                vec11 = vec8.clone();
                vec12 = cameraPosition.clone();
                plane4 = new THREE.Plane();
                plane4.setFromCoplanarPoints(vec10, vec11, vec12);
                plane4.normal.negate();


                // more like pyramid than frustum. Two planes are missing to be frustum
                let frustum = new CustomFrustum(plane1, plane2, plane3, plane4);

                //add line to result
                let lineForRecreation = {
                    position: line.position,
                    rotationEuler: line.rotation,
                    xLength: line.userData.xLength,
                    yLength: line.userData.yLength
                };
                let eachResult = {};
                eachResult.line = lineForRecreation;
                spheres.children.forEach(function (sphere) {
                    if (frustum.containsPoint(sphere.position)) {
                        eachResult[index] = sphere.position;
                        index++;
                    }
                });
                let name = 'LidarData_' + that.state.stepNumber + line.userData.name;
                console.log(eachResult);
                result[name] = eachResult;

            });

        }
        console.log(result);
        return result;

    }

    rotateVectorAndReturnPosition(vector, line) {
        let positionOfRotationCenter = line.position.clone();
        vector.applyEuler(line.rotation.clone());
        return positionOfRotationCenter.add(vector);
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

    render() {
        this.showLoadingModal();
        this.removeSpheres();
        this.makeBackroundIMG();
        // this.takePicturesfromCameras();
        this.loadDataFromServerAndRenderPoints();
        return (null);
    }
}

export default (lidarPoints)