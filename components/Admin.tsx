import React, { useState } from 'react';
import { Person, EasterEgg, EasterEggType, SystemConfig } from '../types';
import { Plus, Trash2, X, Copy, Check, HelpCircle, Code, Volume2, Gamepad2, Calendar, Layout, Image as ImageIcon, Youtube, Music, List, Mic, Settings, HardDrive, Keyboard, Sparkles, Eye } from 'lucide-react';
import { useFavicon } from '../hooks/useFavicon';
import Content from './Content';

// Simple ID generator replacement
const generateId = () => Math.random().toString(36).substr(2, 9);

interface AdminProps {
  initialPeople: Person[];
  initialSystemConfig: SystemConfig;
  onSave: (people: Person[]) => void;
  onSaveSystemConfig: (config: SystemConfig) => void;
  onClose: () => void;
}

type TabType = 'info' | 'gallery' | 'media' | 'secrets';
type EditorMode = 'PROFILES' | 'SYSTEM';

const Admin: React.FC<AdminProps> = ({ initialPeople, initialSystemConfig, onSave, onSaveSystemConfig, onClose }) => {
  const [mode, setMode] = useState<EditorMode>('PROFILES');
  
  // Profile State
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [selectedId, setSelectedId] = useState<string | null>(people[0]?.id || null);
  const [activeTab, setActiveTab] = useState<TabType>('info');
  
  // System Config State
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(initialSystemConfig);
  
  // UI State
  const [hasCopied, setHasCopied] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false); // New Preview State
  
  // Input states for adding new content
  const [newImageInput, setNewImageInput] = useState('');
  const [newVideoInput, setNewVideoInput] = useState('');

  // Set favicon for Admin panel
  useFavicon('#000000');

  // -------------------------
  // PROFILE HANDLERS
  // -------------------------
  const selectedPerson = people.find(p => p.id === selectedId);

  const handleUpdate = (field: keyof Person, value: any) => {
    if (!selectedPerson) return;
    const updatedPeople = people.map(p => 
      p.id === selectedId ? { ...p, [field]: value } : p
    );
    setPeople(updatedPeople);
    onSave(updatedPeople); // Update App state immediately (in memory)
  };

  // -------------------------
  // SMART CONTENT HANDLERS (Images & Videos)
  // -------------------------
  
  // Handle adding images (bulk or single)
  const handleAddImages = () => {
    if (!selectedPerson || !newImageInput.trim()) return;
    
    // Split by newlines or commas to allow bulk pasting
    const newUrls = newImageInput
        .split(/[\n,]+/)
        .map(url => url.trim())
        .filter(url => url.length > 0);

    const currentImages = selectedPerson.images || [];
    handleUpdate('images', [...currentImages, ...newUrls]);
    setNewImageInput('');
  };

  const handleRemoveImage = (index: number) => {
      if (!selectedPerson) return;
      const currentImages = selectedPerson.images || [];
      handleUpdate('images', currentImages.filter((_, i) => i !== index));
  };

  // Handle adding videos
  const handleAddVideo = () => {
      if (!selectedPerson || !newVideoInput.trim()) return;
      const currentVideos = selectedPerson.videoUrls || [];
      handleUpdate('videoUrls', [...currentVideos, newVideoInput.trim()]);
      setNewVideoInput('');
  };

  const handleDeleteVideo = (index: number) => {
    if (!selectedPerson) return;
    const currentVideos = (selectedPerson.videoUrls || []).filter((_, i) => i !== index);
    handleUpdate('videoUrls', currentVideos);
  };

  // Easter Egg Handlers
  const handleAddEgg = () => {
    if (!selectedPerson) return;
    const currentEggs = selectedPerson.easterEggs || [];
    handleUpdate('easterEggs', [...currentEggs, { code: '', type: 'text', response: '' }]);
  };

  const handleUpdateEgg = (index: number, field: keyof EasterEgg, value: any) => {
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
      videoUrls: [],
      spotifyUrl: '',
      spotifyMessage: '',
      themeColor: '#4A463E',
      easterEggs: []
    };
    const newPeople = [...people, newPerson];
    setPeople(newPeople);
    onSave(newPeople);
    setSelectedId(newPerson.id);
    setActiveTab('info');
    setMode('PROFILES');
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este registro?')) {
      const filtered = people.filter(p => p.id !== id);
      setPeople(filtered);
      onSave(filtered);
      if (selectedId === id) setSelectedId(filtered[0]?.id || null);
    }
  };

  // -------------------------
  // SYSTEM CONFIG HANDLERS
  // -------------------------
  const handleUpdateSystem = (field: keyof SystemConfig, value: string) => {
      const newConfig = { ...systemConfig, [field]: value };
      setSystemConfig(newConfig);
      onSaveSystemConfig(newConfig);
  };

  // -------------------------
  // EXPORT
  // -------------------------
  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(people, null, 2));
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  // Helper for Drive Images Preview
  const getPreviewUrl = (url: string) => {
      if (url.includes('drive.google.com')) {
         const matches = url.match(/\/d\/(.+?)(\/|$)/) || url.match(/id=(.+?)(\&|$)/);
         if (matches && matches[1]) {
             return `https://drive.google.com/thumbnail?id=${matches[1]}&sz=w200`;
         }
      }
      return url;
  }

  // -------------------------
  // PREVIEW RENDER
  // -------------------------
  if (isPreviewing && selectedPerson) {
      return (
          <div className="fixed inset-0 z-[100] bg-black">
              {/* Preview Content */}
              <Content person={selectedPerson} onExit={() => setIsPreviewing(false)} />
              
              {/* Preview Banner Overlay */}
              <div className="fixed top-0 left-0 w-full bg-blue-600 text-white text-xs font-bold uppercase tracking-widest py-2 text-center z-[110] shadow-md pointer-events-none">
                  Modo Vista Previa
              </div>
              
              {/* Close Preview Button Override (Content's onExit handles logic, but this visual helps) */}
              <button 
                onClick={() => setIsPreviewing(false)}
                className="fixed top-4 right-4 z-[110] bg-black/80 text-white px-4 py-2 rounded-full text-xs uppercase tracking-widest hover:bg-black transition-colors flex items-center gap-2"
              >
                  <X size={14} /> Salir de Vista Previa
              </button>
          </div>
      )
  }

  // -------------------------
  // MAIN RENDER
  // -------------------------
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col md:flex-row text-sm font-sans text-gray-800">
      
      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-4 border-b pb-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-zinc-800">
                <Code size={20} className="text-blue-600" /> Tutorial: Publicar Cambios
              </h3>
              <button onClick={() => setShowTutorial(false)} className="p-1 hover:bg-gray-100 rounded text-gray-500">
                <X size={20} />
              </button>
            </div>
            <div className="prose prose-sm text-gray-600 space-y-4">
              <p className="text-amber-800 bg-amber-50 p-3 rounded border border-amber-200">
                Los cambios <strong>NO se guardan</strong> al cerrar la página. Debes seguir estos pasos:
              </p>
              <ol className="list-decimal pl-4 space-y-2">
                <li>Edita perfiles y usa "Vista Previa" para verificar.</li>
                <li>Presiona el botón negro <strong>EXPORTAR JSON</strong> (abajo izquierda).</li>
                <li>Abre el archivo <code>constants.ts</code> en tu editor de código.</li>
                <li>Reemplaza el contenido de <code>INITIAL_PEOPLE</code> con lo que copiaste.</li>
                <li>Sube tu código (Deploy) para que los cambios sean públicos y permanentes.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar List */}
      <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-1/4 md:h-full">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-100">
          <span className="font-bold uppercase tracking-wider text-xs">Admin Panel</span>
          <div className="flex gap-2">
            <button onClick={() => setShowTutorial(true)} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
              <HelpCircle size={16} />
            </button>
            <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
              <X size={16} />
            </button>
          </div>
        </div>
        
        {/* Profile List */}
        <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase">Perfiles</div>
            {people.map(p => (
                <button
                key={p.id}
                onClick={() => { setSelectedId(p.id); setMode('PROFILES'); }}
                className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-100 flex justify-between items-center ${mode === 'PROFILES' && selectedId === p.id ? 'bg-white border-l-4 border-l-blue-600 shadow-sm' : ''}`}
                >
                <div className="truncate">
                    <div className="font-semibold text-gray-900">
                    {p.accessKeys && p.accessKeys.length > 0 ? p.accessKeys[0] : '(sin clave)'}
                    </div>
                    <div className="text-xs text-gray-500">{p.displayName}</div>
                </div>
                <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                    className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100"
                >
                    <Trash2 size={14} />
                </button>
                </button>
            ))}
        </div>

        <div className="p-4 border-t border-gray-200 space-y-2">
           {/* Add Person */}
          <button onClick={handleAddPerson} className="w-full py-2 flex items-center justify-center gap-2 border border-dashed border-gray-400 rounded hover:bg-white hover:border-blue-500 hover:text-blue-500 transition-colors text-xs">
            <Plus size={14} /> Nuevo Perfil
          </button>
          
          {/* System Config Button */}
          <button 
             onClick={() => setMode('SYSTEM')}
             className={`w-full py-2 flex items-center justify-center gap-2 border rounded transition-colors text-xs font-bold uppercase ${mode === 'SYSTEM' ? 'bg-zinc-800 text-white border-zinc-900' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'}`}
          >
             <Settings size={14} /> Configuración Sistema
          </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col h-3/4 md:h-full bg-white overflow-hidden">
        {mode === 'SYSTEM' ? (
             <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50/30">
                 <div className="max-w-2xl mx-auto space-y-6">
                    <h2 className="text-xl font-bold text-zinc-800 flex items-center gap-2 mb-6">
                        <Settings className="text-zinc-500" /> Configuración Global
                    </h2>
                    
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                            <HardDrive size={18} className="text-zinc-600" />
                            <h3 className="font-bold uppercase text-xs text-zinc-500">Audio del Landing (Arranque)</h3>
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Sonido de Boot (Inicio)</label>
                            <input 
                                type="text"
                                value={systemConfig.bootSfxUrl}
                                onChange={(e) => handleUpdateSystem('bootSfxUrl', e.target.value)}
                                placeholder="https://..."
                                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none font-mono text-xs"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Sonido corto de disco duro iniciando.</p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Sonido Ambiental (Loop)</label>
                            <input 
                                type="text"
                                value={systemConfig.ambientSfxUrl}
                                onChange={(e) => handleUpdateSystem('ambientSfxUrl', e.target.value)}
                                placeholder="https://..."
                                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none font-mono text-xs"
                            />
                             <p className="text-[10px] text-gray-400 mt-1">Sonido de fondo constante (ventiladores, zumbido).</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                            <Sparkles size={18} className="text-zinc-600" />
                            <h3 className="font-bold uppercase text-xs text-zinc-500">Efectos Especiales</h3>
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2 flex items-center gap-2">
                                <Keyboard size={14} /> Beep al Escribir
                            </label>
                            <input 
                                type="text"
                                value={systemConfig.beepSfxUrl || ''}
                                onChange={(e) => handleUpdateSystem('beepSfxUrl', e.target.value)}
                                placeholder="https://..."
                                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none font-mono text-xs"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Sonido breve al presionar teclas. Compatible con Google Drive.</p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2 flex items-center gap-2">
                                <Sparkles size={14} /> Ruido Ocasional (Random)
                            </label>
                            <input 
                                type="text"
                                value={systemConfig.occasionalSfxUrl || ''}
                                onChange={(e) => handleUpdateSystem('occasionalSfxUrl', e.target.value)}
                                placeholder="https://..."
                                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none font-mono text-xs"
                            />
                             <p className="text-[10px] text-gray-400 mt-1">Sonido que se reproduce aleatoriamente (8-20s) en el landing (glitch, estática).</p>
                        </div>
                    </div>
                 </div>
             </div>
        ) : selectedPerson ? (
          <>
            {/* Tabs Header */}
            <div className="flex border-b border-gray-200 bg-white">
                <button 
                    onClick={() => setActiveTab('info')}
                    className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'info' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
                >
                    <Layout size={16} /> Perfil
                </button>
                <button 
                    onClick={() => setActiveTab('gallery')}
                    className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'gallery' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
                >
                    <ImageIcon size={16} /> Galería
                </button>
                <button 
                    onClick={() => setActiveTab('media')}
                    className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'media' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
                >
                    <Youtube size={16} /> Multimedia
                </button>
                <button 
                    onClick={() => setActiveTab('secrets')}
                    className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'secrets' ? 'border-purple-600 text-purple-600 bg-purple-50/50' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
                >
                    <Gamepad2 size={16} /> Secretos
                </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50/30">
                <div className="max-w-3xl mx-auto">
                    
                    {/* TAB: INFO */}
                    {activeTab === 'info' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
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
                                    <p className="text-xs text-gray-400 mt-1">Son las palabras que se escriben en el inicio.</p>
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
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Mensaje Principal</label>
                                    <textarea 
                                    rows={8}
                                    value={selectedPerson.message}
                                    onChange={(e) => handleUpdate('message', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-serif text-base"
                                    />
                                </div>
                             </div>
                        </div>
                    )}

                    {/* TAB: GALLERY (IMPROVED) */}
                    {activeTab === 'gallery' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-4 flex justify-between items-center">
                                    <span>Gestor de Imágenes</span>
                                    <span className="text-gray-400 font-normal normal-case">{(selectedPerson.images || []).length} imágenes</span>
                                </label>
                                
                                {/* Add Area */}
                                <div className="flex flex-col gap-2 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <div className="flex gap-2">
                                        <textarea
                                            value={newImageInput}
                                            onChange={(e) => setNewImageInput(e.target.value)}
                                            placeholder="Pega aquí una URL o una lista de enlaces (Google Drive, Photos, etc)..."
                                            rows={2}
                                            className="flex-1 p-2 border border-gray-300 rounded text-xs focus:border-blue-500 outline-none resize-none"
                                        />
                                        <button 
                                            onClick={handleAddImages}
                                            className="bg-blue-600 text-white px-4 rounded text-xs font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors flex flex-col items-center justify-center gap-1"
                                        >
                                            <Plus size={16} /> Agregar
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-gray-400">Tip: Puedes pegar varios enlaces separándolos con Enter.</p>
                                </div>

                                {/* List Area */}
                                <div className="space-y-2">
                                    {(selectedPerson.images || []).length === 0 && (
                                        <div className="text-center py-8 text-gray-400 italic bg-gray-50 rounded border border-dashed border-gray-200">
                                            No hay imágenes. Agrega algunas arriba.
                                        </div>
                                    )}
                                    {(selectedPerson.images || []).map((img, idx) => (
                                        <div key={idx} className="flex items-center gap-3 bg-white p-2 border border-gray-100 rounded hover:border-gray-300 transition-colors group">
                                            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden shrink-0">
                                                <img src={getPreviewUrl(img)} alt="" className="w-full h-full object-cover opacity-80" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/50?text=IMG' }} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs text-gray-600 truncate font-mono">{img}</div>
                                            </div>
                                            <button 
                                                onClick={() => handleRemoveImage(idx)}
                                                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                             </div>
                        </div>
                    )}

                    {/* TAB: MEDIA (IMPROVED) */}
                    {activeTab === 'media' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            
                            {/* Videos Section */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
                                        <Youtube size={16} /> Videos (YouTube / Drive)
                                    </label>
                                </div>

                                {/* Add Video Area */}
                                <div className="flex gap-2 mb-6">
                                    <input 
                                        type="text" 
                                        value={newVideoInput}
                                        onChange={(e) => setNewVideoInput(e.target.value)}
                                        placeholder="https://youtube.com/..."
                                        className="flex-1 p-2 border border-gray-300 rounded focus:border-blue-500 outline-none text-sm"
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddVideo()}
                                    />
                                    <button 
                                        onClick={handleAddVideo} 
                                        className="bg-zinc-100 text-zinc-700 hover:bg-zinc-200 hover:text-black px-4 rounded font-bold uppercase text-xs flex items-center gap-2"
                                    >
                                        <Plus size={14} /> Agregar
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {(!selectedPerson.videoUrls || selectedPerson.videoUrls.length === 0) && (
                                        <p className="text-sm text-gray-400 italic text-center py-4 bg-gray-50 rounded border border-dashed border-gray-200">No hay videos añadidos.</p>
                                    )}
                                    {(selectedPerson.videoUrls || []).map((url, idx) => (
                                        <div key={idx} className="flex items-center gap-3 bg-white p-2 border border-gray-100 rounded hover:border-gray-300 transition-colors">
                                            <div className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 rounded shrink-0">
                                                <Youtube size={16} />
                                            </div>
                                            <div className="flex-1 text-xs font-mono text-gray-600 truncate">{url}</div>
                                            <button onClick={() => handleDeleteVideo(idx)} className="p-2 text-gray-300 hover:text-red-500">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Spotify Section */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-4 flex items-center gap-2">
                                   <Music size={16} /> Spotify
                                </label>
                                <div className="space-y-4">
                                    <input 
                                        type="text" 
                                        value={selectedPerson.spotifyUrl || ''}
                                        onChange={(e) => handleUpdate('spotifyUrl', e.target.value)}
                                        placeholder="Link de Canción o Playlist de Spotify"
                                        className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none"
                                    />
                                    <textarea 
                                        rows={2}
                                        value={selectedPerson.spotifyMessage || ''}
                                        onChange={(e) => handleUpdate('spotifyMessage', e.target.value)}
                                        placeholder="Dedicatoria para esta canción..."
                                        className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none text-sm"
                                    />
                                </div>
                            </div>

                            {/* BGM Section */}
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <h4 className="text-xs font-bold uppercase text-gray-600 mb-4 flex items-center gap-2">
                                    <Volume2 size={16} /> Música de Fondo (Invisible / Autoplay)
                                </h4>
                                <div className="grid grid-cols-1 gap-4">
                                    <input 
                                        type="text" 
                                        value={selectedPerson.bgmUrl || ''}
                                        onChange={(e) => handleUpdate('bgmUrl', e.target.value)}
                                        placeholder="URL directa de archivo mp3 (ej: https://cdn.../song.mp3)"
                                        className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none text-sm"
                                    />
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs text-gray-500 whitespace-nowrap">Volumen:</span>
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
                        </div>
                    )}

                    {/* TAB: SECRETS (EASTER EGGS) */}
                    {activeTab === 'secrets' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                             <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h4 className="text-sm font-bold uppercase text-purple-800 flex items-center gap-2">
                                            <Gamepad2 size={18} /> Códigos Secretos
                                        </h4>
                                        <p className="text-xs text-purple-600 mt-1">Estos códigos funcionan en la pantalla de bloqueo para este usuario.</p>
                                    </div>
                                    <button 
                                        onClick={handleAddEgg}
                                        className="bg-purple-600 text-white px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider hover:bg-purple-700 transition-colors flex items-center gap-2"
                                    >
                                        <Plus size={14} /> Crear Nuevo
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {(selectedPerson.easterEggs || []).length === 0 && (
                                        <p className="text-center text-purple-400 italic py-8">No hay secretos configurados.</p>
                                    )}
                                    {(selectedPerson.easterEggs || []).map((egg, idx) => (
                                        <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-purple-100 flex flex-col gap-3">
                                            <div className="flex items-center gap-2 border-b border-gray-100 pb-2 mb-1">
                                                <span className="text-xs font-bold text-gray-400 uppercase w-16">Trigger:</span>
                                                <input 
                                                    type="text"
                                                    placeholder="Código (ej: hola)"
                                                    value={egg.code}
                                                    onChange={(e) => handleUpdateEgg(idx, 'code', e.target.value)}
                                                    className="flex-1 font-mono font-bold text-purple-700 bg-transparent outline-none"
                                                />
                                                <button onClick={() => handleDeleteEgg(idx)} className="text-gray-300 hover:text-red-500">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>

                                            <div className="flex gap-4">
                                                <div className="w-1/3">
                                                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Tipo de Acción</label>
                                                    <div className="relative">
                                                        <select
                                                            value={egg.type || 'text'}
                                                            onChange={(e) => handleUpdateEgg(idx, 'type', e.target.value as EasterEggType)}
                                                            className="w-full p-2 border border-gray-300 rounded text-xs bg-gray-50 appearance-none"
                                                        >
                                                            <option value="text">Mostrar Texto</option>
                                                            <option value="countdown">Cuenta Regresiva</option>
                                                            <option value="audio">Reproducir Audio</option>
                                                        </select>
                                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                                            <List size={12} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex-1">
                                                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                                                        {egg.type === 'countdown' ? 'Nombre del Evento' : egg.type === 'audio' ? 'URL del Archivo MP3' : 'Respuesta del Sistema'}
                                                    </label>
                                                    <div className="relative">
                                                        <input 
                                                            type="text"
                                                            value={egg.response}
                                                            onChange={(e) => handleUpdateEgg(idx, 'response', e.target.value)}
                                                            placeholder={egg.type === 'audio' ? 'https://.../sound.mp3' : '...'}
                                                            className="w-full p-2 border border-gray-300 rounded text-xs font-mono"
                                                        />
                                                        {egg.type === 'audio' && (
                                                            <div className="absolute right-2 top-2 text-gray-400"><Mic size={14}/></div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {egg.type === 'countdown' && (
                                                <div className="flex items-center gap-2 bg-blue-50 p-2 rounded">
                                                    <Calendar size={14} className="text-blue-500" />
                                                    <span className="text-xs text-blue-700 font-bold">Fecha:</span>
                                                    <input 
                                                        type="datetime-local"
                                                        value={egg.date || ''}
                                                        onChange={(e) => handleUpdateEgg(idx, 'date', e.target.value)}
                                                        className="bg-transparent text-xs text-blue-800 outline-none"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                             </div>
                        </div>
                    )}
                </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 uppercase tracking-widest text-xs">
            Selecciona un registro
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center z-10">
          <div className="flex items-center gap-4">
             {mode === 'PROFILES' && (
                 <>
                    <button 
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-2 rounded hover:bg-zinc-700 transition-colors shadow-lg"
                        >
                        {hasCopied ? <Check size={16} className="text-green-500"/> : <Copy size={16} />}
                        <span className="text-xs font-bold uppercase">{hasCopied ? 'Copiado' : 'Exportar JSON'}</span>
                    </button>
                    
                    {/* Preview Button */}
                    <button 
                        onClick={() => setIsPreviewing(true)}
                        disabled={!selectedPerson}
                        className={`flex items-center gap-2 px-4 py-2 rounded transition-colors text-xs font-bold uppercase tracking-wider ${!selectedPerson ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                    >
                        <Eye size={16} /> Vista Previa
                    </button>
                 </>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;