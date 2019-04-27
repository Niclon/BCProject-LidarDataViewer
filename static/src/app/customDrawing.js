class CustomDrawing {
    constructor() {
        this.canvasContext = this.initCanvas();
        this.paint = false;
        this.startPointX = null;
        this.startPointY = null;
        this.endPointX = null;
        this.endPointY = null;
        this.initEvents();

    }

    initEvents() {
        var that = this;
        document.querySelector('#drawingCanvas').addEventListener("mousedown", function (e) {
            that.paint = true;
            that.setEndpointToNull();
            that.setStartPoint(e);
            that.redraw();
        });
        document.querySelector('#drawingCanvas').addEventListener("mousemove", function (e) {
            if (that.paint) {
                that.setEndPoint(e);
                that.redraw();
            }
        });
        document.querySelector('#drawingCanvas').addEventListener("mouseup", function (e) {
            that.paint = false;
            that.setEndPoint(e);
            if (that.isPointsTooClose()) {
                that.setEndpointToNull();
                that.setStartpointToNull();
            }
            that.redraw();
        });
        document.querySelector('#drawingCanvas').addEventListener("mouseleave", function (e) {
            that.paint = false;
            that.setEndpointToNull();
            that.setStartpointToNull();
            that.redraw();
        });
    }

    initCanvas() {
        var canvasDiv = document.getElementById('drawingCanvasDiv');
        var canvas = document.createElement('canvas');
        canvas.setAttribute('width', window.innerWidth);
        canvas.setAttribute('height', window.innerHeight);
        canvas.setAttribute('id', 'drawingCanvas');
        // canvasDiv.children = [];
        canvasDiv.appendChild(canvas);
        if (typeof G_vmlCanvasManager != 'undefined') {
            canvas = G_vmlCanvasManager.initElement(canvas);
        }
        return canvas.getContext("2d");
    }

    redraw() {
        this.canvasContext.clearRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height); // Clears the canvas
        this.canvasContext.strokeStyle = "#df4b26";
        this.canvasContext.lineJoin = "round";

        this.canvasContext.lineWidth = 5;
        if (this.endPointX) {
            this.drawLineAndRender(this.canvasContext, this.startPointX, this.startPointY, this.endPointX, this.startPointY);
            this.drawLineAndRender(this.canvasContext, this.endPointX, this.startPointY, this.endPointX, this.endPointY);
            this.drawLineAndRender(this.canvasContext, this.endPointX, this.endPointY, this.startPointX, this.endPointY);
            this.drawLineAndRender(this.canvasContext, this.startPointX, this.endPointY, this.startPointX, this.startPointY);
        }
    }

    drawLineAndRender(context, startPointX, startPointY, endPointX, endPointY) {

        context.beginPath();
        context.moveTo(startPointX, startPointY);

        context.lineTo(endPointX, endPointY);
        context.closePath();
        context.stroke();

    }

    setEndPoint(e) {
        this.endPointX = e.pageX;
        this.endPointY = e.pageY;
    }

    setEndpointToNull() {
        this.endPointY = null;
        this.endPointX = null;
    }

    setStartpointToNull() {
        this.startPointX = null;
        this.startPointY = null;
    }

    setStartPoint(e) {
        this.startPointX = e.pageX;
        this.startPointY = e.pageY;
    }

    isPointsTooClose() {
        let distance = Math.sqrt(Math.pow(this.startPointX - this.endPointX, 2) + Math.pow(this.startPointY - this.endPointY, 2));
        if (distance < 70) {
            return true;
        } else {
            return false;
        }
    }

    clearAndHideCanvas() {
        this.canvasContext.clearRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height); // Clears the canvas
        document.getElementById('drawingCanvas').style.visibility = 'hidden';
    }

    showDrawingCanvas() {
        document.getElementById('drawingCanvas').style.visibility = 'visible';
    }

    // this is to create two point corners but this create first point in left top corner and second right bottom
    restructureSoStartIsInLeftTopCorner() {
        let temp;

        if (this.startPointX < this.endPointX && this.startPointY > this.endPointY) {
            temp = this.startPointY;
            this.startPointY = this.endPointY;
            this.endPointY = temp;
        } else if (this.startPointX > this.endPointX && this.startPointY < this.endPointY) {
            temp = this.endPointX;
            this.endPointX = this.startPointX;
            this.startPointX = temp;
        } else if (this.startPointX > this.endPointX && this.startPointY > this.endPointY) {
            temp = this.endPointX;
            this.endPointX = this.startPointX;
            this.startPointX = temp;
            temp = this.endPointY;
            this.endPointY = this.startPointY;
            this.startPointY = temp;
        }
    }

}

export default (CustomDrawing)