/**
 * @fileoverview
 * This is our main A-Frame application.
 * It defines the main A-Frame Scene which gets mounted root div.
 */

import {Component, h} from 'preact';
import {Entity, Scene} from 'aframe-react';
import 'react';


var THREE = require('three');


const COLORS = ['#D92B6A', '#9564F2', '#FFCF59'];

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    lidarPoints: Array(360)
                }
            ],
            stepNumber: 0,
            maximumStepNumber: 0,

        };
    }

    componentDidMount() {
        fetch('http://127.0.0.1:8000/datastored')
            .then(response => response.json())
            .then(data => {
                for (var i = 0; i < data.length; i++) {
                    this.state.history = this.state.history.concat([
                        {
                            lidarPoints: data[i]
                        }
                    ]);
                }
                this.state.maximumStepNumber = i;
            });
    }

    jumpTo(step) {
        if (this.state.stepNumber != step) {
            this.setState({
                stepNumber: step
            });
        }
    }


    render() {


        return (
            <Scene vr-mode-ui="enabled: false">
                <a-assets>
                    <img crossOrigin id="groundTexture" src="img/floor.jpg"/>
                    <img crossOrigin id="skyTexture" src="img/sky.jpg"/>
                </a-assets>

                <Entity
                    primitive="a-sky"
                    height="2048"
                    radius="30"
                    src="#skyTexture"
                    theta-length="90"
                    width="2048"
                />
                <Entity
                    primitive="a-plane"
                    src="#groundTexture"
                    rotation="-90 0 0"
                    height="100"
                    width="100"
                />
                <Entity primitive="a-camera" look-controls wasd-controls-enabled="false">
                    <Entity
                        primitive="a-cursor"
                        cursor={{fuse: false}}
                        material={{color: 'white', shader: 'flat', opacity: 1.75}}
                        geometry={{radiusInner: 0.005, radiusOuter: 0.007}}
                    />
                </Entity>
                <Entity
                    id="lidarSpheres"
                    spheresarray={{}}
                    primitive="a-sphere"
                    radius={0}
                    position={{x: 0.0, y: 0.0, z: 0.0}}
                />
                <a-entity oculus-touch-controls x-button-listener id="refresh-button" geometry="primitive: box"
                          material="color: red" position="-2 0 -2"></a-entity>
            </Scene>
        )
    }
}

function f() {

    var base = "<Entity primitive='a-sphere' color=\"green\" position=\"";
    var end = "\" radius=\"0.2\"/>  <a-sphere color=\"blue\" material=\"\" position=\"\" radius=\"0.2\" geometry=\"\" rotation=\"\" scale=\"\" visible=\"\"></a-sphere>";
    var result = "";
    for (let i = 0; i < 3; i++) {
        result += "<a-sphere color=\"blue\" material=\"\" position=\"" + 6 + i + " " + 0 + " " + -3 + "\" radius=\"0.2\" geometry=\"\" rotation=\"\" scale=\"\" visible=\"\"></a-sphere>";
    }
    console.log(result);
    return JSON.stringify(result);


}

class myScene extends Component {
    constructor() {
        super()

        // We'll use this state later on in the tutorial
        this.state = {
            colorIndex: 0,
            spherePosition: {x: 0.0, y: 0, z: 0.0}
        }
    }

    render() {
        return (
            <Scene vr-mode-ui="enabled: false">
                <a-assets>
                    <img crossOrigin id="groundTexture" src="img/floor.jpg"/>
                    <img crossOrigin id="skyTexture" src="img/sky.jpg"/>
                </a-assets>

                <Entity
                    primitive="a-sky"
                    height="2048"
                    radius="30"
                    src="#skyTexture"
                    theta-length="90"
                    width="2048"
                />
                <Entity
                    primitive="a-plane"
                    src="#groundTexture"
                    rotation="-90 0 0"
                    height="100"
                    width="100"
                />
                <Entity primitive="a-camera" look-controls wasd-controls-enabled="false">
                    <Entity
                        primitive="a-cursor"
                        cursor={{fuse: false}}
                        material={{color: 'white', shader: 'flat', opacity: 1.75}}
                        geometry={{radiusInner: 0.005, radiusOuter: 0.007}}
                    />
                </Entity>
                {/*<Entity*/}
                {/*id="lidarSpheres"*/}
                {/*lowpoly={{*/}
                {/*color: '#D92B6A',*/}
                {/*nodes: true,*/}
                {/*opacity: 0.15,*/}
                {/*wireframe: true*/}
                {/*}}*/}
                {/*primitive="a-sphere"*/}
                {/*detail={2}*/}
                {/*radius={2}*/}
                {/*position={{ x: 0.0, y: 4, z: -10.0 }}*/}
                {/*color="#FAFAF1"*/}
                {/*/>*/}
                <Entity
                    id="lidarSpheres"
                    spheresarray={{}}
                    primitive="a-sphere"
                    radius={0}
                    position={{x: 0.0, y: 0.0, z: 0.0}}
                />
                {/*<Entity myspheres*/}
                {/*position={{ x: 0.0, y: 4, z: -10.0 }}*/}
                {/*/>*/}
                {/*<Entity primitive='a-sphere' color="yellow" position="-4 0 -3" radius="0.2"/>*/}
                <a-entity oculus-touch-controls x-button-listener id="refresh-button" geometry="primitive: box"
                          material="color: red" position="-2 0 -2"></a-entity>
            </Scene>
        )
    }
}


class basicScene extends Component {
    constructor() {
        super()
    }

    render() {
        return (
            <Scene vr-mode-ui="enabled: false">
                {/*<a-assets>*/}
                {/*<img crossOrigin id="groundTexture" src="img/floor.jpg" />*/}
                {/*<img crossOrigin id="skyTexture" src="img/sky.jpg" />*/}
                {/**/}
                {/*</a-assets>*/}

                <Entity
                    primitive="a-sky"
                    height="2048"
                    radius="30"
                    src="/static/dist/img/360IMGStreet.jpg"
                    // theta-length="90"
                    width="2048"

                />
                {/*<Entity*/}
                {/*primitive="a-plane"*/}
                {/*src="#groundTexture"*/}
                {/*rotation="-90 0 0"*/}
                {/*height="100"*/}
                {/*width="100"*/}
                {/*/>*/}
                <Entity primitive="a-camera"
                        camera="active: true"
                        look-controls
                        position={{x: 0.0, y: 0.4, z: 0.0}}
                    // wasd-controls-enabled="false"
                >
                    <Entity
                        primitive="a-cursor"
                        cursor={{fuse: false}}
                        material={{color: 'white', shader: 'flat', opacity: 2.75}}
                        geometry={{radiusInner: 0.005, radiusOuter: 0.007}}
                    />
                    <Entity id={'scatchPlane'} primitive="a-plane" width={4} height={2} position={{z: -1.5}}
                            material={{color: 'transparent', wireframe: true}} visible={false}></Entity>
                    {/*<Entity id={'scatchPlane1'} planeComp={{}} primitive="a-plane" width={4} height={2} position={{z:-1.5}} material={{color: 'transparent', wireframe: true}} visible={false}></Entity>*/}
                </Entity>
                <Entity id="lidarPoints"/>
                <a-entity oculus-touch-controls x-button-listener id="refresh-button" geometry="primitive: box"
                          material="color: red" position="-2 0 -2"></a-entity>
            </Scene>
        )
    }
}


export default basicScene

