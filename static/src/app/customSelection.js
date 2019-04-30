import CustomDragControls from "./customDragControls";
import CustomSelectionResizer from "./customSelectionResizer";

class CustomSelection {
    constructor(props) {
        this.isFrameStopped = false;
        this.isDraggingControlEnabled = false;
        this.selectionCounter = 0;

        this.scene = props.scene;
        this.renderer = this.scene.renderer;
        this.mainCamera = this.scene.camera;
        this.dragControls = null;
        this.raycaster = new THREE.Raycaster();
        this.plane = new THREE.Plane();

        this.mouse = new THREE.Vector2();
        this.lineObjects = [];
        this.additionalCamerasObjects = [];
        this.material = new THREE.LineBasicMaterial({color: 0xff00ff, linewidth: 3});
        this.groupOfCameras = props.groupOfCameras;
        this.groupOfLines = props.groupOfLines;
        this.rotationMatrix = new THREE.Matrix3();
        this.worldStartingDirection = new THREE.Vector3(0, 0, -1);


        this.currentMouse2DForDeletion = {x: null, y: null};
        this.deletionEvent = new MouseEvent("tryToDeleteSelectionEvent");
        this.customDrawing = props.customDrawing;
        this.customSelectionResizer = new CustomSelectionResizer(
            {
                customSelection: this
            }
        );
        this.initEvents();
    }

    initEvents() {
        var that = this;
        window.onkeydown = function (e) {
            if (!e) e = window.event;
            if (e.ctrlKey) {
                if (!that.isFrameStopped) {
                    document.querySelector('#scatchPlane').setAttribute('visible', 'true');
                    that.scene.pause();

                    that.isFrameStopped = true;
                    that.customDrawing.showDrawingCanvas();
                }
            }
            if (e.altKey) {
                if (that.isFrameStopped) {
                    document.querySelector('#scatchPlane').setAttribute('visible', 'false');
                    that.isFrameStopped = false;
                    that.scene.play();
                    that.customDrawing.clearAndHideCanvas();
                }
            }
            if (e.shiftKey) {
                document.querySelector('#drawingCanvas').setAttribute('visible', 'false');
                if (that.isFrameStopped) {
                    if (that.customDrawing.endPointX != null && that.customDrawing.startPointX != null) {
                        that.makeBorder();
                        document.querySelector('#scatchPlane').setAttribute('visible', 'false');
                        that.isFrameStopped = false;
                        that.scene.play();
                        that.customDrawing.clearAndHideCanvas();
                    }
                }
            }
            // moving selections 'M'
            if (e.which === 77) {
                if (that.dragControls) {
                    if (that.isDraggingControlEnabled) {
                        that.dragControls.setCursorToAuto();
                        that.dragControls.deactivate();
                        that.isDraggingControlEnabled = false;
                    } else {
                        that.dragControls.activate();
                        that.isDraggingControlEnabled = true;
                    }
                }
            }
            //deletion of selection 'DEL'
            if (e.which === 46) {
                if (that.dragControls) {
                    if (that.isDraggingControlEnabled && false === that.isFrameStopped) {
                        document.dispatchEvent(that.deletionEvent);
                    } else {
                        console.log("To delete selection please enable dragging (press key 'M')");
                    }
                }
            }
            //for resizing key 'N'
            if (e.which === 78) {
                if (that.customSelectionResizer) {
                    if (that.customSelectionResizer.enabled && false === that.isFrameStopped) {
                        that.customSelectionResizer.disable();
                    } else {
                        that.customSelectionResizer.enable();
                    }
                }
            }

        };
        document.addEventListener("mousemove", function (e) {
            that.currentMouse2DForDeletion.x = e.pageX;
            that.currentMouse2DForDeletion.y = e.pageY;
        });
        document.addEventListener("tryToDeleteSelectionEvent", function (e) {
            let mouse2D = new THREE.Vector2();
            mouse2D.x = (that.currentMouse2DForDeletion.x / window.innerWidth) * 2 - 1;
            mouse2D.y = -(that.currentMouse2DForDeletion.y / window.innerHeight) * 2 + 1;

            that.raycaster.setFromCamera(mouse2D, that.mainCamera);
            var intersects = that.raycaster.intersectObjects(that.lineObjects);
            if (intersects.length > 0) {
                let selection = intersects[0].object;
                if (selection.userData.camera.parent) {
                    selection.userData.camera.parent.remove(selection.userData.camera);
                    selection.parent.remove(selection);
                }
            }
        });
    }

