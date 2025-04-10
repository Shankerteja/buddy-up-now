
export const useAudioAlarm = () => {
  const playAlarm = () => {
    try {
      const audio = new Audio('/alarm.mp3');
      audio.loop = true;
      audio.volume = 0.7;
      audio.id = 'emergency-alarm';
      document.body.appendChild(audio);
      audio.play().catch(error => {
        console.error('Error playing alarm:', error);
      });
    } catch (error) {
      console.error('Error setting up alarm:', error);
    }
  };

  const stopAlarm = () => {
    const audio = document.getElementById('emergency-alarm') as HTMLAudioElement;
    if (audio) {
      audio.pause();
      audio.remove();
    }
  };

  return { playAlarm, stopAlarm };
};
