/**
 * @fileoverview
 * This file imports all our required packages.
 * It also includes 3rd party A-Frame components.
 * Finally, it mounts the app to the root node.
 */

import 'aframe';
// import 'aframe-animation-component';
import 'aframe-event-set-component';
// import 'aframe-particle-system-component';
import './components/aframe-custom';
// import './components/aframe-environment';
// import './components/aframe-effects';
import {render, h} from 'preact';
import Main from './main';
import LidarPoints from './lidarPoints';
import CustomDragControls from './customDragControls.js';
// import * as dat from 'dat.gui'


var isFrameStopped = false;
var isDraggingControlEnabled = false;
var lastStepNumber = -1;

var scene;
var renderer;
var mainCamera;
var dragControls;
var raycaster = new THREE.Raycaster();

var line;
var lineObjects = [];
var additionalCamerasObjects = [];
var groupOfLines = new THREE.Group();
var groupOfPoints = new THREE.Group();
var groupOfCameras = new THREE.Group();
var material = new THREE.LineBasicMaterial({color: 0xff00ff, linewidth: 2});


document.addEventListener('DOMContentLoaded', () => {
    render(<Main/>, document.querySelector('#app'));
    THREE.DragControls = require("three-dragcontrols");
    window.CustomDragControls = CustomDragControls;

});

document.addEventListener('DOMContentLoaded', () => {
    render(<LidarPoints stepNumber={0}/>, document.querySelector('#lidarPoints'));
});

