import 'aframe';
import './components/aframe-custom';
import {render, h} from 'preact';
import Main from './main';
import LidarPoints from './lidarPoints';
import CustomDrawing from './customDrawing.js';
import CustomSelection from "./customSelection";


var scene;
var groupOfLines = new THREE.Group();
var groupOfPoints = new THREE.Group();
var groupOfCameras = new THREE.Group();

document.addEventListener('DOMContentLoaded', () => {
    render(<Main/>, document.querySelector('#app'));
});

document.addEventListener('DOMContentLoaded', () => {
    render(<LidarPoints stepNumber={0} maxStepNumber={220}/>, document.querySelector('#lidarPoints'));
});

document.addEventListener('DOMContentLoaded', () => {

    setUpScene();
    var customDrawing = new CustomDrawing();
    var customSelection = new CustomSelection({
        customDrawing: customDrawing,
        scene: scene,
        groupOfCameras: groupOfCameras,
        groupOfLines: groupOfLines
    });
    window.addEventListener('resize', function () {
        document.getElementById("drawingCanvasDiv").innerHTML = '';
        customDrawing = new CustomDrawing();
        customSelection.customDrawing = customDrawing;
    });


    function setUpScene() {
        scene = document.querySelector('a-scene');
        groupOfLines.name = 'groupOfLines';
        groupOfPoints.name = 'groupOfPoints';
        groupOfCameras.name = 'groupOfCameras';
        scene.object3D.add(groupOfLines);
        scene.object3D.add(groupOfPoints);
        scene.object3D.add(groupOfCameras);
        document.querySelector('a-camera').setAttribute("position", "0 0.4 0");
    }


});



