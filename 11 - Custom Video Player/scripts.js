const video               = document.querySelector('.player__video')
const playButton          = document.querySelector('.player__button.play.toggle')
const pauseButton         = document.querySelector('.player__button.pause.toggle')
const skipButtons         = document.querySelectorAll('.player__button.skip')
const speedButton         = document.querySelector('.player__slider.speed')
const volumeButton        = document.querySelector('.player__slider.volume')
const bufferBar           = document.querySelector('.progress__filled')
const bufferBarContainer  = document.querySelector('.progress')

let mouseDown             = false

function toggleVideo() {
  if (video.paused) {
    video.play()
    playButton.hidden   = true
    pauseButton.hidden  = false
  } else {
    video.pause()
    playButton.hidden   = false
    pauseButton.hidden  = true
  };
}

function spaceToggle(event) {
  if (event.keyCode === 32) {
    toggleVideo()
  }
}

function skipVideo() {
  const getData         = this.dataset.skip;
  const timeSkip        = Number.parseInt(getData, 10);
  video.currentTime     = video.currentTime + timeSkip;
  video.play();
}

function changeSpeed() {
  video.playbackRate    = Number.parseFloat(this.value)
}

function changeVolume() {
  video.volume          = Number.parseFloat(this.value)
}

function bufferVideo() {
  const videoLength         = video.duration
  const videoCurrentTime    = video.currentTime
  const bufferSize          = (videoCurrentTime / videoLength) * 100
  bufferBar.style.flexBasis = `${bufferSize}%`
}

function goToBuffVideo() {
  const position = Number.parseFloat(bufferBar.style.flexBasis)
  const currentTime = (position / 100) * video.duration
  video.currentTime = currentTime
  video.play()
}

function changeVideoPosition(event) {
    const totalWidth            = bufferBarContainer.offsetWidth;
    const eventX                = event.clientX;
    const offsetLeft            = bufferBarContainer.offsetLeft;
    const position              = ((eventX - offsetLeft) / totalWidth) * 100;
    bufferBar.style.flexBasis   = `${position}%`;
    goToBuffVideo();
}

// Play video controls
[video, playButton, pauseButton].forEach(button => button.addEventListener('click', toggleVideo))
window.addEventListener('keyup', spaceToggle)

// Fast forward / Go backward controls
skipButtons.forEach(button => button.addEventListener('click', skipVideo))

// Accelerate or not control
speedButton.addEventListener('change', changeSpeed)
speedButton.addEventListener('mousemove', changeSpeed)

// Change volume control
volumeButton.addEventListener('change', changeVolume)
volumeButton.addEventListener('mousemove', changeVolume)

// Buffer video controls
setInterval(bufferVideo, 1000) // Possible to do it with a 'timeupdate' event

bufferBarContainer.addEventListener('click', changeVideoPosition)
bufferBarContainer.addEventListener('mousemove', function(event) { mouseDown && changeVideoPosition(event) })
bufferBarContainer.addEventListener('mousedown', function() { mouseDown = true })
window.addEventListener('mouseup', function() { mouseDown = false })
