function Fractal() {

    this.canvas = document.getElementById("canvas");
    this.canvasWidth = parseInt(this.canvas.getAttribute("width"));
    this.canvasHeight = parseInt(this.canvas.getAttribute("height"));
    this.context = this.canvas.getContext('2d');
    this.left = -2;
    this.top = 2*this.canvasHeight/this.canvasWidth;
    this.right = 2;
    this.bottom = -2*this.canvasHeight/this.canvasWidth;
    this.n;

    this.setN = function (n) {
        this.n = n;
    };

    this.getPlanePoint = function (x, y) {
        var i = x*(this.right - this.left)/this.canvasWidth + this.left;
        var j = y*(this.bottom - this.top)/this.canvasHeight + this.top;
        return {x: i, y: j};
    };

    this.getCanvasPoint = function (x, y) {
        var i = Math.round(x *this.canvasWidth/4 + this.canvasWidth/2);
        var j = Math.round(-y*this.canvasWidth/4 + this.canvasHeight/2);
        return {x: i, y: j};
    };
}

setInterval(start,25);
var fractal = new Fractal();

function start() {
    fractal.setN(parseInt(document.getElementById("n").value));
    var imageData = fractal.context.createImageData(fractal.canvasWidth, fractal.canvasHeight);
    getImage(fractal.canvasWidth/2, fractal.canvasHeight/2, fractal.n, imageData);
    fractal.context.putImageData(imageData, 0, 0);
}

function getImage(x0, y0, n, imageData) {
    for (var i = 0; i < n; ++i) {
        var planePoint = fractal.getPlanePoint(x0, y0);
        var x, y;
        var rnd = Math.round(Math.random() * 100);
        if (rnd > 50) {
            x = (planePoint.x + planePoint.y) / 2;
            y = (-planePoint.x + planePoint.y) / 2;
        }
        else {
            x = (-planePoint.x + planePoint.y) / 2 - 1;
            y = (-planePoint.x - planePoint.y) / 2;
        }
        var canvasPoint = fractal.getCanvasPoint(x, y);
        drawPoint(canvasPoint.x, canvasPoint.y, i, imageData);
        x0 = canvasPoint.x;
        y0 = canvasPoint.y;
    }
    return 0;
}

function drawPoint(x, y, i, imageData) {
    imageData.data[4 * (x + fractal.canvasWidth * y)] = 255 * (i%3==0 ? 1:0);
    imageData.data[4 * (x + fractal.canvasWidth * y) + 1] = 255 * (i%3==1 ? 1:0);
    imageData.data[4 * (x + fractal.canvasWidth * y) + 2] = 255 * (i%3==2 ? 1:0) ;
    imageData.data[4 * (x + fractal.canvasWidth * y) + 3] = 255;
}