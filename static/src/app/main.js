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
                        position="0 0.4 0"
                    // wasd-controls-enabled="false"
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

