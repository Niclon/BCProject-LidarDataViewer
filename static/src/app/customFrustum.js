var THREE = require('three');

var CustomFrustum = function CustomFrustum(p0, p1, p2, p3) {

    this.planes = [

        (p0 !== undefined) ? p0 : new THREE.Plane(),
        (p1 !== undefined) ? p1 : new THREE.Plane(),
        (p2 !== undefined) ? p2 : new THREE.Plane(),
        (p3 !== undefined) ? p3 : new THREE.Plane(),

    ];

}

Object.assign(CustomFrustum.prototype, {

    set: function (p0, p1, p2, p3) {

        var planes = this.planes;

        planes[0].copy(p0);
        planes[1].copy(p1);
        planes[2].copy(p2);
        planes[3].copy(p3);

        return this;

    },

    clone: function () {

        return new this.constructor().copy(this);

    },

    copy: function (frustum) {

        var planes = this.planes;

        for (var i = 0; i < 4; i++) {

            planes[i].copy(frustum.planes[i]);

        }

        return this;

    },

    setFromMatrix: function (m) {

        var planes = this.planes;
        var me = m.elements;
        var me0 = me[0], me1 = me[1], me2 = me[2], me3 = me[3];
        var me4 = me[4], me5 = me[5], me6 = me[6], me7 = me[7];
        var me8 = me[8], me9 = me[9], me10 = me[10], me11 = me[11];
        var me12 = me[12], me13 = me[13], me14 = me[14], me15 = me[15];

        planes[0].setComponents(me3 - me0, me7 - me4, me11 - me8, me15 - me12).normalize();
        planes[1].setComponents(me3 + me0, me7 + me4, me11 + me8, me15 + me12).normalize();
        planes[2].setComponents(me3 + me1, me7 + me5, me11 + me9, me15 + me13).normalize();
        planes[3].setComponents(me3 - me1, me7 - me5, me11 - me9, me15 - me13).normalize();

        return this;

    },

    containsPoint: function (point) {

        var planes = this.planes;

        for (var i = 0; i < 4; i++) {

            if (planes[i].distanceToPoint(point) < 0) {

                return false;

            }

        }

        return true;

    }

});

CustomFrustum.prototype.constructor = CustomFrustum;

export {CustomFrustum};
