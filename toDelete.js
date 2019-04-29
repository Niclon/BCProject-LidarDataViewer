if (_selected) {
    let positionOfRotationCenter = _selected.position.clone();
    let vectorToWantedCenter = new THREE.Vector3(_selected.userData.xLength / 2, _selected.userData.yLength / 2, 0);
    vectorToWantedCenter.applyEuler(_selected.rotation.clone());
    positionOfRotationCenter.add(vectorToWantedCenter);
    _selected.userData.camera.lookAt(positionOfRotationCenter);

    _selected = null;

}