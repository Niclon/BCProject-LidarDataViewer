/**
 * @fileoverview
 * This is our custom A-Frame component.
 * It is responsible for adding the outer wireframe mesh
 * and nodes to its vertices.
 */
//
// AFRAME.registerComponent('lowpoly', {
//   schema: {},
//
//   init: function() {
//     // Get the ref of the object to which the component is attached
//     const obj = this.el.getObject3D('mesh')
//
//     // Grab the reference to the main WebGL scene
//     const scene = document.querySelector('a-scene').object3D
//   },
//
//   update: function() {
//     // Get the ref of the object to which the component is attached
//     const obj = this.el.getObject3D('mesh')
//   }
// })

AFRAME.registerComponent('log', {
    schema: {type: 'string'},

    init: function () {
        var stringToLog = this.data;
        console.log(stringToLog);
    }
});


// var sceneEl = document.querySelector('a-scene');
// console.log(sceneEl);
// var entityEl0 = document.createElement('a-entity');


AFRAME.registerComponent('myspheres', {

    init: function () {
        var sceneEl = document.querySelector('a-scene');
        var entityEl = document.createElement('a-entity');
        entityEl.setAttribute('primitive', 'a-sphere');
        entityEl.setAttribute('color', 'blue');
        entityEl.setAttribute('position', '"-4 0 -3"');
        entityEl.setAttribute('radius', '0.3');
        sceneEl.appendChild(entityEl);
    }
});
AFRAME.registerComponent('do-something-once-loaded', {
    init: function () {
        // This will be called after the entity has properly attached and loaded.
        console.log('I am ready!');
    }
});
//
// entityEl0.setAttribute('do-something-once-loaded', '');
// sceneEl.appendChild(entityEl0);

AFRAME.registerComponent('lowpoly', {
    schema: {
        // Here we define our properties, their types and default values
        color: {type: 'string', default: '#FFF'},
        nodes: {type: 'boolean', default: false},
        opacity: {type: 'number', default: 1.0},
        wireframe: {type: 'boolean', default: false},
        spheres: {type: 'array'}

    },

    // remove: function () {
    //     // Remove Object3D.
    //     console.log(this.el);
    //     // this.el.removeObject3D('#lidarSpheres');
    //     this.el.parentNode.removeChild(sceneel.querySelectorAll("#lidarSpheres")[0]);
    //     // this.el.removeObject3D(sceneel.querySelectorAll("#lidarSpheres")[0])
    //
    // },

    init: function () {
        const obj = this.el.getObject3D('mesh');

        // Grab the reference to the main WebGL scene
        const scene = document.querySelector('a-scene').object3D;

        obj.material = new THREE.MeshPhongMaterial({
            color: this.data.color,
            shading: THREE.FlatShading
        })

        // Define the geometry for the outer wireframe
        const frameGeom = new THREE.OctahedronGeometry(2.5, 2);

        // Define the material for it
        const frameMat = new THREE.MeshPhongMaterial({
            color: '#FFFFFF',
            opacity: this.data.opacity,
            transparent: true,
            wireframe: true
        })

        // The final mesh is a composition of the geometry and the material
        const icosFrame = new THREE.Mesh(frameGeom, frameMat);

        // Set the position of the mesh to the position of the sphere
        const {x, y, z} = obj.parent.position;
        icosFrame.position.set(x, y, z);

        // If the wireframe prop is set to true, then we attach the new object
        if (this.data.wireframe) {
            scene.add(icosFrame)
        }

        // If the nodes attribute is set to true
        if (this.data.nodes) {
            let spheres = new THREE.Group();
            let vertices = icosFrame.geometry.vertices;

            // Traverse the vertices of the wireframe and attach small spheres
            for (var i in vertices) {
                // Create a basic sphere
                let geometry = new THREE.SphereGeometry(0.045, 16, 16);
                let material = new THREE.MeshBasicMaterial({
                    color: '#FFFFFF',
                    opacity: this.data.opacity,
                    shading: THREE.FlatShading,
                    transparent: true
                })

                let sphere = new THREE.Mesh(geometry, material);
                // Reposition them correctly
                sphere.position.set(
                    vertices[i].x,
                    vertices[i].y + 4,
                    vertices[i].z + -10.0
                )

                spheres.add(sphere)
            }

            scene.add(spheres)
        }
        let spheres = new THREE.Group();
        var geometry = new THREE.SphereGeometry(0.2, 8, 8);
        var material = new THREE.MeshBasicMaterial({color: 0xffff00});
        var sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(0, 0, -2);
        spheres.add(sphere);
        var geometry = new THREE.SphereGeometry(0.2, 8, 8);
        var material = new THREE.MeshBasicMaterial({color: 0xffff00});
        var sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(0, 0, -4);
        spheres.add(sphere);
        this.el.setObject3D('spheres', spheres);
        scene.add(spheres);
    }

})
AFRAME.registerComponent('spheresarray', {
    schema: {
        // Here we define our properties, their types and default values
    },

    init: function () {
        const scene = document.querySelector('a-scene').object3D;
        let camera = {x: 0, y: 2, z: 0};
        let spheres = new THREE.Group();
        spheres.name = "Spheres";

        let geometry = new THREE.SphereGeometry(0.005, 4, 4);
        let material = new THREE.MeshBasicMaterial({color: 0x39ff14});

        let myDistanceForTesting = 3;
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


        console.log("just created");
        scene.add(spheres);
        console.log(scene);
    },


}),
    AFRAME.registerComponent('x-button-listener', {
        init: function () {
            var el = this.el;
            el.addEventListener('click', function () {
                let scenel = document.querySelector('a-scene').object3D;
                let selectedObject = scenel.getObjectByName("Spheres");
                scenel.remove(selectedObject);
            });
        }
    });
