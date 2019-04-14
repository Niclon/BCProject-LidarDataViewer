import 'aframe';
import 'aframe-event-set-component';
import './components/aframe-custom';
import {render, h} from 'preact';
import Main from './main';
import LidarPoints from './lidarPoints';

var lastStepNumber = -1;
var groupOfLines = new THREE.Group();
var groupOfPoints = new THREE.Group();

document.addEventListener('DOMContentLoaded', () => {
    render(<Main/>, document.querySelector('#app'));
});

document.addEventListener('DOMContentLoaded', () => {
    render(<LidarPoints stepNumber={0} isReplay={true}/>, document.querySelector('#lidarPoints'));
    const dat = require('dat.gui');
    const gui = new dat.GUI();
    let variable = new guiFunction();
    let stepNumber = gui.add(variable, 'stepNumber').min(0).max(220).step(1);

    stepNumber.onChange(function (value) {
        if (value === lastStepNumber) {
            return;
        }
        lastStepNumber = value;
        render(<LidarPoints stepNumber={value} isReplay={true}/>, document.querySelector('#lidarPoints'));

    });

    let customContainer = document.querySelector('#my-gui-container');
    if (customContainer != null) {
        customContainer.appendChild(gui.domElement);
    }
    setUpScene();
});


var guiFunction = function () {
    this.stepNumber = 0;
    this.rotationValue = 0;
    this.oldRotationValue = 0;
};

function setUpScene() {
    let scene = document.querySelector('a-scene');
    groupOfLines.name = 'groupOfLines';
    groupOfPoints.name = 'groupOfPoints';
    scene.object3D.add(groupOfLines);
    scene.object3D.add(groupOfPoints);
    document.querySelector('a-camera').setAttribute("position", "0 0.4 0");
}
