/**
 * @fileoverview
 * This file imports all our required packages.
 * It also includes 3rd party A-Frame components.
 * Finally, it mounts the app to the root node.
 */

import 'aframe';
import './components/aframe-custom';
import {render, h} from 'preact';
import Main from './main';
import LidarPoints from './lidarPoints';
import CustomDragControls from './customDragControls.js';
import CustomDrawing from './customDrawing.js';


var isFrameStopped = false;
var isDraggingControlEnabled = false;
var lastStepNumber = 0;
var selectionCounter = 0;

var scene;
var renderer;
var mainCamera;
var dragControls;
var raycaster = new THREE.Raycaster();
var plane = new THREE.Plane();

var mouse = new THREE.Vector2();
var lineObjects = [];
var additionalCamerasObjects = [];
var groupOfLines = new THREE.Group();
var groupOfPoints = new THREE.Group();
var groupOfCameras = new THREE.Group();
var material = new THREE.LineBasicMaterial({color: 0xff00ff, linewidth: 2});


document.addEventListener('DOMContentLoaded', () => {
    render(<Main/>, document.querySelector('#app'));
});

document.addEventListener('DOMContentLoaded', () => {
    render(<LidarPoints stepNumber={0} maxStepNumber={220}/>, document.querySelector('#lidarPoints'));
});

document.addEventListener('DOMContentLoaded', () => {
    scene = document.querySelector('a-scene');
    setUpScene();
    var customDrawing = new CustomDrawing();
    window.addEventListener('resize', function () {
        document.getElementById("drawingCanvasDiv").innerHTML = '';
        customDrawing = new CustomDrawing();
    });

    window.onkeydown = function (e) {
        if (!e) e = window.event;
        if (e.ctrlKey) {
            if (!isFrameStopped) {
                document.querySelector('#scatchPlane').setAttribute('visible', 'true');
                scene.pause();

                isFrameStopped = true;
                customDrawing.showDrawingCanvas();
            }
        }
        if (e.altKey) {
            if (isFrameStopped) {
                document.querySelector('#scatchPlane').setAttribute('visible', 'false');
                isFrameStopped = false;
                scene.play();
                customDrawing.clearAndHideCanvas();
            }
        }
        if (e.shiftKey) {
            document.querySelector('#drawingCanvas').setAttribute('visible', 'false');
            if (isFrameStopped) {
                if (customDrawing.endPointX != null && customDrawing.startPointX != null) {
                    makeBorder();
                    document.querySelector('#scatchPlane').setAttribute('visible', 'false');
                    isFrameStopped = false;
                    scene.play();
                    customDrawing.clearAndHideCanvas();
                }
            }
        }
        // moving selections 'M'
        if (e.which === 77) {
            if (dragControls) {
                if (isDraggingControlEnabled) {
                    dragControls.deactivate();
                    isDraggingControlEnabled = false;
                } else {
                    dragControls.activate();
                    isDraggingControlEnabled = true;
                }
            }
        }

    };


    function setUpScene() {
        groupOfLines.name = 'groupOfLines';
        groupOfPoints.name = 'groupOfPoints';
        groupOfCameras.name = 'groupOfCameras';
        scene.object3D.add(groupOfLines);
        scene.object3D.add(groupOfPoints);
        scene.object3D.add(groupOfCameras);
        document.querySelector('a-camera').setAttribute("position", "0 0.4 0");
    }

    //from 2 poitns make rectangle
    function makeBorder() {

        scene = document.querySelector('a-scene');
        renderer = scene.renderer;
        mainCamera = scene.camera;
        let worldRotation = mainCamera.getWorldRotation();

        let firstPoint;
        let secondPoint;

        customDrawing.restructureSoStartIsInLeftTopCorner();

        firstPoint = create3DPoint(customDrawing.startPointX, customDrawing.startPointY);
        secondPoint = createSecondPointFromPlane(customDrawing.endPointX, customDrawing.endPointY, firstPoint);


        let xLength;
        let yLength;

        if (firstPoint.y < secondPoint.y) {
            yLength = new THREE.Vector3(firstPoint.x, secondPoint.y, firstPoint.z).length();
            xLength = new THREE.Vector3(secondPoint.x, firstPoint.y, secondPoint.z).length();
        } else {
            yLength = -(firstPoint.distanceTo(new THREE.Vector3(firstPoint.x, secondPoint.y, firstPoint.z)));
            xLength = firstPoint.distanceTo(new THREE.Vector3(secondPoint.x, firstPoint.y, secondPoint.z));
        }


        let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
        camera.position.set(0, 0.4, 0);
        camera.lookAt(new THREE.Vector3((firstPoint.x + secondPoint.x) / 2, (firstPoint.y + secondPoint.y) / 2, (firstPoint.z + secondPoint.z) / 2));
        groupOfCameras.add(camera);
        additionalCamerasObjects.push(camera);

        let line = create3DLine(xLength, yLength);
        line.rotation.set(worldRotation._x, worldRotation._y, worldRotation._z);
        line.position.set(firstPoint.x, firstPoint.y, firstPoint.z);
        line.renderOrder = 1;
        line.userData = {camera: camera, xLength: xLength, yLength: yLength, name: '_Selection_' + selectionCounter};
        selectionCounter += 1;
        groupOfLines.add(line);
        lineObjects.push(line);


        if (dragControls) {
            dragControls.dispose();
        }

        dragControls = new CustomDragControls(lineObjects, mainCamera, renderer.domElement);
        isDraggingControlEnabled = false;
        dragControls.deactivate();
    }

    function create3DLine(xLength, yLength) {
        var rectShape = new THREE.Shape();
        rectShape.moveTo(0, yLength);
        rectShape.lineTo(xLength, yLength);
        rectShape.lineTo(xLength, 0);
        rectShape.lineTo(0, 0);
        rectShape.lineTo(0, yLength);

        let geometry = new THREE.ShapeBufferGeometry(rectShape);
        return new THREE.Line(geometry, material);
    }

    function createSecondPointFromPlane(screenX, screenY, firstpoint) {
        mouse.x = (screenX / window.innerWidth) * 2 - 1;
        mouse.y = -(screenY / window.innerHeight) * 2 + 1;
        var result = new THREE.Vector3();

        raycaster.setFromCamera(mouse, mainCamera);
        plane.setFromNormalAndCoplanarPoint(mainCamera.getWorldDirection(plane.normal), firstpoint);
        raycaster.ray.intersectPlane(plane, result);
        return result;
    }

    function create3DPoint(screenX, screenY) {

        let x = (screenX / window.innerWidth) * 2 - 1;
        let y = -(screenY / window.innerHeight) * 2 + 1;
        let cameraYOffset = 0.4;

        let vNow = new THREE.Vector3(x, y, 0);
        vNow.unproject(mainCamera);

        let length = Math.sqrt(vNow.x ** 2 + (vNow.y - cameraYOffset) ** 2 + vNow.z ** 2);
        let scalingFactor = 3 / Math.abs(length);
        return new THREE.Vector3((scalingFactor * vNow.x), ((scalingFactor * (vNow.y - cameraYOffset)) + cameraYOffset), (scalingFactor * vNow.z));
    }
});



