/**
 * @fileoverview
 * This file imports all our required packages.
 * It also includes 3rd party A-Frame components.
 * Finally, it mounts the app to the root node.
 */

import 'aframe'
import 'aframe-animation-component'
import 'aframe-event-set-component'
import 'aframe-particle-system-component'
import './components/aframe-custom'
import './components/aframe-environment'
import './components/aframe-effects'
import {render} from 'preact'
import Main from './main'
import LidarPoints from './lidarPoints'
// import * as dat from 'dat.gui'

var isFrameStopped = false;

var line;
var scene;
var groupOfLines = new THREE.Group();
var groupOfPoints = new THREE.Group();
var groupOfCameras = new THREE.Group();
var material = new THREE.LineBasicMaterial({color: 0xff00ff, linewidth: 2});


document.addEventListener('DOMContentLoaded', () => {
    render(<Main/>, document.querySelector('#app'))

});

document.addEventListener('DOMContentLoaded', () => {
    render(<LidarPoints stepNumber={0}/>, document.querySelector('#lidarPoints'));
});

document.addEventListener('DOMContentLoaded', () => {
    const dat = require('dat.gui');
    const gui = new dat.GUI();
    let variable = new guiFunction();
    scene = document.querySelector('a-scene');
    setUpScene();


    // may be usefull document.querySelector('#my-gui-container').firstChild.children[1].children[1].firstChild.children[1].firstChild.firstChild.value
    let stepNumber = gui.add(variable, 'stepNumber').min(0).max(100).step(1);
    let rotationValue = gui.add(variable, 'rotationValue').min(-1).max(1).step(0.01);

    rotationValue.onChange(function (value) {
        let help;
        if (value > variable.oldRotationValue) {
            help = value - variable.oldRotationValue;
            help = help / 0.1;
            document.querySelector('a-camera').object3D.rotation.y += help * 0.2;
        } else if (value < variable.oldRotationValue) {
            help = variable.oldRotationValue - value;
            help = help / 0.1;
            document.querySelector('a-camera').object3D.rotation.y -= help * 0.2;
        }
        variable.oldRotationValue = value;
    });

    stepNumber.onChange(function (value) {
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
                // setUpDrawing();
                document.addEventListener('mousedown', onMouseDown, false);
//test
//                 window.addEventListener( 'mousemove', onMouseMove, false );

                // console.log("ctrl key down");
                isFrameStopped = true;
            }
        }
        if (e.altKey) {
            if (isFrameStopped) {
                document.querySelector('#scatchPlane').setAttribute('visible', 'false');
                removeBorderPoints();
                document.removeEventListener('mousedown', onMouseDown, false);
                isFrameStopped = false;
                scene.play();
                // console.log(scene.object3D);
            }
        }
        if (e.shiftKey) {
            document.querySelector('#drawingCanvas').setAttribute('visible', 'false');
            if (isFrameStopped) {
                if (groupOfPoints.children.length == 2) {
                    makeBorder();
                    document.querySelector('#scatchPlane').setAttribute('visible', 'false');
                    removeBorderPoints();
                    isFrameStopped = false;
                    scene.play();
                }
            }
        }

    };

    function removeBorderPoints() {
        for (let i = groupOfPoints.children.length; i >= 0; i--) {
            groupOfPoints.remove(groupOfPoints.children[i]);
        }
    }

    function onMouseDown(evt) {

        if (evt.which == 3) return;
        if (isFrameStopped) {
            let x = (event.clientX / window.innerWidth) * 2 - 1;
            let y = -(event.clientY / window.innerHeight) * 2 + 1;

            // do not register if right mouse button is pressed.

            var vNow = new THREE.Vector3(x, y, 0);
            vNow.unproject(document.querySelector('a-camera').object3D.children[2]);
            console.log(vNow.x + " " + vNow.y + " " + vNow.z);
            // splineArray.push(vNow);
            console.log(line);


            var geometry = new THREE.SphereGeometry(0.05, 4, 4);
            var material = new THREE.MeshBasicMaterial({color: 0xffff00});
            var sphere = new THREE.Mesh(geometry, material);

            let length = Math.sqrt(vNow.x ** 2 + (vNow.y - 1.6) ** 2 + vNow.z ** 2);
            let scalingFactor = 1.5 / Math.abs(length);
            // console.log(scalingFactor);
            // console.log(scalingFactor* vNow.z);
            // console.log(scalingFactor* (vNow.y-1.6));
            // console.log(scalingFactor* vNow.x);
            sphere.position.set(scalingFactor * vNow.x, scalingFactor * (vNow.y - 1.6) + 1.6, scalingFactor * vNow.z);

            if (groupOfPoints.children.length == 2) {
                groupOfPoints.remove(groupOfPoints.children[0]);
            }
            groupOfPoints.add(sphere);
            // scene.add(sphere);
        }
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
    }

    //from 2 poitns make rectangle
    function makeBorder() {
        let geometry = new THREE.Geometry();
        let firstPoint = groupOfPoints.children[0].position;
        let secondPoint = groupOfPoints.children[1].position;

        // console.log(geometry);
        geometry.vertices.push(firstPoint);
        geometry.vertices.push(new THREE.Vector3(firstPoint.x, secondPoint.y, firstPoint.z));
        geometry.vertices.push(secondPoint);
        geometry.vertices.push(new THREE.Vector3(secondPoint.x, firstPoint.y, secondPoint.z));
        geometry.vertices.push(firstPoint);

        let line = new THREE.Line(geometry, material);
        // line.frustumCulled = false;
        line.renderOrder = 1;
        groupOfLines.add(line);
        let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
        camera.position.set(0, 1.6, 0);
        camera.lookAt(new THREE.Vector3((firstPoint.x + secondPoint.x) / 2, (firstPoint.y + secondPoint.y) / 2, (firstPoint.z + secondPoint.z) / 2));
        groupOfCameras.add(camera);

    }
});

var guiFunction = function () {
    this.stepNumber = 0;
    this.rotationValue = 0;
    this.oldRotationValue = 0;
};





