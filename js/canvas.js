function draw() {
  if (isDrawing) {
    if (mouseX >= 0 && mouseX <= canvasWidth && mouseY >= 0 && mouseY <= canvasHeight) {
      if (mouseButton === LEFT) {
        frames[currentFrame].stroke(penColor);
        frames[currentFrame].strokeWeight(pencilSlider.value);
        frames[currentFrame].line(mouseX, mouseY, pmouseX, pmouseY);
      } else if (mouseButton === RIGHT) {
        frames[currentFrame].strokeWeight(eraserSlider.value);
        frames[currentFrame].erase();
        frames[currentFrame].line(mouseX, mouseY, pmouseX, pmouseY);
        frames[currentFrame].noErase();
      }
      clear();
      image(frames[currentFrame], 0, 0);
    } else {
      stopDrawing();
    }
  }
}

function startDrawing() {
  if (mouseX >= 0 && mouseX <= canvasWidth && mouseY >= 0 && mouseY <= canvasHeight) {
    isDrawing = true;
  }
}

function stopDrawing() {
  isDrawing = false;
  if (mouseX >= 0 && mouseX <= canvasWidth && mouseY >= 0 && mouseY <= canvasHeight) {
    frames[currentFrame].image(get(), 0, 0); // Update the current frame with the new drawing or erasing
    updateDomImage(); // Update the thumbnail image
  }
}

function clearCanvas() {
  clear();
  background(240, 240, 240); // Ensure the background remains off-white
  frames[currentFrame].background(240, 240, 240); // Update the frame with the clear background
  updateDomImage(); // Update the thumbnail image
}
