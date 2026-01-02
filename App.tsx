import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Landing from './components/Landing';
import Content from './components/Content';
import Admin from './components/Admin';
import { Person, ViewState } from './types';
import { ADMIN_CODE } from './constants';
import { getPeople, savePeople } from './services/storageService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  const [people, setPeople] = useState<Person[]>([]);
  const [activePerson, setActivePerson] = useState<Person | null>(null);
  
  const [loginError, setLoginError] = useState(false);
  const [systemMessage, setSystemMessage] = useState<string | undefined>(undefined);
  
  // New state for transition animation
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setPeople(getPeople());
  }, []);

  const handleUnlock = (code: string) => {
    setSystemMessage(undefined);
    setLoginError(false);

    // Check for admin code
    if (code === ADMIN_CODE) {
      setIsTransitioning(true);
      setActivePerson(null); 
      return;
    }

    // 1. Check for Easter Eggs first (Global search across all profiles)
    let foundEgg = false;
    people.forEach(p => {
        const egg = p.easterEggs?.find(e => e.code.toLowerCase() === code.toLowerCase());
        if (egg) {
            setSystemMessage(egg.response);
            foundEgg = true;
        }
    });
    if (foundEgg) return;

    // 2. Check for User Access
    const person = people.find(p => 
      p.accessKeys && p.accessKeys.some(key => key.toLowerCase() === code.toLowerCase())
    );
    
    if (person) {
      setActivePerson(person);
      setIsTransitioning(true); // Trigger transition animation in Landing
    } else {
      setLoginError(true);
      console.log('Access denied');
    }
  };

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
    // If activePerson is null but we triggered transition, it's ADMIN
    if (!activePerson && view === 'LANDING') { 
        setView('ADMIN');
    } else {
        setView('CONTENT');
    }
  };

  const handleAdminSave = (updatedPeople: Person[]) => {
    savePeople(updatedPeople);
    setPeople(updatedPeople);
  };

  const handleExitContent = () => {
    setActivePerson(null);
    setView('LANDING');
    setSystemMessage(undefined);
  };

  return (
    <div className="font-sans antialiased">
      <AnimatePresence mode="wait">
        {view === 'LANDING' && (
          <Landing 
            key="landing" 
            onUnlock={handleUnlock} 
            isUnlocking={isTransitioning}
            onTransitionComplete={handleTransitionComplete}
            error={loginError}
            systemMessage={systemMessage}
            onClearError={() => { setLoginError(false); setSystemMessage(undefined); }}
            transitionColor={activePerson?.themeColor}
          />
        )}
        
        {view === 'CONTENT' && activePerson && (
          <Content key="content" person={activePerson} onExit={handleExitContent} />
        )}
      </AnimatePresence>

      {view === 'ADMIN' && (
        <Admin 
          initialPeople={people} 
          onSave={handleAdminSave} 
          onClose={() => setView('LANDING')} 
        />
      )}
    </div>
  );
};

export default App;