document.addEventListener('DOMContentLoaded', () => {
    const dat = require('dat.gui');
    const gui = new dat.GUI();
    var paint;
    var context = createDrawingCanvas();
    var startPointX;
    var startPointY;
    var endPointX;
    var endPointY;
    let variable = new guiFunction();
    scene = document.querySelector('a-scene');
    setUpScene();
    var drawingCanvas = document.getElementById('drawingCanvas');


    let stepNumber = gui.add(variable, 'stepNumber').min(0).max(220).step(1);

    stepNumber.onChange(function (value) {
        if (value === lastStepNumber) {
            return;
        }
        lastStepNumber = value;
        render(<LidarPoints stepNumber={value}/>, document.querySelector('#lidarPoints'));

    });

    let customContainer = document.querySelector('#my-gui-container');
    if (customContainer != null) customContainer.appendChild(gui.domElement);


    window.onkeydown = function (e) {
        if (!e) e = window.event;
        if (e.ctrlKey) {
            if (!isFrameStopped) {
                document.querySelector('#scatchPlane').setAttribute('visible', 'true');
                scene.pause();
                // document.addEventListener('mousedown', onMouseDown, false);

                isFrameStopped = true;
                drawingCanvas.style.visibility = 'visible';
                console.log(lineObjects);
                // console.log(groupOfLines);
                // console.log(groupOfCameras);
            }
        }
        if (e.altKey) {
            if (isFrameStopped) {
                document.querySelector('#scatchPlane').setAttribute('visible', 'false');
                // removeBorderPoints();
                // document.removeEventListener('mousedown', onMouseDown, false);
                isFrameStopped = false;
                scene.play();
                clearAndHideCanvas();
                // console.log(scene.object3D);
            }
        }
        if (e.shiftKey) {
            document.querySelector('#drawingCanvas').setAttribute('visible', 'false');
            if (isFrameStopped) {
                // if (groupOfPoints.children.length == 2) {
                //     makeBorder();
                //     document.querySelector('#scatchPlane').setAttribute('visible', 'false');
                //     removeBorderPoints();
                //     isFrameStopped = false;
                //     scene.play();
                // }
                if (endPointX != null && startPointX != null) {
                    makeBorder();
                    document.querySelector('#scatchPlane').setAttribute('visible', 'false');
                    isFrameStopped = false;
                    scene.play();
                    clearAndHideCanvas();
                }
            }
        }
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
    //
    // function removeBorderPoints() {
    //     for (let i = groupOfPoints.children.length; i >= 0; i--) {
    //         groupOfPoints.remove(groupOfPoints.children[i]);
    //     }
    // }
    //
    // function onMouseDown(evt) {
    //
    //     if (evt.which == 3) return;
    //     if (isFrameStopped) {
    //         let x = (event.clientX / window.innerWidth) * 2 - 1;
    //         let y = -(event.clientY / window.innerHeight) * 2 + 1;
    //
    //         // do not register if right mouse button is pressed.
    //
    //         var vNow = new THREE.Vector3(x, y, 0);
    //         vNow.unproject(document.querySelector('a-camera').object3D.children[2]);
    //         console.log(vNow.x + " " + vNow.y + " " + vNow.z);
    //         // splineArray.push(vNow);
    //         console.log(line);
    //
    //
    //         var geometry = new THREE.SphereGeometry(0.05, 4, 4);
    //         var material = new THREE.MeshBasicMaterial({color: 0xffff00});
    //         var sphere = new THREE.Mesh(geometry, material);
    //
    //         let length = Math.sqrt(vNow.x ** 2 + (vNow.y - 1.6) ** 2 + vNow.z ** 2);
    //         let scalingFactor = 1.5 / Math.abs(length);
    //         sphere.position.set(scalingFactor * vNow.x, scalingFactor * (vNow.y - 1.6) + 1.6, scalingFactor * vNow.z);
    //
    //         if (groupOfPoints.children.length == 2) {
    //             groupOfPoints.remove(groupOfPoints.children[0]);
    //         }
    //         groupOfPoints.add(sphere);
    // //         // scene.add(sphere);
    //     }
    // }

    document.querySelector('#drawingCanvas').addEventListener("mousedown", function (e) {
        paint = true;
        setEndpointToNull();
        setStartPoint(e);
        redraw();
    });
    document.querySelector('#drawingCanvas').addEventListener("mousemove", function (e) {
        if (paint) {
            setEndPoint(e);
            redraw();
        }
    });
    document.querySelector('#drawingCanvas').addEventListener("mouseup", function (e) {
        paint = false;
        setEndPoint(e);
        if (isPointsTooClose()) {
            setEndpointToNull();
            setStartpointToNull();
        }
        redraw();
    });
    document.querySelector('#drawingCanvas').addEventListener("mouseleave", function (e) {
        paint = false;
        setEndpointToNull();
        setStartpointToNull();
        redraw();
    });

    function redraw() {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
        context.strokeStyle = "#df4b26";
        context.lineJoin = "round";

        context.lineWidth = 5;
        if (endPointX) {
            drawLineAndRender(context, startPointX, startPointY, endPointX, startPointY);
            drawLineAndRender(context, endPointX, startPointY, endPointX, endPointY);
            drawLineAndRender(context, endPointX, endPointY, startPointX, endPointY);
            drawLineAndRender(context, startPointX, endPointY, startPointX, startPointY);
        }
    }

    function drawLineAndRender(context, startPointX, startPointY, endPointX, endPointY) {

        context.beginPath();
        context.moveTo(startPointX, startPointY);

        context.lineTo(endPointX, endPointY);
        context.closePath();
        context.stroke();

    }

    function setEndPoint(e) {
        endPointX = e.pageX;
        endPointY = e.pageY;
    }

    function setEndpointToNull() {
        endPointY = null;
        endPointX = null;
    }

    function setStartpointToNull() {
        startPointX = null;
        startPointY = null;
    }

    function setStartPoint(e) {
        startPointX = e.pageX;
        startPointY = e.pageY;
    }

    function isPointsTooClose() {
        let distance = Math.sqrt(Math.pow(startPointX - endPointX, 2) + Math.pow(startPointY - endPointY, 2));
        if (distance < 70) {
            return true;
        } else {
            return false
        }
    }

    function createDrawingCanvas() {
        var canvasDiv = document.getElementById('drawingCanvasDiv');
        var canvas = document.createElement('canvas');
        canvas.setAttribute('width', window.innerWidth);
        canvas.setAttribute('height', window.innerHeight);
        canvas.setAttribute('id', 'drawingCanvas');
        canvasDiv.appendChild(canvas);
        if (typeof G_vmlCanvasManager != 'undefined') {
            canvas = G_vmlCanvasManager.initElement(canvas);
        }
        return canvas.getContext("2d");
    }

    function clearAndHideCanvas() {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
        drawingCanvas.style.visibility = 'hidden';
    }


    // }
    // function setUpDrawing() {
    //     var geometry = new THREE.BufferGeometry();
    //     var material = new THREE.LineBasicMaterial( { color: 0xff0000, linewidth: 2 } );
    //     var positions = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
    //     geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    //     drawCount = 2; // draw the first 2 points, only
    //     geometry.setDrawRange( 0, drawCount );
    //
    //     line = new THREE.Line( geometry,  material );
    //     line.geometry.attributes.position.needsUpdate = true;
    //     document.querySelector('a-scene').object3D.add(line);
    //     updatePositions();
    // }
    // function updatePositions() {
    //
    //     var positions = line.geometry.attributes.position.array;
    //
    //     var index = 0;
    //
    //     for ( var i = 0; i < splineArray.length;  i ++ ) {
    //
    //         positions[ index ++ ] = splineArray[i].x;
    //         positions[ index ++ ] = splineArray[i].y;
    //         positions[ index ++ ] = splineArray[i].z;
    //
    //
    //     }
    // }

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
        console.log("before call");

        restructureSoStartIsInLeftTopCorner();

        console.log("after call");
        firstPoint = create3DPoint(startPointX, startPointY);
        secondPoint = create3DPoint(endPointX, endPointY);

        console.log(firstPoint);
        console.log(secondPoint);
        console.log(this);

        let xLength;
        let yLength;

        // yLength = new THREE.Vector3(firstPoint.x, secondPoint.y, firstPoint.z).length();
        // xLength = new THREE.Vector3(secondPoint.x, firstPoint.y, secondPoint.z).length();
        // // yLength = new THREE.Vector3(firstPoint.x, secondPoint.y, 0).length();
        // // xLength = new THREE.Vector3(secondPoint.x, firstPoint.y, 0).length();
        // // yLength = Math.abs(firstPoint.y) + Math.abs(secondPoint.y);
        // // xLength = Math.abs(firstPoint.x) + Math.abs(secondPoint.x);

        if (firstPoint.y < secondPoint.y) {
            yLength = new THREE.Vector3(firstPoint.x, secondPoint.y, firstPoint.z).length();
            xLength = new THREE.Vector3(secondPoint.x, firstPoint.y, secondPoint.z).length();
        } else {
            yLength = -(new THREE.Vector3(firstPoint.x, secondPoint.y, firstPoint.z).length());
            xLength = new THREE.Vector3(secondPoint.x, firstPoint.y, secondPoint.z).length();
        }


        var rectShape = new THREE.Shape();
        rectShape.moveTo(0, 0);
        rectShape.lineTo(0, yLength);
        rectShape.lineTo(xLength, yLength);
        rectShape.lineTo(xLength, 0);
        rectShape.lineTo(0, 0);

        let geometry = rectShape.createPointsGeometry();


        // let geometry = new THREE.Geometry();
        // geometry.vertices.push(firstPoint);
        // geometry.vertices.push(new THREE.Vector3(firstPoint.x, secondPoint.y, firstPoint.z));
        // geometry.vertices.push(secondPoint);
        // geometry.vertices.push(new THREE.Vector3(secondPoint.x, firstPoint.y, secondPoint.z));
        // geometry.vertices.push(firstPoint);

        let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
        camera.position.set(0, 0, 0);
        camera.lookAt(new THREE.Vector3((firstPoint.x + secondPoint.x) / 2, (firstPoint.y + secondPoint.y) / 2, (firstPoint.z + secondPoint.z) / 2));
        groupOfCameras.add(camera);
        additionalCamerasObjects.push(camera);

        let line = new THREE.Line(geometry, material);
        line.rotation.set(worldRotation._x, worldRotation._y, worldRotation._z);
        line.position.set(firstPoint.x, firstPoint.y, firstPoint.z);
        // line.frustumCulled = false;
        line.renderOrder = 1;
        line.userData = {camera: camera, xLength: xLength, yLength: yLength};
        groupOfLines.add(line);
        lineObjects.push(line);


        if (dragControls) {
            dragControls.dispose();
        }

        // dragControls = new THREE.DragControls(lineObjects, mainCamera, renderer.domElement);
        dragControls = new CustomDragControls(lineObjects, mainCamera, renderer.domElement);
        isDraggingControlEnabled = false;
        dragControls.deactivate();
        // dragControls.addEventListener( 'touchmove', function () {
        //     let worldRotation = document.querySelector('a-scene').camera.getWorldRotation();
        //     line.rotation.set( worldRotation._x, worldRotation._y, worldRotation._z );
        // })

    }

    function create3DPoint(screenX, screenY) {

        let x = (screenX / window.innerWidth) * 2 - 1;
        let y = -(screenY / window.innerHeight) * 2 + 1;
        let cameraYOffset = 0.4;

        let vNow = new THREE.Vector3(x, y, 0);
        vNow.unproject(document.querySelector('a-camera').object3D.children[2]);

        let length = Math.sqrt(vNow.x ** 2 + (vNow.y - cameraYOffset) ** 2 + vNow.z ** 2);
        let scalingFactor = 3 / Math.abs(length);
        return new THREE.Vector3((scalingFactor * vNow.x), ((scalingFactor * (vNow.y - cameraYOffset)) + cameraYOffset), (scalingFactor * vNow.z));
        // return {x:(scalingFactor * vNow.x),y: (scalingFactor * (vNow.y - 1.6) + 1.6),z: (scalingFactor * vNow.z)};
    }

    // this is to create two point corners but this create first point in left top corner and second right bottom
    function restructureSoStartIsInLeftTopCorner() {
        let temp;

        if (startPointX < endPointX && startPointY > endPointY) {
            temp = startPointY;
            startPointY = endPointY;
            endPointY = temp;

        } else if (startPointX > endPointX && startPointY < endPointY) {
            temp = endPointX;
            endPointX = startPointX;
            startPointX = temp;
        } else if (startPointX > endPointX && startPointY > endPointY) {
            temp = endPointX;
            endPointX = startPointX;
            startPointX = temp;
            temp = endPointY;
            endPointY = startPointY;
            startPointY = temp;
        }

        console.log("inside call");
    }
});

var guiFunction = function () {
    this.stepNumber = 0;
    this.rotationValue = 0;
    this.oldRotationValue = 0;
};





