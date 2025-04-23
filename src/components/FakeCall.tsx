import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Phone, PhoneCall, PhoneOff, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const FakeCall: React.FC = () => {
  const [callerName, setCallerName] = useState('Mom');
  const [callDelay, setCallDelay] = useState(5);
  const [isCallActive, setIsCallActive] = useState(false);
  const [ringing, setRinging] = useState(false);
  const { toast } = useToast();

  const scheduleCall = () => {
    if (callDelay < 1 || callDelay > 60) {
      toast({
        title: 'Invalid Delay',
        description: 'Please set a delay between 1 and 60 seconds.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Fake Call Scheduled',
      description: `Your phone will ring in ${callDelay} seconds.`,
    });

    setTimeout(() => {
      startCall();
    }, callDelay * 1000);
  };

  const startCall = () => {
    setRinging(true);
    
    // Create ringtone using Web Audio API
    try {
      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create oscillator for ringtone
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Configure oscillator for ringtone sound
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      
      // Create a simple ringtone pattern
      const ringPattern = () => {
        // Ring on
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        
        // Ring off after 1 second
        gainNode.gain.setValueAtTime(0, audioContext.currentTime + 1);
        
        // Ring on again after 2 seconds
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + 2);
        
        // Ring off after 3 seconds
        gainNode.gain.setValueAtTime(0, audioContext.currentTime + 3);
        
        // Repeat the pattern
        setTimeout(() => {
          if (ringing) {
            ringPattern();
          }
        }, 4000);
      };
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Start oscillator
      oscillator.start();
      
      // Start ring pattern
      ringPattern();
      
      // Store references for cleanup
      (window as any).fakeCallAudio = {
        audioContext,
        oscillator,
        gainNode
      };
    } catch (error) {
      console.error('Error playing ringtone:', error);
    }
    
    setTimeout(() => {
      setRinging(false);
      setIsCallActive(true);
    }, 3000);
  };

  const endCall = () => {
    // Stop ringtone
    const audio = (window as any).fakeCallAudio;
    if (audio) {
      audio.oscillator.stop();
      audio.audioContext.close();
      (window as any).fakeCallAudio = null;
    }
    
    setRinging(false);
    setIsCallActive(false);
    
    toast({
      title: 'Call Ended',
      description: 'The fake call has ended.',
    });
  };

  // Auto-end call after 30 seconds
  React.useEffect(() => {
    if (isCallActive) {
      const timer = setTimeout(() => {
        endCall();
      }, 30000);
      
      return () => clearTimeout(timer);
    }
  }, [isCallActive]);

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Phone className="mr-2 text-primary" />
            Fake Call
          </CardTitle>
          <CardDescription>Schedule a fake incoming call to help you get out of uncomfortable situations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="callerName">Caller Name</Label>
            <Input 
              id="callerName" 
              value={callerName} 
              onChange={(e) => setCallerName(e.target.value)} 
              placeholder="Mom"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="callDelay">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Call Delay (seconds)
              </div>
            </Label>
            <Input 
              id="callDelay" 
              type="number" 
              min="1"
              max="60"
              value={callDelay} 
              onChange={(e) => setCallDelay(parseInt(e.target.value) || 5)} 
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={scheduleCall} className="w-full">
            <PhoneCall className="mr-2 h-4 w-4" />
            Schedule Fake Call
          </Button>
        </CardFooter>
      </Card>

      {/* Incoming Call Dialog */}
      <Dialog open={ringing} onOpenChange={(open) => !open && endCall()}>
        <DialogContent className="bg-green-50 border-green-500 sm:max-w-md">
          <DialogTitle className="text-center text-green-700">
            Incoming Call...
          </DialogTitle>
          <div className="flex justify-center my-8">
            <div className="bg-green-100 rounded-full p-8 animate-pulse">
              <PhoneCall className="h-16 w-16 text-green-500" />
            </div>
          </div>
          <DialogDescription className="text-center text-lg font-semibold">
            {callerName}
          </DialogDescription>
          <div className="flex justify-center space-x-4 mt-4">
            <Button 
              onClick={endCall} 
              variant="destructive"
              className="rounded-full h-14 w-14 p-0"
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
            <Button 
              onClick={() => {
                setRinging(false);
                setIsCallActive(true);
              }} 
              className="bg-green-500 hover:bg-green-600 rounded-full h-14 w-14 p-0"
            >
              <Phone className="h-6 w-6" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Active Call Dialog */}
      <Dialog open={isCallActive} onOpenChange={(open) => !open && endCall()}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="text-center">On call with {callerName}</DialogTitle>
          <div className="flex justify-center my-8">
            <div className="bg-gray-100 rounded-full p-8">
              <Phone className="h-16 w-16 text-primary" />
            </div>
          </div>
          <div className="text-center text-lg font-semibold" id="callTimer">
            00:00
          </div>
          <div className="flex justify-center mt-4">
            <Button 
              onClick={endCall} 
              variant="destructive"
              className="rounded-full h-14 w-14 p-0"
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FakeCall;
