(function () {
  "use strict";

  var STREAM_URL = "https://eu-player-redirect.streamtheworld.com/api/livestream-redirect/GRAND_PRIX_RADIOAAC.aac";
  var NOWPLAYING_URL = "https://grandprixradio.nl/soundtracks/grand-prix-radio.json";
  var NOWPLAYING_POLL_MS = 15000;

  function $(id) { return document.getElementById(id); }

  var player = null;
  var volume = 0.7;

  function updateVolumeLabel() {
    $("volLabel").textContent = Math.round(volume * 100) + "%";
  }

  function togglePlay() {
    if (player.paused) {
      if (!player.src) { player.src = STREAM_URL; }
      player.play().catch(function (err) {
        $("nowPlaying").textContent = "Playback failed: " + err.message;
      });
      $("playBtn").textContent = "Pause";
    } else {
      player.pause();
      $("playBtn").textContent = "Play";
    }
  }

  function changeVolume(delta) {
    volume = Math.max(0, Math.min(1, volume + delta));
    player.volume = volume;
    updateVolumeLabel();
  }

  function fetchNowPlaying() {
    fetch(NOWPLAYING_URL)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var attrs = data && data.data && data.data.attributes;
        var text = attrs ? attrs.full_title : "Grand Prix Radio";
        $("nowPlaying").textContent = text || "Grand Prix Radio";
        $("dimNowPlaying").textContent = text || "Grand Prix Radio";
      })
      .catch(function () {
        $("nowPlaying").textContent = "Grand Prix Radio";
      });
  }

  function enterDim() {
    $("normalView").style.display = "none";
    $("dimView").style.display = "flex";
  }

  function exitDim() {
    $("dimView").style.display = "none";
    $("normalView").style.display = "block";
    $("playBtn").focus();
  }

  function isDimmed() {
    return $("dimView").style.display !== "none";
  }

  // Minimal linear D-pad focus mover, same pattern as the home-customizer app.
  function setupNav() {
    var order = [$("playBtn"), $("volDown"), $("volUp"), $("dimBtn")];
    order[0].focus();

    document.addEventListener("keydown", function (e) {
      if (isDimmed()) {
        if (e.keyCode === 13 || e.keyCode === 461 /* back */) {
          exitDim();
        }
        return;
      }
      var idx = order.indexOf(document.activeElement);
      if (idx === -1) { idx = 0; }
      switch (e.keyCode) {
        case 39:
        case 40:
          idx = Math.min(order.length - 1, idx + 1);
          order[idx].focus();
          e.preventDefault();
          break;
        case 37:
        case 38:
          idx = Math.max(0, idx - 1);
          order[idx].focus();
          e.preventDefault();
          break;
        case 13:
          document.activeElement && document.activeElement.click();
          break;
        default:
          break;
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    player = $("player");
    player.volume = volume;
    updateVolumeLabel();

    $("playBtn").addEventListener("click", togglePlay);
    $("volDown").addEventListener("click", function () { changeVolume(-0.1); });
    $("volUp").addEventListener("click", function () { changeVolume(0.1); });
    $("dimBtn").addEventListener("click", enterDim);
    $("dimView").addEventListener("click", exitDim);

    setupNav();
    fetchNowPlaying();
    setInterval(fetchNowPlaying, NOWPLAYING_POLL_MS);
  });
})();
