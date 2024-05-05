document.addEventListener("DOMContentLoaded", () => {
  const audioToggle = document.getElementById("audio-toggle");
  const audio = document.getElementById("background-audio");

  // 初始状态标志
  let isPlaying = true;

  // 播放或暂停音频并更新按钮状态
  const toggleAudio = () => {
    if (isPlaying) {
      audio.pause();
      audioToggle.textContent = "🔇"; // 显示静音图标
    } else {
      audio.play().catch((error) => {
        console.error("Error playing background audio:", error);
      });
      audioToggle.textContent = "🔊"; // 显示声音图标
    }
    isPlaying = !isPlaying;
  };

  // 点击按钮时切换音频状态
  audioToggle.addEventListener("click", toggleAudio);
});