    makeBorder() {

        this.scene = document.querySelector('a-scene');
        this.renderer = this.scene.renderer;
        this.mainCamera = this.scene.camera;

        let firstPoint;
        let secondPoint;

        this.customDrawing.restructureSoStartIsInLeftTopCorner();

        firstPoint = this.create3DPoint(this.customDrawing.startPointX, this.customDrawing.startPointY);
        secondPoint = this.createSecondPointFromPlane(this.customDrawing.endPointX, this.customDrawing.endPointY, firstPoint);


        let xLength;
        let yLength;

        if (firstPoint.y < secondPoint.y) {
            yLength = new THREE.Vector3(firstPoint.x, secondPoint.y, firstPoint.z).length();
            xLength = new THREE.Vector3(secondPoint.x, firstPoint.y, secondPoint.z).length();
        } else {
            yLength = -(firstPoint.distanceTo(new THREE.Vector3(firstPoint.x, secondPoint.y, firstPoint.z)));
            xLength = firstPoint.distanceTo(new THREE.Vector3(secondPoint.x, firstPoint.y, secondPoint.z));
        }
        // yLength = -(firstPoint.distanceTo(new THREE.Vector3(firstPoint.x, secondPoint.y, firstPoint.z)));
        // xLength = firstPoint.distanceTo(new THREE.Vector3(secondPoint.x, firstPoint.y, secondPoint.z));


        let line = this.create3DLine(xLength, yLength);
        let reultVec = firstPoint.clone().add(secondPoint).divideScalar(2).setLength(3);

        let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
        camera.position.set(0, 0.4, 0);
        camera.lookAt(reultVec);
        this.groupOfCameras.add(camera);
        this.additionalCamerasObjects.push(camera);
        let worldRotation = camera.getWorldRotation();

        line.position.set(reultVec.x, reultVec.y, reultVec.z);
        line.rotation.set(worldRotation._x, worldRotation._y, worldRotation._z);

        line.renderOrder = 1;
        line.userData = {
            camera: camera,
            xLength: xLength,
            yLength: yLength,
            name: '_Selection_' + this.selectionCounter,
            rotation: line.rotation
        };
        this.selectionCounter += 1;
        this.groupOfLines.add(line);
        this.lineObjects.push(line);


        if (this.dragControls) {
            this.dragControls.dispose();
        }

        this.dragControls = new CustomDragControls(this.lineObjects, this.mainCamera, this.renderer.domElement);
        this.isDraggingControlEnabled = false;
        this.dragControls.deactivate();
    }

    create3DLine(xLength, yLength) {

        return new THREE.Line(this.createLineGeometry(xLength, yLength), this.material);
    }

    createLineGeometry(xLength, yLength) {
        var rectShape = new THREE.Shape();

        rectShape.moveTo(-xLength / 2, yLength / 2);
        rectShape.lineTo(xLength / 2, yLength / 2);
        rectShape.lineTo(xLength / 2, -yLength / 2);
        rectShape.lineTo(-xLength / 2, -yLength / 2);
        rectShape.lineTo(-xLength / 2, yLength / 2);
        rectShape.moveTo(0, 0);

        return new THREE.ShapeBufferGeometry(rectShape);
    }

    createSecondPointFromPlane(screenX, screenY, firstpoint) {
        this.mouse.x = (screenX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(screenY / window.innerHeight) * 2 + 1;
        var result = new THREE.Vector3();

        this.raycaster.setFromCamera(this.mouse, this.mainCamera);
        this.plane.setFromNormalAndCoplanarPoint(this.mainCamera.getWorldDirection(this.plane.normal), firstpoint);
        this.raycaster.ray.intersectPlane(this.plane, result);
        return result;
    }

    create3DPoint(screenX, screenY) {

        let x = (screenX / window.innerWidth) * 2 - 1;
        let y = -(screenY / window.innerHeight) * 2 + 1;
        let cameraYOffset = 0.4;

        let vNow = new THREE.Vector3(x, y, 0);
        vNow.unproject(this.mainCamera);

        let length = Math.sqrt(vNow.x ** 2 + (vNow.y - cameraYOffset) ** 2 + vNow.z ** 2);
        let scalingFactor = 3 / Math.abs(length);
        return new THREE.Vector3((scalingFactor * vNow.x), ((scalingFactor * (vNow.y - cameraYOffset)) + cameraYOffset), (scalingFactor * vNow.z));
    }

}

export default CustomSelection;