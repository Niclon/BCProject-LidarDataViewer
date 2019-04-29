import {Component, h} from 'preact';
import {Entity, Scene} from 'aframe-react';


class basicScene extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Scene vr-mode-ui="enabled: false">
                <Entity primitive="a-camera"
                        camera="active: true"
                        look-controls
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
                </Entity>
                <Entity id="lidarPoints"/>
            </Scene>
        )
    }
}


export default basicScene

