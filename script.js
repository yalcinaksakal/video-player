const player = document.querySelector(".player");
const video = document.querySelector("video");
const progressRange = document.querySelector(".progress-range");
const progressBar = document.querySelector(".progress-bar");
const playBtn = document.getElementById("play-btn");
const volume = document.getElementById("volume-icon");
const volumeRange = document.querySelector(".volume-range");
const volumeBar = document.querySelector(".volume-bar");
const volumeIcon = document.getElementById("volume-icon");
const currentTime = document.querySelector(".time-elapsed");
const duration = document.querySelector(".time-duration");
const speed = document.querySelector("select");
const fullscreenBtn = document.querySelector(".fullscreen");

// Play & Pause ----------------------------------- //
function pauseVideo() {
  video.pause();
  playBtn.classList.replace("fa-pause", "fa-play");
  playBtn.setAttribute("title", "Play");
}

function togglePlay() {
  if (video.paused) {
    video.play();
    playBtn.classList.replace("fa-play", "fa-pause");
    playBtn.setAttribute("title", "Pause");
    return;
  }
  pauseVideo();
}

//helper functions
const minutesSeconds = secs =>
  `${(Math.floor(secs / 60) + "").padStart(2, 0)}:${(
    Math.round(secs % 60) + ""
  ).padStart(2, 0)}`;

const crntTimeText = secs => minutesSeconds(secs) + " /";
// Progress Bar ---------------------------------- //

function updateProgress() {
  progressBar.style.width = `${(video.currentTime * 100) / video.duration}%`;
  currentTime.textContent = crntTimeText(video.currentTime);
}

function setProgress(e) {
  const newTime = e.offsetX / this.offsetWidth;
  progressBar.style.width = `${newTime * 100}%`;
  video.currentTime = newTime * video.duration;
  currentTime.textContent = crntTimeText(video.currentTime);
}

// Volume Controls --------------------------- //
let newVolume = 1;

function resetVolumeIcon(volume) {
  volumeIcon.className = "";
  if (volume > 0.7) volumeIcon.classList.add("fas", "fa-volume-up");
  else if (volume > 0.3) volumeIcon.classList.add("fas", "fa-volume-down");
  else if (volume >= 0.1) volumeIcon.classList.add("fas", "fa-volume-off");
  else volumeIcon.classList.add("fas", "fa-volume-mute");
}

function changeVolume(e) {
  newVolume = e.offsetX / this.offsetWidth;
  if (newVolume > 0.9) newVolume = 1;
  if (newVolume < 0.1) newVolume = 0;
  volumeBar.style.width = `${newVolume * 100}%`;
  video.volume = newVolume;
  resetVolumeIcon(newVolume);
}

function toggleMute() {
  if (video.volume) {
    video.volume = 0;
    volumeBar.style.width = 0;
    resetVolumeIcon(0);
    return;
  }
  video.volume = newVolume;
  volumeBar.style.width = `${newVolume * 100}%`;
  resetVolumeIcon(newVolume);
}

// Change Playback Speed -------------------- //
function changeSpeed() {
  video.playbackRate = +speed.value;
}

// Fullscreen ------------------------------- //
///navigator.userAgent is not a god idea to detect browser.try iteratively to find which feature exists, not to detect browser
function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    elem.msRequestFullscreen();
  }
  video.classList.toggle("video-fullscreen");
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE11 */
    document.msExitFullscreen();
  }
  video.classList.toggle("video-fullscreen");
}

let fullscreen = false;
function toggleScreenMode() {
  fullscreen ? closeFullscreen() : openFullscreen(player);
  fullscreen = !fullscreen;
}
//Event Listeners
[playBtn, video].forEach(el => el.addEventListener("click", togglePlay));

video.addEventListener("ended", pauseVideo);

["timeupdate", "canplay"].forEach(event => {
  video.addEventListener(event, updateProgress);
});

video.addEventListener(
  "loadeddata",
  () => (duration.textContent = minutesSeconds(video.duration))
);

progressRange.addEventListener("click", setProgress);
volumeRange.addEventListener("click", changeVolume);
volumeIcon.addEventListener("click", toggleMute);
speed.addEventListener("change", changeSpeed);
fullscreenBtn.addEventListener("click", toggleScreenMode);
