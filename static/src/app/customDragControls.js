var THREE = require('three');

var CustomDragControls = function (_objects, _camera, _domElement) {

    var _radius = 3;
    const _center = new THREE.Vector3(0, 0.4, 0);
    var _sphere = new THREE.Sphere(_center, _radius);
    var _worldRotation;
    var _raycaster = new THREE.Raycaster();

    var _mouse = new THREE.Vector2();
    var _offset = new THREE.Vector3();
    var _intersection = new THREE.Vector3();

    var _rotationMatrix = new THREE.Matrix3();
    var _worldStartingDirection = new THREE.Vector3(0, 0, -1);

    var _selected = null, _hovered = null;

    //todo delete
    var geometry = new THREE.SphereGeometry(0.05, 32, 32);
    var material = new THREE.MeshBasicMaterial({color: 0xff0000});
    var sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, 0, 0);
    document.querySelector('a-scene').object3D.add(sphere);

    var scope = this;

    function activate() {

        _domElement.addEventListener('mousemove', onDocumentMouseMove, false);
        _domElement.addEventListener('mousedown', onDocumentMouseDown, false);
        _domElement.addEventListener('mouseup', onDocumentMouseCancel, false);
        _domElement.addEventListener('mouseleave', onDocumentMouseCancel, false);
        _domElement.addEventListener('touchmove', onDocumentTouchMove, false);
        _domElement.addEventListener('touchstart', onDocumentTouchStart, false);
        _domElement.addEventListener('touchend', onDocumentTouchEnd, false);

    }

    function deactivate() {

        _domElement.removeEventListener('mousemove', onDocumentMouseMove, false);
        _domElement.removeEventListener('mousedown', onDocumentMouseDown, false);
        _domElement.removeEventListener('mouseup', onDocumentMouseCancel, false);
        _domElement.removeEventListener('mouseleave', onDocumentMouseCancel, false);
        _domElement.removeEventListener('touchmove', onDocumentTouchMove, false);
        _domElement.removeEventListener('touchstart', onDocumentTouchStart, false);
        _domElement.removeEventListener('touchend', onDocumentTouchEnd, false);

    }

    function dispose() {

        deactivate();

    }

    function onDocumentMouseMove(event) {

        event.preventDefault();

        var rect = _domElement.getBoundingClientRect();

        _mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        _mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        _raycaster.setFromCamera(_mouse, _camera);

        if (_selected && scope.enabled) {

            if (_raycaster.ray.intersectSphere(_sphere, _intersection)) {

                _selected.position.copy(_intersection.sub(_offset)).setLength(_radius);
                // _selected.position.copy(_intersection);
                _worldRotation = _camera.getWorldRotation();
                _selected.rotation.set(_worldRotation._x, _worldRotation._y, _worldRotation._z);

                // todo remove
                let temp = _intersection;
                sphere.position.set(temp.x, temp.y, temp.z);

            }

            scope.dispatchEvent({type: 'drag', object: _selected});

            return;

        }

        _raycaster.setFromCamera(_mouse, _camera);

        var intersects = _raycaster.intersectObjects(_objects);

        if (intersects.length > 0) {

            var object = intersects[0].object;

            if (_hovered !== object) {

                scope.dispatchEvent({type: 'hoveron', object: object});

                _domElement.style.cursor = 'pointer';
                _hovered = object;

            }

        } else {

            if (_hovered !== null) {

                scope.dispatchEvent({type: 'hoveroff', object: _hovered});

                _domElement.style.cursor = 'auto';
                _hovered = null;

            }

        }

    }

    function onDocumentMouseDown(event) {

        event.preventDefault();

        _raycaster.setFromCamera(_mouse, _camera);

        var intersects = _raycaster.intersectObjects(_objects);

        if (intersects.length > 0) {

            _selected = intersects[0].object;

            if (_raycaster.ray.intersectSphere(_sphere, _intersection)) {

                _offset.copy(_intersection).sub(_selected.position);

            }

            _domElement.style.cursor = 'move';

            scope.dispatchEvent({type: 'dragstart', object: _selected});

        }


    }

    function onDocumentMouseCancel(event) {

        event.preventDefault();

        if (_selected) {
            setUpCameraToLookAtMiddleOfSelection();

            scope.dispatchEvent({type: 'dragend', object: _selected});

            _selected = null;

        }

        _domElement.style.cursor = 'auto';

    }

    function onDocumentTouchMove(event) {

        event.preventDefault();
        event = event.changedTouches[0];

        var rect = _domElement.getBoundingClientRect();

        _mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        _mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        _raycaster.setFromCamera(_mouse, _camera);

        if (_selected && scope.enabled) {

            if (_raycaster.ray.intersectSphere(_sphere, _intersection)) {
                _selected.position.copy(_intersection.sub(_offset)).setLength(_radius);
                _worldRotation = _camera.getWorldRotation();
                _selected.rotation.set(_worldRotation._x, _worldRotation._y, _worldRotation._z);

                //todo delete
                let temp = _intersection;
                sphere.position.set(temp.x, temp.y, temp.z);

            }

            scope.dispatchEvent({type: 'drag', object: _selected});

            return;

        }

    }

    function onDocumentTouchStart(event) {

        event.preventDefault();
        event = event.changedTouches[0];

        var rect = _domElement.getBoundingClientRect();

        _mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        _mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        _raycaster.setFromCamera(_mouse, _camera);

        var intersects = _raycaster.intersectObjects(_objects);

        if (intersects.length > 0) {

            _selected = intersects[0].object;

            if (_raycaster.ray.intersectSphere(_sphere, _intersection)) {

                _offset.copy(_intersection).sub(_selected.position);

            }

            _domElement.style.cursor = 'move';

            scope.dispatchEvent({type: 'dragstart', object: _selected});

        }


    }

    function onDocumentTouchEnd(event) {

        event.preventDefault();

        if (_selected) {
            //todo create camera positioning here
            // _selected.userData.worldRotation = _camera.getWorldRotation();
            // _selected
            setUpCameraToLookAtMiddleOfSelection();
            
            scope.dispatchEvent({type: 'dragend', object: _selected});

            _selected = null;

        }

        _domElement.style.cursor = 'auto';

    }

    function setUpCameraToLookAtMiddleOfSelection() {
        let positionOfRotationCenter = _selected.position.clone();
        let angleOfRotationInRad = _worldStartingDirection.angleTo(positionOfRotationCenter.clone().setY(0));

        // because angleTo calculate smaller one
        // and is rotated to the further from us and to left
        // on positive X selection (right side) we need vector to rotate to right in front of us so it would be in the middle of selection
        if (positionOfRotationCenter.x > 0) {
            angleOfRotationInRad = -angleOfRotationInRad;
        }
        // rotation matrix around Y axis
        _rotationMatrix.set(
            Math.cos(angleOfRotationInRad), 0, Math.sin(angleOfRotationInRad),
            0, 1, 0,
            -Math.sin(angleOfRotationInRad), 0, Math.cos(angleOfRotationInRad)
        );
        let vectorToWantedCenter = new THREE.Vector3(_selected.userData.xLength / 2, _selected.userData.yLength / 2, 0);
        vectorToWantedCenter.applyMatrix3(_rotationMatrix);
        positionOfRotationCenter.add(vectorToWantedCenter);
        _selected.userData.camera.lookAt(positionOfRotationCenter);

        sphere.position.set(positionOfRotationCenter.x, positionOfRotationCenter.y, positionOfRotationCenter.z);
    }

    activate();

    // API

    this.enabled = true;

    this.activate = activate;
    this.deactivate = deactivate;
    this.dispose = dispose;

    // Backward compatibility

    this.setObjects = function () {

        console.error('THREE.DragControls: setObjects() has been removed.');

    };

    this.on = function (type, listener) {

        console.warn('THREE.DragControls: on() has been deprecated. Use addEventListener() instead.');
        scope.addEventListener(type, listener);

    };

    this.off = function (type, listener) {

        console.warn('THREE.DragControls: off() has been deprecated. Use removeEventListener() instead.');
        scope.removeEventListener(type, listener);

    };

    this.notify = function (type) {

        console.error('THREE.DragControls: notify() has been deprecated. Use dispatchEvent() instead.');
        scope.dispatchEvent({type: type});

    };

};

CustomDragControls.prototype = Object.create(THREE.EventDispatcher.prototype);
CustomDragControls.prototype.constructor = CustomDragControls;

export default (CustomDragControls)