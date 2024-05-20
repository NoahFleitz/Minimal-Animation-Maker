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

function updateDomImage() {
  images = document.querySelectorAll('img[data-index]');
  images.forEach((el, index) => el.setAttribute('data-index', index));
  if (document.querySelector(`img[data-index="${currentFrame}"]`)) {
    if (frames[currentFrame]) {
      document.querySelector(`img[data-index="${currentFrame}"]`).src = frames[currentFrame].canvas.toDataURL();
    }
  }
}

function updateCarousel() {
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

function displaySavedAnimations() {
  const savedAnimations = JSON.parse(localStorage.getItem('flipbookAnimations')) || [];
  const saveList = document.getElementById('saveList');
  saveList.innerHTML = ''; // Clear the save list

  savedAnimations.forEach((animation, index) => {
    const saveItem = document.createElement('div');
    saveItem.classList.add('save-item');

    const thumbnail = document.createElement('img');
    thumbnail.src = animation.frames[0]; // Use the first frame as the thumbnail
    saveItem.appendChild(thumbnail);

    const date = document.createElement('div');
    date.classList.add('date');
    date.textContent = animation.date;
    saveItem.appendChild(date);

    const deleteBtn = document.createElement('div');
    deleteBtn.classList.add('delete-btn', 'tilt');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener('click', () => {
      savedAnimations.splice(index, 1);
      localStorage.setItem('flipbookAnimations', JSON.stringify(savedAnimations));
      displaySavedAnimations(); // Refresh the list
    });
    saveItem.appendChild(deleteBtn);

    saveItem.addEventListener('click', () => {
      loadAnimation(animation);
      document.getElementById('loadModal').style.display = 'none'; // Close the modal
    });

    saveList.appendChild(saveItem);
  });

  document.getElementById('loadModal').style.display = 'block'; // Show the modal
}
