const addFrameButton = document.getElementById('addFrameButton');
addFrameButton.addEventListener('click', addFrame);

const playButton = document.getElementById('playButton');
playButton.addEventListener('click', playAnimation);

const speedSlider = document.getElementById('speedSlider');

const nextFrameButton = document.getElementById('nextFrameButton');
nextFrameButton.addEventListener('click', nextFrame);

const prevFrameButton = document.getElementById('prevFrameButton');
prevFrameButton.addEventListener('click', prevFrame);

const pencilSlider = document.getElementById('pencilSlider');
const eraserSlider = document.getElementById('eraserSlider');

const clearButton = document.getElementById('clearButton');
clearButton.addEventListener('click', clearCanvas);

const deleteFrameButton = document.getElementById('deleteFrameButton');
deleteFrameButton.addEventListener('click', deleteFrame);

const saveButton = document.getElementById('saveButton');
saveButton.addEventListener('click', saveAnimation);

const loadButton = document.getElementById('loadButton');
loadButton.addEventListener('click', displaySavedAnimations);

document.querySelectorAll('.toolbar button, .tilt').forEach(button => {
  button.addEventListener('mouseover', () => {
    button.style.setProperty('--random-rotate', Math.random() * 20 - 10); // Random tilt between -10 and 10 degrees
  });
});

document.querySelectorAll('.color-option').forEach(option => {
  option.addEventListener('click', () => {
    penColor = option.getAttribute('data-color');
    document.getElementById('penIcon').style.color = penColor;
  });
});
