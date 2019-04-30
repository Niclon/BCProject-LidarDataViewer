class CustomSelectionResizer {
    constructor(props) {
        this.customSelection = props.customSelection;
        this.domElement = this.customSelection.renderer.domElement;
        this.scene = this.customSelection.scene;
        this.mouse = new THREE.Vector2();
        this.camera = this.scene.camera;
        this.lineObjects = this.customSelection.lineObjects;

        this.selected = null;
        this.planePad = new THREE.Plane();
        this.startOfDragging = new THREE.Vector3();
        this.currentPositionOfDragging = new THREE.Vector3();
        this.vectorDiference = new THREE.Vector3();

        this.isResizing = false;
        this.raycaster = new THREE.Raycaster();

        this.scope = this;
        this.enabled = false;
        this.initEvents();
    }

    initEvents() {
        var that = this;
        that.domElement.addEventListener('mousemove', function (event) {
                event.preventDefault();
                if (!that.enabled) {
                    that.domElement.style.cursor = 'auto';
                    return;
                }

                var rect = that.domElement.getBoundingClientRect();

                that.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                that.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                that.raycaster.setFromCamera(that.mouse, that.camera);

                if (that.isResizing && that.enabled) {

                    that.raycaster.ray.intersectPlane(that.planePad, that.currentPositionOfDragging);
                    that.vectorDiference = that.startOfDragging.clone().sub(that.currentPositionOfDragging);

                    if (that.selected.position.z < 0) {
                        that.selected.geometry.dispose();
                        that.selected.geometry = that.customSelection.createLineGeometry(that.selected.userData.xLength + (-2) * that.vectorDiference.x,
                            that.selected.userData.yLength + 2 * that.vectorDiference.y);
                    } else {
                        that.selected.geometry.dispose();
                        that.selected.geometry = that.customSelection.createLineGeometry(that.selected.userData.xLength + 2 * that.vectorDiference.x,
                            that.selected.userData.yLength + 2 * that.vectorDiference.y);
                    }

                    that.domElement.style.cursor = 'nesw-resize';
                    return;
                }

                var intersects = that.raycaster.intersectObjects(that.lineObjects);

                if (intersects.length > 0) {
                    if (!that.isResizing) {
                        that.domElement.style.cursor = 'nesw-resize';
                    }
                } else {
                    that.domElement.style.cursor = 'auto';
                }
            }
        );
        that.domElement.addEventListener('mousedown', function (event) {
            event.preventDefault();
            if (that.enabled) {
                that.raycaster.setFromCamera(that.mouse, that.camera);

                var intersects = that.raycaster.intersectObjects(that.lineObjects);
                if (intersects.length > 0) {
                    that.isResizing = true;
                    that.selected = intersects[0].object;
                    that.planePad.set(that.selected.position.clone().negate(), 3);
                    that.raycaster.ray.intersectPlane(that.planePad, that.startOfDragging);
                    that.domElement.style.cursor = 'nesw-resize';
                }
            }


        });
        that.domElement.addEventListener('mouseup', function (event) {
            event.preventDefault();
            that.isResizing = false;
            that.startOfDragging.set(0, 0, 0);
            that.currentPositionOfDragging.set(0, 0, 0);
            that.domElement.style.cursor = 'auto';
            if (that.selected) {
                if (that.selected.position.z < 0) {
                    that.selected.userData.xLength += (-2) * that.vectorDiference.x;
                } else {
                    that.selected.userData.xLength += 2 * that.vectorDiference.x;
                }
                that.selected.userData.yLength += 2 * that.vectorDiference.y;
                that.selected = null;
            }
            that.vectorDiference.set(0, 0, 0);

        });
        that.domElement.addEventListener('mouseleave', function (event) {
            event.preventDefault();
            that.isResizing = false;
            that.startOfDragging.set(0, 0, 0);
            that.currentPositionOfDragging.set(0, 0, 0);
            that.domElement.style.cursor = 'auto';
            if (that.selected) {
                if (that.selected.position.z < 0) {
                    that.selected.userData.xLength += (-2) * that.vectorDiference.x;
                } else {
                    that.selected.userData.xLength += 2 * that.vectorDiference.x;
                }
                that.selected.userData.yLength += 2 * that.vectorDiference.y;
                that.selected = null;
            }
            that.vectorDiference.set(0, 0, 0);
        });
    }

    disable() {
        this.isResizing = false;
        this.startOfDragging.set(0, 0, 0);
        this.currentPositionOfDragging.set(0, 0, 0);
        this.enabled = false;
    }

    enable() {
        this.enabled = true;
    }


}

export default CustomSelectionResizer