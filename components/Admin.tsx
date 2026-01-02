import React, { useState } from 'react';
import { Person, EasterEgg } from '../types';
import { Plus, Trash2, Save, X, Copy, Check, HelpCircle, Code, Volume2, Gamepad2 } from 'lucide-react';
import { useFavicon } from '../hooks/useFavicon';

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
  const [showTutorial, setShowTutorial] = useState(false);

  // Set favicon for Admin panel
  useFavicon('#000000');

  // Form states
  const selectedPerson = people.find(p => p.id === selectedId);

  const handleUpdate = (field: keyof Person, value: any) => {
    if (!selectedPerson) return;
    const updatedPeople = people.map(p => 
      p.id === selectedId ? { ...p, [field]: value } : p
    );
    setPeople(updatedPeople);
  };

  // Easter Egg Handlers
  const handleAddEgg = () => {
    if (!selectedPerson) return;
    const currentEggs = selectedPerson.easterEggs || [];
    handleUpdate('easterEggs', [...currentEggs, { code: '', response: '' }]);
  };

  const handleUpdateEgg = (index: number, field: keyof EasterEgg, value: string) => {
    if (!selectedPerson || !selectedPerson.easterEggs) return;
    const newEggs = [...selectedPerson.easterEggs];
    newEggs[index] = { ...newEggs[index], [field]: value };
    handleUpdate('easterEggs', newEggs);
  };

  const handleDeleteEgg = (index: number) => {
    if (!selectedPerson || !selectedPerson.easterEggs) return;
    const newEggs = selectedPerson.easterEggs.filter((_, i) => i !== index);
    handleUpdate('easterEggs', newEggs);
  };

  const handleAddPerson = () => {
    const newPerson: Person = {
      id: generateId(),
      accessKeys: ['nuevo'],
      displayName: 'Nombre Nuevo',
      message: 'Escribe tu mensaje aquí...',
      images: [],
      videoUrl: '',
      spotifyUrl: '',
      spotifyMessage: '',
      themeColor: '#4A463E',
      easterEggs: []
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
    alert('Datos guardados localmente (Browser Storage). Para guardar permanentemente, usa el botón de "Cómo hacer Hardcode".');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(people, null, 2));
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col md:flex-row text-sm font-sans text-gray-800">
      
      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-zinc-800">
                <Code size={20} className="text-blue-600" /> Tutorial: Persistencia de Datos
              </h3>
              <button onClick={() => setShowTutorial(false)} className="p-1 hover:bg-gray-100 rounded text-gray-500">
                <X size={20} />
              </button>
            </div>
            
            <div className="prose prose-sm text-gray-600 space-y-4">
              <p className="text-amber-800 bg-amber-50 p-3 rounded border border-amber-200">
                <strong>¡Atención!</strong> Los cambios que realizas en este panel se guardan temporalmente en tu navegador.
                Para que estos cambios sean visibles para <strong>todo el mundo</strong> cuando publiques la web, debes actualizar el código fuente.
              </p>
              
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-4 uppercase tracking-wider text-xs">Instrucciones Paso a Paso:</h4>
                <ol className="list-decimal pl-4 space-y-4 marker:text-gray-400">
                  <li>
                    <span className="font-semibold text-gray-700">Configura todo:</span> Edita los perfiles, mensajes, colores, música y huevos de pascua en este panel hasta que esté perfecto.
                  </li>
                  <li>
                    <span className="font-semibold text-gray-700">Copia los datos:</span> Presiona el botón <strong className="text-blue-600 inline-flex items-center gap-1 bg-white border px-1.5 py-0.5 rounded text-xs"><Copy size={10} /> Copiar JSON</strong> situado abajo a la izquierda.
                  </li>
                  <li>
                    <span className="font-semibold text-gray-700">Edita el código:</span> Abre el archivo <code className="bg-white px-1.5 py-0.5 rounded border font-mono text-red-500 text-xs">constants.ts</code> en tu editor de código.
                  </li>
                  <li>
                    <span className="font-semibold text-gray-700">Reemplaza:</span> Busca la constante <code className="font-mono text-purple-600 bg-purple-50 px-1 rounded">INITIAL_PEOPLE</code>. Borra todo su contenido actual y pega lo que acabas de copiar.
                    <div className="mt-2 text-[10px] bg-zinc-900 text-zinc-400 p-2 rounded font-mono overflow-x-auto">
                        export const INITIAL_PEOPLE: Person[] = [ ...PEGA_AQUÍ... ];
                    </div>
                  </li>
                  <li>
                    <span className="font-semibold text-gray-700">Publica:</span> Guarda el archivo y haz el despliegue (deploy) de tu aplicación nuevamente.
                  </li>
                </ol>
              </div>
            </div>

            <button 
              onClick={() => setShowTutorial(false)}
              className="mt-6 w-full bg-zinc-900 text-white py-3 rounded-lg hover:bg-zinc-800 font-medium transition-colors"
            >
              Entendido, volver al editor
            </button>
          </div>
        </div>
      )}

      {/* Sidebar List */}
      <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-1/3 md:h-full">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-100">
          <span className="font-bold uppercase tracking-wider text-xs">Registros</span>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowTutorial(true)} 
              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
              title="Cómo guardar permanentemente"
            >
              <HelpCircle size={16} />
            </button>
            <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
              <X size={16} />
            </button>
          </div>
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
            <div className="max-w-3xl mx-auto space-y-8">
              
              {/* Basic Info */}
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

              {/* Theme Color */}
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

              {/* Message */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Mensaje</label>
                <textarea 
                  rows={8}
                  value={selectedPerson.message}
                  onChange={(e) => handleUpdate('message', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-serif text-base"
                />
              </div>

              {/* Background Music (NEW) */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-xs font-bold uppercase text-gray-600 mb-3 flex items-center gap-2">
                    <Volume2 size={16} /> Música de Fondo (Auto-Play)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">URL del Audio (mp3)</label>
                        <input 
                            type="text" 
                            value={selectedPerson.bgmUrl || ''}
                            onChange={(e) => handleUpdate('bgmUrl', e.target.value)}
                            placeholder="https://example.com/song.mp3"
                            className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none"
                        />
                    </div>
                    <div>
                         <label className="block text-xs text-gray-500 mb-1">
                            Volumen: {Math.round((selectedPerson.bgmVolume ?? 0.3) * 100)}%
                         </label>
                         <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.05"
                            value={selectedPerson.bgmVolume ?? 0.3}
                            onChange={(e) => handleUpdate('bgmVolume', parseFloat(e.target.value))}
                            className="w-full cursor-pointer accent-blue-600"
                         />
                    </div>
                </div>
              </div>

              {/* Images */}
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

              {/* Media Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div>
                   <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Spotify (Canción/Playlist)</label>
                   <div className="space-y-2">
                    <input 
                      type="text" 
                      value={selectedPerson.spotifyUrl || ''}
                      onChange={(e) => handleUpdate('spotifyUrl', e.target.value)}
                      placeholder="https://open.spotify.com/track/..."
                      className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none"
                    />
                    <textarea 
                       rows={2}
                       value={selectedPerson.spotifyMessage || ''}
                       onChange={(e) => handleUpdate('spotifyMessage', e.target.value)}
                       placeholder="Mensaje sobre por qué esta canción..."
                       className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none text-xs"
                    />
                   </div>
                </div>
              </div>

              {/* Easter Eggs (NEW) */}
              <div className="border-t pt-6">
                  <h4 className="text-xs font-bold uppercase text-gray-600 mb-3 flex items-center gap-2">
                    <Gamepad2 size={16} /> Easter Eggs (Respuestas Secretas)
                  </h4>
                  <div className="space-y-3">
                      {(selectedPerson.easterEggs || []).map((egg, idx) => (
                          <div key={idx} className="flex gap-2 items-start bg-gray-50 p-2 rounded">
                              <input 
                                  type="text"
                                  placeholder="Código (ej: hola)"
                                  value={egg.code}
                                  onChange={(e) => handleUpdateEgg(idx, 'code', e.target.value)}
                                  className="w-1/3 p-2 border border-gray-300 rounded text-sm"
                              />
                              <input 
                                  type="text"
                                  placeholder="Respuesta de terminal"
                                  value={egg.response}
                                  onChange={(e) => handleUpdateEgg(idx, 'response', e.target.value)}
                                  className="flex-1 p-2 border border-gray-300 rounded text-sm font-mono text-xs"
                              />
                              <button 
                                onClick={() => handleDeleteEgg(idx)}
                                className="p-2 text-gray-400 hover:text-red-500"
                              >
                                  <Trash2 size={16} />
                              </button>
                          </div>
                      ))}
                      <button 
                        onClick={handleAddEgg}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-bold"
                      >
                          <Plus size={14} /> Añadir Secreto
                      </button>
                  </div>
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
          <div className="flex gap-2">
             <button 
              onClick={copyToClipboard}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-2 border border-gray-300 rounded bg-white"
            >
              {hasCopied ? <Check size={16} className="text-green-600"/> : <Copy size={16} />}
              <span className="text-xs font-bold uppercase">{hasCopied ? 'Copiado' : 'Copiar JSON'}</span>
            </button>
            <button 
              onClick={() => setShowTutorial(true)}
              className="hidden md:flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-4 py-2 border border-transparent rounded"
            >
              <Code size={16} />
              <span className="text-xs font-bold uppercase">Cómo hacer Hardcode</span>
            </button>
          </div>

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