AFRAME.registerComponent('planeComp', {
    schema: {},
    init: function () {

        var el = this.el;
        var line;
        var MAX_POINTS = 500;
        var drawCount;
        var splineArray = [];
        // geometry
        var geometry = new THREE.BufferGeometry();

        // attributes
        var positions = new Float32Array(MAX_POINTS * 3); // 3 vertices per point
        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));

        // drawcalls
        drawCount = 2; // draw the first 2 points, only
        geometry.setDrawRange(0, drawCount);

        // material
        var material = new THREE.LineBasicMaterial({color: 0xff0000, linewidth: 2});

        // line
        line = new THREE.Line(geometry, material);
        document.querySelector('a-scene').object3D.add(line);

        // update positions
        this.updatePositions();

        el.addEventListener('mousedown', this.onMouseDown, false);


        // el.addEventListener('click', function () {
        //     let scenel = document.querySelector('a-scene').object3D;
        //     let selectedObject = scenel.getObjectByName("Spheres");
        //     scenel.remove( selectedObject );
        // });
    },
    onMouseDown: function () {

        var x = ( event.clientX / window.innerWidth ) * 2 - 1;
        var y = -( event.clientY / window.innerHeight ) * 2 + 1;

        // do not register if right mouse button is pressed.

        var vNow = new THREE.Vector3(x, y, 0);
        vNow.unproject(camera);
        console.log(vNow.x + " " + vNow.y + " " + vNow.z);
        splineArray.push(vNow);
    },
    tick: function () {
        drawCount = splineArray.length;

        line.geometry.setDrawRange(0, drawCount);

        this.updatePositions()


        line.geometry.attributes.position.needsUpdate = true; // required after the first render
        console.log("tick");
    },
    updatePositions: function () {
        var positions = line.geometry.attributes.position.array;

        var index = 0;

        for (var i = 0; i < splineArray.length; i++) {

            positions[index++] = splineArray[i].x;
            positions[index++] = splineArray[i].y;
            positions[index++] = splineArray[i].z;


        }
    }


});




