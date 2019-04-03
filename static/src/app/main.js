/**
 * @fileoverview
 * This is our main A-Frame application.
 * It defines the main A-Frame Scene which gets mounted root div.
 */

import {Component, h} from 'preact';
import {Entity, Scene} from 'aframe-react';
import 'react';

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

                {/*<Entity*/}
                {/*primitive="a-sky"*/}
                {/*height="2048"*/}
                {/*radius="30"*/}
                {/*src="/static/dist/img/360IMGStreet.jpg"*/}
                {/*// theta-length="90"*/}
                {/*width="2048"*/}

                {/*/>*/}
                {/*<a-entity material="src: '/static/dist/img/360IMGStreet.jpg'; side: back; shader: flat"*/}
                {/*geometry="primitive: sphere; radius: 5000; segmentsWidth: 64; segmentsHeight: 32">*/}
                {/*</a-entity>*/}
                <Entity
                    primitive="a-sphere"
                    src="/static/dist/img/360IMGStreet.jpg"
                    material={{side: 'back', shader: 'flat'}}
                    geometry={{radius: 5000, segmentsWidth: 64, segmentsHeight: 32}}
                />
                <Entity primitive="a-camera"
                        camera="active: true"
                        look-controls
                    // position="0 0.4 0"
                        position={{x: 0, y: 0.4, z: 0}}
                        wasd-controls-enabled="false"
                >
                    <Entity
                        primitive="a-cursor"
                        cursor={{fuse: false}}
                        material={{color: 'white', shader: 'flat', opacity: 2.75}}
                        geometry={{radiusInner: 0.005, radiusOuter: 0.007}}
                    />
                    <Entity id={'scatchPlane'} primitive="a-plane" width={4} height={2} position="0 0 -1.5"
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

