
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useMediaRecording = () => {
  const [recording, setRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMediaStream(stream);
      setRecording(true);
      
      toast({
        title: 'Recording Started',
        description: 'Audio and video recording has started.',
      });
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        title: 'Recording Error',
        description: 'Unable to access camera or microphone.',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
      setRecording(false);
      
      toast({
        title: 'Recording Stopped',
        description: 'Audio and video recording has stopped.',
      });
    }
  };

  return { recording, mediaStream, startRecording, stopRecording };
};
