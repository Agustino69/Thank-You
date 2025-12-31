import React, { useState, useEffect } from 'react';
import { Person } from '../types';
import { Plus, Trash2, Save, X, Copy, Check } from 'lucide-react';

// Simple ID generator replacement
const generateId = () => Math.random().toString(36).substr(2, 9);

interface AdminProps {
  initialPeople: Person[];
  onSave: (people: Person[]) => void;
  onClose: () => void;
}

const Admin: React.FC<AdminProps> = ({ initialPeople, onSave, onClose }) => {
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [selectedId, setSelectedId] = useState<string | null>(people[0]?.id || null);
  const [hasCopied, setHasCopied] = useState(false);

  // Form states
  const selectedPerson = people.find(p => p.id === selectedId);

  const handleUpdate = (field: keyof Person, value: any) => {
    if (!selectedPerson) return;
    const updatedPeople = people.map(p => 
      p.id === selectedId ? { ...p, [field]: value } : p
    );
    setPeople(updatedPeople);
  };

  const handleAddPerson = () => {
    const newPerson: Person = {
      id: generateId(),
      accessKeys: ['nuevo'],
      displayName: 'Nombre Nuevo',
      message: 'Escribe tu mensaje aquí...',
      images: [],
      videoUrl: '',
      themeColor: '#4A463E'
    };
    setPeople([...people, newPerson]);
    setSelectedId(newPerson.id);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este registro?')) {
      const filtered = people.filter(p => p.id !== id);
      setPeople(filtered);
      if (selectedId === id) setSelectedId(filtered[0]?.id || null);
    }
  };

  const handleSaveAll = () => {
    onSave(people);
    alert('Datos guardados localmente.');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(people, null, 2));
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col md:flex-row text-sm font-sans text-gray-800">
      {/* Sidebar List */}
      <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-1/3 md:h-full">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-100">
          <span className="font-bold uppercase tracking-wider text-xs">Registros</span>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {people.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-100 flex justify-between items-center ${selectedId === p.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
            >
              <div className="truncate">
                <div className="font-semibold text-gray-900">
                  {p.accessKeys && p.accessKeys.length > 0 ? p.accessKeys[0] : '(sin clave)'}
                </div>
                <div className="text-xs text-gray-500">{p.displayName}</div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                className="text-gray-400 hover:text-red-500 p-1"
              >
                <Trash2 size={14} />
              </button>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleAddPerson}
            className="w-full py-2 flex items-center justify-center gap-2 border border-dashed border-gray-400 rounded hover:bg-white hover:border-blue-500 hover:text-blue-500 transition-colors"
          >
            <Plus size={16} /> Nuevo
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col h-2/3 md:h-full bg-white overflow-hidden">
        {selectedPerson ? (
          <div className="flex-1 overflow-y-auto p-6 md:p-10">
            <div className="max-w-3xl mx-auto space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Claves de Acceso</label>
                  <input 
                    type="text" 
                    value={selectedPerson.accessKeys.join(', ')}
                    onChange={(e) => handleUpdate('accessKeys', e.target.value.split(',').map(s => s.trim()))}
                    placeholder="ej: juan, juanito, guest"
                    className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">Separa múltiples contraseñas con comas.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nombre Visible</label>
                  <input 
                    type="text" 
                    value={selectedPerson.displayName}
                    onChange={(e) => handleUpdate('displayName', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Color del Tema</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="color" 
                    value={selectedPerson.themeColor || '#4A463E'}
                    onChange={(e) => handleUpdate('themeColor', e.target.value)}
                    className="w-12 h-12 p-1 rounded border border-gray-200 cursor-pointer"
                  />
                  <input 
                     type="text"
                     value={selectedPerson.themeColor || '#4A463E'}
                     onChange={(e) => handleUpdate('themeColor', e.target.value)}
                     className="p-2 border border-gray-300 rounded font-mono text-sm uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Mensaje</label>
                <textarea 
                  rows={8}
                  value={selectedPerson.message}
                  onChange={(e) => handleUpdate('message', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-serif text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Imágenes (URLs)</label>
                <textarea 
                  rows={3}
                  value={selectedPerson.images.join('\n')}
                  onChange={(e) => handleUpdate('images', e.target.value.split('\n').filter(Boolean))}
                  placeholder="https://example.com/photo1.jpg"
                  className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none font-mono text-xs"
                />
                <p className="text-xs text-gray-400 mt-1">Una URL por línea.</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Video Link (YouTube/URL)</label>
                <input 
                  type="text" 
                  value={selectedPerson.videoUrl || ''}
                  onChange={(e) => handleUpdate('videoUrl', e.target.value)}
                  placeholder="https://youtube.com/..."
                  className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none"
                />
              </div>

            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 uppercase tracking-widest text-xs">
            Selecciona un registro
          </div>
        )}

        {/* Action Bar */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <button 
            onClick={copyToClipboard}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-2"
          >
            {hasCopied ? <Check size={16} className="text-green-600"/> : <Copy size={16} />}
            <span className="text-xs font-bold uppercase">{hasCopied ? 'JSON Copiado' : 'Copiar JSON'}</span>
          </button>

          <button 
            onClick={handleSaveAll}
            className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-2 rounded hover:bg-zinc-700 transition-colors shadow-lg"
          >
            <Save size={16} />
            <span className="text-xs font-bold uppercase">Guardar Cambios</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;