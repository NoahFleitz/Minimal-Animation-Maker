
  window.addFrame = function() {
    let newFrame = createGraphics(canvasWidth, canvasHeight);
    newFrame.clear(); // Ensure the new frame is transparent
    frames.splice(currentFrame + 1, 0, newFrame);
    currentFrame++;
    clear();
    image(frames[currentFrame], 0, 0, canvasWidth, canvasHeight);
    updateCarousel();
  }

  window.nextFrame = function() {
    clear();
    document.querySelector(`img[data-index="${currentFrame}"]`).classList.remove('current-frame');
    currentFrame = (currentFrame + 1) % frames.length;
    document.querySelector(`img[data-index="${currentFrame}"]`).classList.add('current-frame');
    image(frames[currentFrame], 0, 0, canvasWidth, canvasHeight);
  }

  window.prevFrame = function() {
    document.querySelector(`img[data-index="${currentFrame}"]`).classList.remove('current-frame');
    currentFrame = currentFrame > 0 ? currentFrame - 1 : frames.length - 1;
    document.querySelector(`img[data-index="${currentFrame}"]`).classList.add('current-frame');
    clear();
    background(255, 255, 255, 0);
    image(frames[currentFrame], 0, 0, canvasWidth, canvasHeight);
  }

  window.deleteFrame = function() {
    clear();
    if (frames.length > 1) {
      let temp = currentFrame;
      frames.splice(currentFrame, 1);
      document.querySelector(`img[data-index="${temp}"]`).remove();
      currentFrame--;
      if (currentFrame < 0) {
        currentFrame = 0;
      }
      document.querySelector(`img[data-index="${currentFrame}"]`).classList.add('current-frame');
      image(frames[currentFrame], 0, 0, canvasWidth, canvasHeight);
    }
  }

  window.playAnimation = function() {
    if (frames.length === 0) {
      return;
    }
    if (!isPlaying) {
      isPlaying = true;
      playButton.innerHTML = '<i class="fas fa-stop"></i>'; // Change to stop icon
      intervalId = setInterval(nextFrame, speedSlider.value);
      tracingCanvas.hide(); // Hide tracing canvas during playback
      canvas.elt.style.cursor = 'not-allowed';
      canvas.elt.style.pointerEvents = 'none';
      if (document.getElementById('defaultCanvas1')) {
        document.getElementById('defaultCanvas1').style.display = 'none'; // Hide the defaultCanvas1
      }
    } else {
      isPlaying = false;
      clearInterval(intervalId);
      playButton.innerHTML = '<i class="fas fa-play"></i>'; // Change to play icon
      tracingCanvas.show(); // Show tracing canvas after stopping playback
      canvas.elt.style.cursor = 'initial';
      canvas.elt.style.pointerEvents = 'auto';
      if (document.getElementById('defaultCanvas1')) {
        document.getElementById('defaultCanvas1').style.display = 'block'; // Show the defaultCanvas1
      }
    }
  }

  window.saveAnimation = function() {
    let date = new Date().toLocaleString();
    let framesData = frames.map(frame => frame.canvas.toDataURL());
    let animations = JSON.parse(localStorage.getItem('flipbookAnimations')) || [];
    animations.push({ date, frames: framesData });
    localStorage.setItem('flipbookAnimations', JSON.stringify(animations));
    alert('Animation saved!');
  }

  window.displaySavedAnimations = function() {
    let animations = JSON.parse(localStorage.getItem('flipbookAnimations')) || [];
    const saveList = document.getElementById('saveList');
    if (saveList) {
      saveList.innerHTML = '';
      animations.forEach((animation, index) => {
        let saveItem = document.createElement('div');
        saveItem.classList.add('save-item');

        let img = document.createElement('img');
        img.src = animation.frames[0];
        img.addEventListener('click', function () {
          loadAnimation(animation); // Load the animation
          closeModal();
        });

        let dateElement = document.createElement('div');
        dateElement.classList.add('date');
        dateElement.textContent = animation.date;

        let deleteBtn = document.createElement('i');
        deleteBtn.classList.add('fas', 'fa-trash-alt', 'delete-btn', 'tilt');
        deleteBtn.addEventListener('mouseover', function () {
          this.style.setProperty('--random-rotate', `${Math.random() * 20 - 10}deg`); // Apply random tilt effect
        });
        deleteBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          animations.splice(index, 1);
          localStorage.setItem('flipbookAnimations', JSON.stringify(animations));
          displaySavedAnimations(); // Refresh the list
        });

        saveItem.appendChild(img);
        saveItem.appendChild(dateElement);
        saveItem.appendChild(deleteBtn);
        saveList.appendChild(saveItem);
      });

      const modal = document.getElementById('loadModal');
      if (modal) {
        modal.style.display = 'block';
        const span = document.getElementsByClassName('close')[0];
        console.log('Adding event listener to close button', span);
        span.addEventListener('click', function () {
          console.log('Close button clicked');
          closeModal();
        });
        window.addEventListener('click', function (event) {
          if (event.target === modal) {
            console.log('Outside modal clicked');
            closeModal();
          }
        });
      }
    }
  }

  window.closeModal = function() {
    console.log('Closing modal');
    const modal = document.getElementById('loadModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  window.updateCarousel = function() {
    carouselDiv.innerHTML = '';
    frames.forEach((frame, index) => {
      if (frame) {
        let img = document.createElement('img');
        img.src = frame.canvas.toDataURL();
        img.setAttribute('data-index', index);
        if (index === currentFrame) {
          img.classList.add('current-frame');
        }
        carouselDiv.appendChild(img);
        img.addEventListener('click', function () {
          currentFrame = parseInt(this.getAttribute('data-index'));
          images.forEach(img => img.classList.remove('current-frame'));
          this.classList.add('current-frame');
          clear();
          image(frames[currentFrame], 0, 0, canvasWidth, canvasHeight);
          updateDomImage();
        });
      }
    });
    images = document.querySelectorAll('img[data-index]');
    carouselDiv.scrollLeft = carouselDiv.scrollWidth; // Scroll to the far right after a frame is added
  }

  // Attach event listeners to buttons
  document.getElementById('addFrameButton').addEventListener('click', addFrame);
  document.getElementById('prevFrameButton').addEventListener('click', prevFrame);
  document.getElementById('playButton').addEventListener('click', playAnimation);
  document.getElementById('nextFrameButton').addEventListener('click', nextFrame);
  document.getElementById('deleteFrameButton').addEventListener('click', deleteFrame);
  document.getElementById('loadButton').addEventListener('click', displaySavedAnimations);
  document.getElementById('saveButton').addEventListener('click', saveAnimation);

