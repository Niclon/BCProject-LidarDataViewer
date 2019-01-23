import {Component,h} from 'preact'
import 'react'

const dat = require('dat.gui');
const gui = new dat.GUI();

class lidarPointsWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lidarData: [
                {
                    lidarPoints: null
                }
            ],
            stepNumber: props.stepNumber,
            maximumStepNumber: 0,

        };

    }

    // componentDidMount() {
    //     fetch('http://127.0.0.1:8000/datastored')
    //         .then(response => response.json())
    //         .then(data => {
    //             for (var i = 0; i < data.length; i++) {
    //                 this.state.lidarData = this.state.lidarData.concat([
    //                     {
    //                         lidarPoints: data[i]
    //                     }
    //                 ]);
    //             }
    //             this.state.maximumStepNumber = i;
    //         });
    //
    // }
    pinToUI() {


        var customContainer = document.querySelector('#my-gui-container');
        if (customContainer != null) customContainer.appendChild(gui.domElement);
    }

    removeSpheres() {
        let scenel = document.querySelector('a-scene').object3D;
        let selectedObject = scenel.getObjectByName("Spheres");
        scenel.remove(selectedObject);
    }

    render() {
        this.removeSpheres();

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
        return (null);
    }
}

var params = function () {
    this.stepNumber = 0;
    this.rotation = 0;
};

export default lidarPointsWrapper
