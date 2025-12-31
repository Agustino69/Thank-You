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

  useEffect(() => {
    setPeople(getPeople());
  }, []);

  const handleUnlock = (code: string) => {
    // Check for admin code
    if (code === ADMIN_CODE) {
      setView('ADMIN');
      return;
    }

    // Check for user (check if code exists in accessKeys array)
    const person = people.find(p => 
      p.accessKeys && p.accessKeys.some(key => key.toLowerCase() === code.toLowerCase())
    );
    
    if (person) {
      setActivePerson(person);
      setView('CONTENT');
    } else {
      // Subtle shake or error could go here, for now just log
      console.log('Access denied');
      alert('Código no reconocido.');
    }
  };

  const handleAdminSave = (updatedPeople: Person[]) => {
    savePeople(updatedPeople);
    setPeople(updatedPeople);
  };

  const handleExitContent = () => {
    setActivePerson(null);
    setView('LANDING');
  };

  return (
    <div className="font-sans antialiased">
      <AnimatePresence mode="wait">
        {view === 'LANDING' && (
          <Landing key="landing" onUnlock={handleUnlock} />
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