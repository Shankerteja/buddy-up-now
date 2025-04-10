
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface VoiceCommandProps {
  onEmergency: () => void;
}

const VoiceCommand: React.FC<VoiceCommandProps> = ({ onEmergency }) => {
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        
        // Emergency phrases
        const emergencyPhrases = ['help me', 'emergency', 'help', 'sos', 'danger'];
        
        if (emergencyPhrases.some(phrase => transcript.includes(phrase))) {
          toast({
            title: 'Emergency Voice Command Detected!',
            description: `You said: "${transcript}"`,
            variant: 'destructive',
          });
          
          onEmergency();
        }
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          toast({
            title: 'Microphone Access Denied',
            description: 'Please grant microphone permissions to use voice commands.',
            variant: 'destructive',
          });
        }
        setListening(false);
      };
      
      recognitionInstance.onend = () => {
        if (listening) {
          // Restart if it was still supposed to be listening
          recognitionInstance.start();
        }
      };
      
      setRecognition(recognitionInstance);
    }
    
    // Clean up
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      toast({
        title: 'Not Supported',
        description: 'Voice recognition is not supported in your browser.',
        variant: 'destructive',
      });
      return;
    }
    
    if (listening) {
      recognition.stop();
      setListening(false);
      toast({
        title: 'Voice Command Disabled',
        description: 'No longer listening for emergency phrases.',
      });
    } else {
      recognition.start();
      setListening(true);
      toast({
        title: 'Voice Command Enabled',
        description: 'Say "help me" or "emergency" to trigger SOS.',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Volume2 className="mr-2 text-purple-600" />
          Voice Command
        </CardTitle>
        <CardDescription>
          Enable voice detection to trigger emergency mode by saying "Help me"
        </CardDescription>
      </CardHeader>
      <CardContent>
        {listening && (
          <div className="flex items-center justify-center gap-2 p-3 bg-purple-50 rounded-lg mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-400 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-purple-500 rounded-full p-2">
                <Mic className="h-5 w-5 text-white" />
              </div>
            </div>
            <span className="font-medium text-purple-700">Listening for commands...</span>
          </div>
        )}
        
        <div className="text-sm space-y-2">
          <p className="font-medium">Detected voice commands:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>"Help me"</li>
            <li>"Emergency"</li>
            <li>"SOS"</li>
            <li>"Help"</li>
            <li>"Danger"</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={toggleListening}
          variant={listening ? "destructive" : "default"}
          className={`w-full ${!listening ? "bg-purple-600 hover:bg-purple-700" : ""}`}
        >
          {listening ? (
            <>
              <MicOff className="mr-2 h-4 w-4" />
              Stop Voice Detection
            </>
          ) : (
            <>
              <Mic className="mr-2 h-4 w-4" />
              Start Voice Detection
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VoiceCommand;
