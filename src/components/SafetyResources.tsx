
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Info, Shield, Gavel, Dumbbell } from 'lucide-react';

const SafetyResources: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Info className="mr-2 text-primary" />
          Safety Resources
        </CardTitle>
        <CardDescription>Helpful information to keep you safe in various situations</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tips">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="tips" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Safety Tips
            </TabsTrigger>
            <TabsTrigger value="legal" className="flex items-center">
              <Gavel className="mr-2 h-4 w-4" />
              Legal Rights
            </TabsTrigger>
            <TabsTrigger value="defense" className="flex items-center">
              <Dumbbell className="mr-2 h-4 w-4" />
              Self Defense
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[300px] rounded-md border p-4">
            <TabsContent value="tips" className="space-y-4">
              <h3 className="text-lg font-semibold">General Safety Tips</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Always share your location with a trusted friend when meeting someone new</li>
                <li>Keep your phone charged and easily accessible</li>
                <li>Trust your instincts - if something feels wrong, it probably is</li>
                <li>Avoid walking alone at night in unfamiliar or poorly lit areas</li>
                <li>Keep an eye on your drinks at all times in public places</li>
                <li>Have emergency contacts saved and easily accessible</li>
                <li>Consider using the buddy system when going out</li>
                <li>Be aware of your surroundings and limit distractions</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6">Transportation Safety</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Verify ride-share driver and vehicle details before entering</li>
                <li>Share your ride details with a trusted contact</li>
                <li>Sit in the back seat when using a taxi or ride-share</li>
                <li>Don't wait for public transportation alone in isolated areas</li>
                <li>Have your keys ready before reaching your car or home</li>
              </ul>
            </TabsContent>
            
            <TabsContent value="legal" className="space-y-4">
              <h3 className="text-lg font-semibold">Know Your Rights</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This information is general guidance and not legal advice. Laws vary by location.
              </p>
              
              <h4 className="font-medium">Personal Safety Orders</h4>
              <p className="text-sm mb-2">
                You have the right to seek a restraining or protective order if someone is harassing or threatening you.
                These are available through local courts and can prohibit someone from contacting or approaching you.
              </p>
              
              <h4 className="font-medium mt-4">Reporting Crimes</h4>
              <p className="text-sm mb-2">
                You have the right to report crimes without fear of retaliation. Police departments are required to
                take reports of threats, harassment, assault, and other crimes.
              </p>
              
              <h4 className="font-medium mt-4">Digital Privacy</h4>
              <p className="text-sm mb-2">
                You have rights regarding your digital information. Unauthorized access to your accounts
                or sharing intimate images without consent may be illegal depending on your jurisdiction.
              </p>
              
              <h4 className="font-medium mt-4">Workplace Safety</h4>
              <p className="text-sm mb-2">
                Employers have a legal obligation to provide a safe work environment free from harassment and threats.
                Report unsafe conditions to HR or appropriate authorities.
              </p>
            </TabsContent>
            
            <TabsContent value="defense" className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Self-Defense Techniques</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The best self-defense is awareness and avoiding dangerous situations. These tips are for emergency situations only.
              </p>
              
              <h4 className="font-medium">Key Vulnerable Points</h4>
              <p className="text-sm mb-2">
                If you must defend yourself, target the most vulnerable areas: eyes, nose, throat, groin, and knees.
              </p>
              
              <h4 className="font-medium mt-4">Basic Strikes</h4>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Palm Strike: Push the heel of your palm upward into an attacker's nose or chin</li>
                <li>Elbow Strike: Use your elbow to strike to the side or backward</li>
                <li>Knee Strike: Raise your knee forcefully toward the groin area</li>
              </ul>
              
              <h4 className="font-medium mt-4">If Grabbed From Behind</h4>
              <p className="text-sm mb-2">
                Drop your weight, bend forward, and use your elbow to strike backward. Then turn and run.
              </p>
              
              <h4 className="font-medium mt-4">Using Your Voice</h4>
              <p className="text-sm mb-2">
                Yell specific commands like "BACK OFF!" or "CALL 911!" rather than just screaming.
                Being loud can attract attention and may deter an attacker.
              </p>
              
              <div className="bg-muted p-3 rounded-md mt-4">
                <p className="text-sm font-medium">Find Local Classes</p>
                <p className="text-xs text-muted-foreground">
                  Consider taking a local self-defense class for proper training and practice.
                  Many community centers and gyms offer affordable options.
                </p>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SafetyResources;
