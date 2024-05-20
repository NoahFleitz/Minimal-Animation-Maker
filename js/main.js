let frames = []; // array to store each frame of the animation
let currentFrame = 0; // keep track of the current frame being edited
let canvas;
let isDrawing = false;
let isPlaying = false;
let intervalId;
let originalHeight, originalWidth;
let canvasWidth = 900;
let canvasHeight = 500;
let carouselDiv = document.getElementById('carousel');
let imgElement = document.createElement('img');
let images = document.querySelectorAll('img[data-index]');
let penColor = 'black'; // Initialize penColor here
let tracingCanvas; // Define tracingCanvas here

function setup() {
  canvas = createCanvas(canvasWidth, canvasHeight);
  pixelDensity(1);
  canvas.parent('canvasBg');
  canvas.elt.oncontextmenu = () => false;
  clear(); // Clear the canvas to ensure it starts with a transparent background
  canvas.mousePressed(startDrawing);
  canvas.mouseReleased(stopDrawing);
  let initialFrame = createGraphics(canvasWidth, canvasHeight);
  initialFrame.clear(); // Ensure the initial frame is transparent
  frames = [initialFrame];
  currentFrame = 0;
  imgElement = document.createElement('img');
  imgElement.src = frames[currentFrame].canvas.toDataURL();
  carouselDiv.appendChild(imgElement);
  imgElement.setAttribute('data-index', currentFrame);
  imgElement.classList.add('current-frame');
  setInterval(updateDomImage, 100); // Update thumbnails every 100ms
  
  // Initialize tracing canvas
  sketch = function (p) {
    p.setup = function () {
      p.createCanvas(canvasWidth, canvasHeight);
    };
    p.draw = function () {
      if (currentFrame > 0) {
        p.clear();
        if (frames[currentFrame - 1]) {
          p.image(frames[currentFrame - 1], 0, 0, canvasWidth, canvasHeight);
        }
      } else {
        p.clear();
      }
    };
  };
  tracingCanvas = new p5(sketch);

  // Adding show and hide methods to tracingCanvas
  tracingCanvas.show = function () {
    if (this.canvas) {
      this.canvas.style.display = 'block';
    }
  };

  tracingCanvas.hide = function () {
    if (this.canvas) {
      this.canvas.style.display = 'none';
    }
  };
}

function windowResized() {
  resizeCanvas(canvasWidth, canvasHeight);
}

function loadAnimation(animation) {
  frames = []; // Clear the existing frames array
  let totalFrames = animation.frames.length;
  let framesLoaded = 0;

  for (let i = 0; i < totalFrames; i++) {
    let img = loadImage(animation.frames[i], (img) => {
      let pg = createGraphics(canvasWidth, canvasHeight);
      pg.image(img, 0, 0, canvasWidth, canvasHeight);
      frames[i] = pg; // Assign the loaded image to the correct index in the frames array
      framesLoaded++;
      if (framesLoaded === totalFrames) {
        console.log('All frames loaded');
        setupFrames();
      }
    }, (err) => {
      console.error('Error loading image:', err);
      if (framesLoaded === totalFrames) {
        console.log('All frames loaded (with errors)');
        setupFrames();
      }
    });
  }
}

function setupFrames() {
  console.log('Setting up frames');
  console.log('Number of frames:', frames.length);
  if (frames.length === 0) {
    console.error('No frames loaded');
    return;
  }
  currentFrame = 0;
  updateCarousel();
  clear();
  image(frames[currentFrame], 0, 0, canvasWidth, canvasHeight); // Draw the current frame
}
