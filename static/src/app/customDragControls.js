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
    var _worldStartingDirection = new THREE.Vector3(0, 0, -1);


    var _selected = null, _hovered = null;

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
                _selected.userData.camera.lookAt(_selected.position);
                _worldRotation = _selected.userData.camera.getWorldRotation();
                _selected.rotation.set(_worldRotation._x, _worldRotation._y, _worldRotation._z);
                // _selected.rotation.set(0, 0, 0);
                // let angleOfYRotationInRad =_worldStartingDirection.angleTo(_selected.position.clone().setY(0));
                // let angleOfXRotationInRad = _worldStartingDirection.angleTo(_selected.position.clone().setX(0));
                //
                // if (_selected.position.x > 0) {
                //     angleOfYRotationInRad = -angleOfYRotationInRad;
                // }
                // if (_selected.position.z < 0) {
                //     angleOfXRotationInRad = -angleOfXRotationInRad;
                // }
                // if (_selected.position.y > 0.4) {
                //     angleOfXRotationInRad = -angleOfXRotationInRad;
                // }
                // _selected.rotateY(angleOfYRotationInRad);
                // _selected.rotateX(angleOfXRotationInRad);
                // console.log(angleOfXRotationInRad);

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
                // _worldRotation = _camera.getWorldRotation();
                // _selected.rotation.set(_worldRotation._x, _worldRotation._y, _worldRotation._z);
                _selected.userData.camera.lookAt(_selected.position);
                _worldRotation = _selected.userData.camera.getWorldRotation();
                _selected.rotation.set(_worldRotation._x, _worldRotation._y, _worldRotation._z);
                // _selected.rotation.set(0, 0, 0);
                // let angleOfYRotationInRad =_worldStartingDirection.angleTo(_selected.position.clone().setY(0));
                // let angleOfXRotationInRad = _worldStartingDirection.angleTo(_selected.position.clone().setX(0));
                //
                // if (_selected.position.x > 0) {
                //     angleOfYRotationInRad = -angleOfYRotationInRad;
                // }
                // if (_selected.position.z < 0) {
                //     // angleOfXRotationInRad = -angleOfXRotationInRad;
                // }
                // if (_selected.position.y > 0.4) {
                //     angleOfXRotationInRad = -angleOfXRotationInRad;
                // }
                // _selected.rotateY(angleOfYRotationInRad);
                // _selected.rotateX(angleOfXRotationInRad);
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

            setUpCameraToLookAtMiddleOfSelection();

            scope.dispatchEvent({type: 'dragend', object: _selected});

            _selected = null;

        }

        _domElement.style.cursor = 'auto';

    }

    function setUpCameraToLookAtMiddleOfSelection() {
        // let positionOfRotationCenter = _selected.position.clone();
        // let vectorToWantedCenter = new THREE.Vector3(_selected.userData.xLength / 2, _selected.userData.yLength / 2, 0);
        // vectorToWantedCenter.applyEuler(_selected.rotation.clone());
        // positionOfRotationCenter.add(vectorToWantedCenter);
        _selected.userData.camera.lookAt(_selected.position);
    }

    activate();

    // API

    this.enabled = true;

    this.activate = activate;
    this.deactivate = deactivate;
    this.dispose = dispose;


    this.on = function (type, listener) {
        scope.addEventListener(type, listener);
    };

    this.off = function (type, listener) {
        scope.removeEventListener(type, listener);
    };

    this.notify = function (type) {
        scope.dispatchEvent({type: type});
    };
    this.setCursorToAuto = function (type) {
        _domElement.style.cursor = 'auto';
    };

};

CustomDragControls.prototype = Object.create(THREE.EventDispatcher.prototype);
CustomDragControls.prototype.constructor = CustomDragControls;

export default (CustomDragControls)