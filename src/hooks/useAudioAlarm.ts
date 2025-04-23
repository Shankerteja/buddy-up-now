export const useAudioAlarm = () => {
  const playAlarm = () => {
    try {
      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create oscillator
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Configure oscillator
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
      
      // Configure gain
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Start oscillator
      oscillator.start();
      
      // Store references for cleanup
      (window as any).emergencyAlarm = {
        audioContext,
        oscillator,
        gainNode
      };
      
    } catch (error) {
      console.error('Error setting up alarm:', error);
    }
  };

  const stopAlarm = () => {
    try {
      const alarm = (window as any).emergencyAlarm;
      if (alarm) {
        alarm.oscillator.stop();
        alarm.audioContext.close();
        (window as any).emergencyAlarm = null;
      }
    } catch (error) {
      console.error('Error stopping alarm:', error);
    }
  };

  return { playAlarm, stopAlarm };
};
