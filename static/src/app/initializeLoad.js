import 'aframe';
import 'aframe-event-set-component';
import './components/aframe-custom';
import {render, h} from 'preact';
import Main from './main';
import LidarPoints from './lidarPoints';

var groupOfLines = new THREE.Group();
var groupOfPoints = new THREE.Group();

document.addEventListener('DOMContentLoaded', () => {
    render(<Main/>, document.querySelector('#app'));
});

document.addEventListener('DOMContentLoaded', () => {
    render(<LidarPoints stepNumber={0} isReplay={true} maxStepNumber={220}/>, document.querySelector('#lidarPoints'));
    setUpScene();
});

function setUpScene() {
    let scene = document.querySelector('a-scene');
    groupOfLines.name = 'groupOfLines';
    groupOfPoints.name = 'groupOfPoints';
    scene.object3D.add(groupOfLines);
    scene.object3D.add(groupOfPoints);
    document.querySelector('a-camera').setAttribute("position", "0 0.4 0");
}
