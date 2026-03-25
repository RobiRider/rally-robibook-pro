import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Plus, Printer, Trash2, MapPin, AlertTriangle, Info, 
  ArrowUp, ArrowUpRight, ArrowRight, ArrowDownRight, ArrowDown, 
  ArrowDownLeft, ArrowLeft, ArrowUpLeft, CornerUpRight, CornerUpLeft, Navigation,
  Octagon, Map, PenTool, RotateCcw, Settings, Image as ImageIcon,
  Home, Fuel, Coffee, Camera, Tent, X, Flag, Droplets, Mountain, 
  Wind, Trees, Building2, School, Landmark, Church, Wrench, PlusSquare, 
  Warehouse, Factory, Waves, Zap, UtensilsCrossed, Save, FolderOpen, HelpCircle
} from 'lucide-react';

// --- LIBRERÍA EXTENDIDA DE ICONOS ---
const ICON_CATEGORIES = {
  "Rally / CC": [
    { type: 'alert_1', label: 'Peligro 1', icon: <AlertTriangle color="black" strokeWidth={3} size={20} /> },
    { type: 'alert_2', label: 'Peligro 2', icon: <div className="flex"><AlertTriangle size={14} color="black" strokeWidth={3}/><AlertTriangle size={14} color="black" strokeWidth={3}/></div> },
    { type: 'alert_3', label: 'Peligro 3', icon: <div className="flex"><AlertTriangle size={12} color="black" strokeWidth={3}/><AlertTriangle size={12} color="black" strokeWidth={3}/><AlertTriangle size={12} color="black" strokeWidth={3}/></div> },
    { type: 'stop', label: 'STOP', icon: <div className="bg-red-600 text-white text-[7px] font-bold px-1 rounded border border-black uppercase">STOP</div> },
    { type: 'waypoint', label: 'WPT', icon: <MapPin fill="black" color="white" size={20} /> },
    { type: 'fuel', label: 'Gasolinera', icon: <Fuel color="black" size={20} /> },
    { type: 'mechanic', label: 'Asistencia', icon: <Wrench color="black" size={20} /> },
    { type: 'medical', label: 'Médico', icon: <PlusSquare color="red" size={20} /> },
    { type: 'bivouac', label: 'Vivac', icon: <Tent color="black" size={20} /> },
    { type: 'dz', label: 'DZ', icon: <div className="border-2 border-black rounded-full w-6 h-6 flex items-center justify-center font-bold text-[9px]">DZ</div> },
    { type: 'fz', label: 'FZ', icon: <div className="border-2 border-green-600 rounded-full w-6 h-6 flex items-center justify-center font-bold text-[9px] text-green-600">FZ</div> },
    { type: 'cap', label: 'CAP', icon: <div className="font-bold text-[10px] border border-black px-1 bg-yellow-400">CAP</div> },
    { type: 'cap_a', label: 'CAP A', icon: <div className="font-bold text-[10px] border border-black px-1 bg-yellow-400">CAP A</div> },
    { type: 'flag_start', label: 'Salida', icon: <Flag color="green" fill="green" size={20} /> },
    { type: 'flag_end', label: 'Meta', icon: <Flag color="red" fill="red" size={20} /> },
    { type: 'reset_icon', label: 'Reset', icon: <RotateCcw color="black" size={20} /> },
  ],
  "Señales": [
    { type: 'v30', icon: <div className="border-2 border-red-600 rounded-full w-7 h-7 flex items-center justify-center font-bold text-[10px]">30</div> },
    { type: 'v50', icon: <div className="border-2 border-red-600 rounded-full w-7 h-7 flex items-center justify-center font-bold text-[10px]">50</div> },
    { type: 'v90', icon: <div className="border-2 border-red-600 rounded-full w-7 h-7 flex items-center justify-center font-bold text-[10px]">90</div> },
    { type: 'v100', icon: <div className="border-2 border-red-600 rounded-full w-7 h-7 flex items-center justify-center font-bold text-[9px] tracking-tight">100</div> },
    { type: 'v120', icon: <div className="border-2 border-red-600 rounded-full w-7 h-7 flex items-center justify-center font-bold text-[8px]">120</div> },
    { type: 'v_end', icon: <div className="border-2 border-black rounded-full w-7 h-7 flex items-center justify-center font-bold text-[8px] relative"><div className="absolute w-full h-0.5 bg-black rotate-45"/>FIN</div> },
    { type: 'warning_sign', icon: <AlertTriangle color="red" size={20} /> },
    { type: 'no_entry', icon: <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center"><div className="w-4 h-1 bg-white"/></div> },
    { type: 'parking', label: 'Parking', icon: <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">P</div> },
    { type: 'roundabout', label: 'Rotonda', icon: <svg viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="11" fill="#2563eb"/><g fill="white"><path d="M12 5.5 c-1.5 0-2.8.5-3.8 1.4 l-1.2-1.2 v4 h4 l-1.4-1.4 c.7-.6 1.5-1 2.4-1 v-1.8 z"/><path d="M12 5.5 c-1.5 0-2.8.5-3.8 1.4 l-1.2-1.2 v4 h4 l-1.4-1.4 c.7-.6 1.5-1 2.4-1 v-1.8 z" transform="rotate(120 12 12)"/><path d="M12 5.5 c-1.5 0-2.8.5-3.8 1.4 l-1.2-1.2 v4 h4 l-1.4-1.4 c.7-.6 1.5-1 2.4-1 v-1.8 z" transform="rotate(240 12 12)"/></g></svg> },
    { type: 'stop_traffic', label: 'Señal Stop', icon: <svg viewBox="0 0 24 24" width="20" height="20"><polygon points="7,2 17,2 22,7 22,17 17,22 7,22 2,17 2,7" fill="#dc2626" stroke="white" strokeWidth="1"/><text x="12" y="15" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle">STOP</text></svg> },
    { type: 'yield', label: 'Ceda', icon: <svg viewBox="0 0 24 24" width="20" height="20"><polygon points="12,22 2,2 22,2" fill="white" stroke="#dc2626" strokeWidth="3" strokeLinejoin="round" /></svg> },
    { type: 'one_way', label: 'Sentido', icon: <svg viewBox="0 0 24 24" width="20" height="20"><rect x="3" y="3" width="18" height="18" rx="2" fill="#2563eb" /><path d="M12,18 L12,6 M8,10 L12,5 L16,10" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg> },
    { type: 'dangerous_curve', label: 'Curva', icon: <svg viewBox="0 0 24 24" width="20" height="20"><polygon points="12,2 2,20 22,20" fill="white" stroke="#dc2626" strokeWidth="2.5" strokeLinejoin="round" /><path d="M10,16 Q10,10 14,8 M12,6 L15,8 L13,10" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg> },
    { type: 'steep_descent', label: 'Pendiente', icon: <svg viewBox="0 0 24 24" width="20" height="20"><polygon points="12,2 2,20 22,20" fill="white" stroke="#dc2626" strokeWidth="2.5" strokeLinejoin="round" /><polygon points="7,17 17,17 17,11" fill="black" /><text x="13.5" y="16" fill="white" fontSize="4" fontWeight="bold" textAnchor="middle">10%</text></svg> },
  ],
  "Referencias": [
    { type: 'house', label: 'Casa', icon: <Home size={20}/> },
    { type: 'houses', label: 'Casas', icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="white" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><g transform="translate(10, 2) scale(0.55)"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22" /></g><g transform="translate(1, 10) scale(0.6)"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22" /></g><g transform="translate(11, 11) scale(0.65)"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22" /></g></svg> },
    { type: 'church', label: 'Iglesia', icon: <Church size={20}/> },
    { type: 'factory', label: 'Fábrica', icon: <Factory size={20}/> },
    { type: 'bridge_over', label: 'P. Sobre', icon: <svg viewBox="0 0 24 24" width="20" height="20"><path d="M 7,2 L 7,22 M 17,2 L 17,22" stroke="black" strokeWidth="3" strokeLinecap="round"/><path d="M 3,2 L 7,6 M 21,2 L 17,6 M 3,22 L 7,18 M 21,22 L 17,18" stroke="black" strokeWidth="2" strokeLinecap="round"/></svg> },
    { type: 'bridge_under', label: 'P. Bajo', icon: <svg viewBox="0 0 24 24" width="20" height="20"><line x1="2" y1="8" x2="22" y2="8" stroke="black" strokeWidth="2" strokeLinecap="round"/><line x1="2" y1="12" x2="22" y2="12" stroke="black" strokeWidth="2" strokeLinecap="round"/><path d="M 7,22 L 7,16 A 5 5 0 0 1 17 16 L 17,22" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round"/></svg> },
    { type: 'tower', label: 'Torre', icon: <Landmark size={20}/> },
    { type: 'pylon', label: 'Alta Tensión', icon: <svg viewBox="0 0 24 24" width="20" height="20" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M12,2 L8,22 M12,2 L16,22 M6,8 L18,8 M5,14 L19,14 M10,2 L14,8 M14,2 L10,8 M8,8 L12,14 M16,8 L12,14" /></svg> },
    { type: 'tree', label: 'Árbol', icon: <Trees size={20}/> },
    { type: 'park', label: 'Parque', icon: <svg viewBox="0 0 24 24" width="20" height="20"><path d="M 6 12 C 0 12 0 1 6 1 C 12 1 12 12 6 12 Z" fill="#22c55e" /><line x1="6" y1="12" x2="6" y2="22" stroke="#92400e" strokeWidth="3" strokeLinecap="round" /><line x1="10" y1="8" x2="22" y2="8" stroke="black" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="8" x2="9" y2="22" stroke="black" strokeWidth="1.5" strokeLinecap="round"/><line x1="20" y1="8" x2="23" y2="22" stroke="black" strokeWidth="1.5" strokeLinecap="round"/><line x1="14" y1="8" x2="14" y2="16" stroke="black" strokeWidth="1"/><line x1="18" y1="8" x2="18" y2="16" stroke="black" strokeWidth="1"/><line x1="13" y1="16" x2="19" y2="16" stroke="black" strokeWidth="2" strokeLinecap="round"/></svg> },
    { type: 'cafe', label: 'Café', icon: <Coffee size={20}/> },
    { type: 'restaurant', label: 'Restaurante', icon: <UtensilsCrossed size={20}/> },
    { type: 'pharmacy', label: 'Farmacia', icon: <svg viewBox="0 0 24 24" width="20" height="20"><path d="M10,3 h4 v6 h6 v4 h-6 v6 h-4 v-6 h-6 v-4 h6 z" fill="#16a34a" /></svg> },
  ],
  "Terreno": [
    { type: 'water', label: 'Agua', icon: <Droplets color="blue" size={20}/> },
    { type: 'river', label: 'Río', icon: <Waves color="blue" size={20}/> },
    { type: 'sand', label: 'Arena', icon: <div className="grid grid-cols-2 gap-0.5"><div className="w-1.5 h-1.5 bg-yellow-600 rounded-full"/><div className="w-1.5 h-1.5 bg-yellow-600 rounded-full"/><div className="w-1.5 h-1.5 bg-yellow-600 rounded-full"/><div className="w-1.5 h-1.5 bg-yellow-600 rounded-full"/></div> },
    { type: 'dust', label: 'Polvo', icon: <Wind color="gray" size={20}/> },
    { type: 'stones', label: 'Piedras', icon: <Mountain color="gray" size={20}/> },
    { type: 'danger_zap', label: 'Eléctrico', icon: <Zap color="orange" size={20}/> },
  ]
};

// --- UTILIDADES ---
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
};

// Formato modificado para fijarlo a 2 decimales en todo el documento
const formatRallyDist = (num) => parseFloat(num || 0).toFixed(2).replace('.', ',');

const catmullRom2bezier = (points) => {
  if (!points || points.length < 2) return '';
  let d = `M ${points[0].x},${points[0].y} `;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i === 0 ? points[0] : points[i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i + 2 < points.length ? points[i + 2] : p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6, cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6, cp2y = p2.y - (p3.y - p1.y) / 6;
    d += `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y} `;
  }
  return d;
};

const distToSegment = (p, v, w) => {
  const l2 = Math.pow(v.x - w.x, 2) + Math.pow(v.y - w.y, 2);
  if (l2 === 0) return Math.pow(p.x - v.x, 2) + Math.pow(p.y - v.y, 2);
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.sqrt(Math.pow(p.x - (v.x + t * (w.x - v.x)), 2) + Math.pow(p.y - (v.y + t * (w.y - v.y)), 2));
};

const defaultCustomTulip = { 
  isRoundabout: false, 
  paths: [{ id: 'm1', type: 'main', points: [{x: 50, y: 90}, {x: 50, y: 10}], isDirt: false, isHighway: false, thickness: 5 }], 
  icons: [] 
};

const normalizeTulip = (data) => {
  if (!data || !Array.isArray(data.paths)) return defaultCustomTulip;
  return { ...data, icons: data.icons || [] };
};

const GetIconComponent = (type) => {
  for (const cat in ICON_CATEGORIES) {
    const item = ICON_CATEGORIES[cat].find(i => i.type === type);
    if (item) return item.icon;
  }
  return null;
};

// --- COMPONENTE: SELECTOR UNIVERSAL ---
function UniversalIconPicker({ onSelect, onUpload, onClose }) {
  const [activeTab, setActiveTab] = useState("Rally / CC");
  const fileInputRef = useRef(null);

  return (
    <div className="fixed inset-0 z-[250] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onPointerDown={onClose}>
      <div className="bg-white border-2 border-black w-full max-w-xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh]" onPointerDown={e => e.stopPropagation()}>
        <div className="p-4 border-b-2 border-black flex justify-between items-center bg-gray-50">
          <h3 className="font-bold uppercase text-lg tracking-tight">Librería de Iconos</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X/></button>
        </div>

        <div className="p-4 bg-blue-50 border-b-2 border-black">
          <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-[4px_4px_0_0_#1e3a8a]">
            <Upload size={18}/> SUBIR IMAGEN PROPIA
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (ev) => onUpload(ev.target.result);
              reader.readAsDataURL(file);
            }
          }} />
        </div>

        <div className="flex bg-gray-200 border-b-2 border-black overflow-x-auto no-scrollbar shrink-0">
          {Object.keys(ICON_CATEGORIES).map(cat => (
            <button key={cat} onClick={() => setActiveTab(cat)} className={`flex items-center justify-center px-5 py-4 font-bold text-sm uppercase tracking-widest whitespace-nowrap transition-colors ${activeTab === cat ? 'bg-white text-black border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-300 hover:text-black border-b-2 border-transparent'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="p-4 pb-12 overflow-y-auto grid grid-cols-4 sm:grid-cols-5 gap-3 bg-white flex-1 min-h-0 content-start">
          {ICON_CATEGORIES[activeTab].map((item, idx) => (
            <button key={idx} onClick={() => onSelect(item.type)} className="group flex flex-col items-center justify-center gap-2 p-2 border-2 border-gray-100 rounded-xl hover:border-black hover:bg-gray-50 transition-all">
              <div className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <span className="text-[8px] font-bold uppercase text-gray-400 group-hover:text-black">{item.label || item.type}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- RENDERIZADORES ---

function StaticTulipRenderer({ data, id }) {
  const norm = normalizeTulip(data);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      <defs>
        <marker id={`arrow-blue-${id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#3b82f6" />
        </marker>
        <marker id={`block-black-${id}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <rect x="4.6" y="1" width="0.8" height="8" fill="black" />
        </marker>
      </defs>
      {norm.isRoundabout && <circle cx="50" cy="50" r="15" fill="none" stroke="black" strokeWidth="4" />}
      {norm.paths.map(p => {
        const isMain = p.type === 'main';
        const isEntry = p.type === 'entry';
        const isWrong = !isMain && !isEntry; 
        const color = (isMain || isEntry) ? '#3b82f6' : 'black'; 
        const width = p.type === 'secondary' ? '2' : (p.thickness || 5).toString();
        const dash = p.isDirt ? (width >= 4 ? '10,10' : '4,4') : 'none';
        
        let marker = '';
        if (isMain) marker = `url(#arrow-blue-${id})`;
        if (isWrong) marker = `url(#block-black-${id})`;

        const lineCap = 'butt';
        const dPath = catmullRom2bezier(p.points);
        
        return (
          <g key={p.id}>
            <path d={dPath} fill="none" stroke={color} strokeWidth={width} strokeDasharray={dash} strokeLinecap={lineCap} />
            {p.isHighway && (
              <path d={dPath} fill="none" stroke="white" strokeWidth={Math.max(1, parseFloat(width) - 2).toString()} strokeDasharray={dash} strokeLinecap={lineCap} />
            )}
            {marker && (
              <path d={dPath} fill="none" stroke="transparent" strokeWidth={width} markerEnd={marker} pointerEvents="none" />
            )}
          </g>
        );
      })}
      {norm.icons.map(ic => { 
        const rot = ic.rotation || 0;
        const scale = ic.scale || 1;
        return (
          <g key={ic.id} style={{transform: `translate(${ic.x}px, ${ic.y}px) rotate(${rot}deg) scale(${scale}) translate(-15px, -15px)`}}>
            {ic.type === 'custom_image' ? (
              <image href={ic.dataUrl} width={30} height={30} preserveAspectRatio="xMidYMid meet" />
            ) : (
              <foreignObject width={30} height={30}>
                <div style={{width: 30, height: 30}} className="flex items-center justify-center overflow-visible">
                  {GetIconComponent(ic.type)}
                </div>
              </foreignObject>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function TulipVectorEditor({ data, onSave, onCancel }) {
  const normData = normalizeTulip(data);
  const [paths, setPaths] = useState(normData.paths);
  const [icons, setIcons] = useState(normData.icons);
  const [isRoundabout, setIsRoundabout] = useState(normData.isRoundabout);
  const [rExits, setRExits] = useState(3);
  const [rTarget, setRTarget] = useState(2);
  const svgRef = useRef(null);
  const [dragging, setDragging] = useState(null); 
  const [selectedIconId, setSelectedIconId] = useState(null);
  const [selectedPathId, setSelectedPathId] = useState(null); 
  const [showIconPicker, setShowIconPicker] = useState(false);

  const getCoords = (e) => {
    const svg = svgRef.current;
    if (!svg) return { x: 50, y: 50 };
    let pt = svg.createSVGPoint();
    pt.x = e.clientX || (e.touches && e.touches[0].clientX);
    pt.y = e.clientY || (e.touches && e.touches[0].clientY);
    const loc = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x: Math.max(-10, Math.min(110, loc.x)), y: Math.max(-10, Math.min(110, loc.y)) };
  };

  const handlePointerDown = (e, target) => {
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    setDragging(target);
    if (target.type === 'icon') {
      setSelectedIconId(target.iconId);
      setSelectedPathId(null);
    } else if (target.type === 'path') {
      setSelectedPathId(target.pathId);
      setSelectedIconId(null);
      setDragging(null); 
    } else {
      setSelectedIconId(null);
      setSelectedPathId(null);
    }
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    const loc = getCoords(e);
    if (dragging.type === 'node') {
      setPaths(paths.map(path => {
        if (path.id !== dragging.pathId) return path;
        const newPoints = [...path.points];
        newPoints[dragging.pointIdx] = loc;
        return { ...path, points: newPoints };
      }));
    } else if (dragging.type === 'icon') {
      setIcons(icons.map(ic => ic.id === dragging.iconId ? { ...ic, x: loc.x, y: loc.y } : ic));
    }
  };

  const handlePointerUp = (e) => {
    if (dragging) {
      e.target.releasePointerCapture(e.pointerId);
      setDragging(null);
    }
  };

  const handleLineDoubleClick = (e, pathId) => {
    e.stopPropagation();
    const loc = getCoords(e);
    setPaths(paths.map(path => {
      if (path.id !== pathId) return path;
      let minPt = 1; let minDist = Infinity;
      for (let i = 0; i < path.points.length - 1; i++) {
        const p1 = path.points[i], p2 = path.points[i+1];
        const l2 = Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
        let t = ((loc.x - p1.x) * (p2.x - p1.x) + (loc.y - p1.y) * (p2.y - p1.y)) / (l2 || 1);
        t = Math.max(0, Math.min(1, t));
        const proj = { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) };
        const d = Math.pow(loc.x - proj.x, 2) + Math.pow(loc.y - proj.y, 2);
        if (d < minDist) { minDist = d; minPt = i + 1; }
      }
      const newPts = [...path.points];
      newPts.splice(minPt, 0, loc); 
      return { ...path, points: newPts };
    }));
  };

  const handleDeletePoint = (e, pathId, pointIdx) => {
    e.stopPropagation();
    setPaths(paths.map(path => {
      if (path.id !== pathId) return path;
      if (path.points.length <= 2) return path; 
      const newPts = [...path.points];
      newPts.splice(pointIdx, 1);
      return { ...path, points: newPts };
    }));
  };

  const deleteSelectedPath = () => {
    if (!selectedPathId || paths.length <= 1) return; 
    setPaths(paths.filter(p => p.id !== selectedPathId));
    setSelectedPathId(null);
  };

  const updateSelectedIconScale = (delta) => {
    if (!selectedIconId) return;
    setIcons(icons.map(ic => ic.id === selectedIconId ? { ...ic, scale: Math.max(0.5, Math.min(4, (ic.scale || 1) + delta)) } : ic));
  };

  const updateSelectedIconRotation = (delta) => {
    if (!selectedIconId) return;
    setIcons(icons.map(ic => ic.id === selectedIconId ? { ...ic, rotation: (ic.rotation || 0) + delta } : ic));
  };

  const deleteSelectedIcon = () => {
    if (!selectedIconId) return;
    setIcons(icons.filter(ic => ic.id !== selectedIconId));
    setSelectedIconId(null);
  };

  const togglePathDirt = () => {
    if (!selectedPathId) return;
    setPaths(paths.map(p => p.id === selectedPathId ? { ...p, isDirt: !p.isDirt } : p));
  };

  const togglePathHighway = () => {
    if (!selectedPathId) return;
    setPaths(paths.map(p => p.id === selectedPathId ? { ...p, isHighway: !p.isHighway } : p));
  };

  const cycleThickness = () => {
    if (!selectedPathId) return;
    setPaths(paths.map(p => {
      if (p.id !== selectedPathId) return p;
      let current = p.type === 'secondary' ? 2 : (p.thickness || 5);
      let next = current === 5 ? 3.5 : (current === 3.5 ? 2 : 5);
      return { ...p, type: p.type === 'secondary' ? 'wrong_way' : p.type, thickness: next };
    }));
  };

  const addIcon = (type, dataUrl = null) => {
    const newIcon = { id: crypto.randomUUID(), type, x: 50, y: 50, scale: 1, rotation: 0, dataUrl };
    setIcons([...icons, newIcon]);
    setSelectedIconId(newIcon.id);
  };

  const generateRoundabout = () => {
    const newPaths = [];
    const totalLegs = rExits + 1;
    newPaths.push({ id: crypto.randomUUID(), type: 'entry', isDirt: false, isHighway: false, thickness: 5, points: [{x: 50, y: 90}, {x: 50, y: 65}] });
    for (let i = 1; i <= rExits; i++) {
      const angle = Math.PI / 2 - i * (2 * Math.PI / totalLegs);
      const isTarget = (i === rTarget);
      const r1 = 15; const r2 = isTarget ? 45 : 30;
      newPaths.push({ id: crypto.randomUUID(), type: isTarget ? 'main' : 'wrong_way', isDirt: false, isHighway: false, thickness: isTarget ? 5 : 3.5, points: [{x: 50 + r1 * Math.cos(angle), y: 50 + r1 * Math.sin(angle)}, {x: 50 + r2 * Math.cos(angle), y: 50 + r2 * Math.sin(angle)}] });
    }
    setPaths(newPaths); setIsRoundabout(true);
    setSelectedPathId(null);
  };

  const selectedPath = paths.find(p => p.id === selectedPathId);
  const showThicknessBtn = selectedPath && selectedPath.type !== 'main';

  return (
    <div className="flex flex-col items-center select-none w-full">
      <div className="bg-gray-100 p-2 rounded border-2 border-gray-200 mb-2 w-full flex flex-col items-center">
        <span className="text-[10px] font-bold uppercase text-gray-500 mb-1">Generador Rotonda</span>
        <div className="flex gap-2 items-center text-xs">
          <span>Salidas:</span>
          <input type="number" min="1" max="8" value={rExits} onChange={e=>setRExits(parseInt(e.target.value)||1)} className="w-10 border rounded text-center" />
          <span>Objetivo:</span>
          <input type="number" min="1" max={rExits} value={rTarget} onChange={e=>setRTarget(parseInt(e.target.value)||1)} className="w-10 border rounded text-center" />
          <button onClick={generateRoundabout} className="bg-blue-600 text-white font-bold px-2 py-1 rounded hover:bg-blue-700 ml-1 uppercase text-[10px]">Generar</button>
        </div>
      </div>

      <div 
        className="w-64 h-64 border-2 border-dashed border-gray-400 bg-gray-50 mb-2 relative touch-none shadow-inner rounded overflow-hidden"
        onPointerDown={() => { setSelectedPathId(null); setSelectedIconId(null); }}
      >
        <svg ref={svgRef} viewBox="0 0 100 100" className="w-full h-full overflow-visible" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
          <defs>
            <marker id="editor-arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 1 L 10 5 L 0 9 z" fill="#3b82f6" /></marker>
            <marker id="editor-block-black" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><rect x="4.6" y="1" width="0.8" height="8" fill="black" /></marker>
            <marker id="editor-arrow-orange" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" /></marker>
            <marker id="editor-block-orange" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><rect x="4.6" y="1" width="0.8" height="8" fill="#f59e0b" /></marker>
          </defs>
          {isRoundabout && <circle cx="50" cy="50" r="15" fill="none" stroke="#cbd5e1" strokeWidth="4" />}
          {paths.map(path => {
            const isSelected = path.id === selectedPathId;
            const isMain = path.type === 'main';
            const isEntry = path.type === 'entry';
            const isWrong = !isMain && !isEntry;
            const color = isSelected ? "#f59e0b" : ((isMain || isEntry) ? '#3b82f6' : 'black'); 
            const width = path.type === 'secondary' ? '2' : (path.thickness || 5).toString();
            const dash = path.isDirt ? (width >= 4 ? '10,10' : '4,4') : 'none';
            
            let marker = '';
            if (isMain) marker = isSelected ? "url(#editor-arrow-orange)" : "url(#editor-arrow-blue)";
            if (isWrong) marker = isSelected ? "url(#editor-block-orange)" : "url(#editor-block-black)";
            
            const lineCap = 'butt';
            const dPath = catmullRom2bezier(path.points);
            
            return (
              <g key={path.id}>
                <path d={dPath} stroke="transparent" strokeWidth="20" fill="none" strokeLinecap={lineCap} onPointerDown={(e) => handlePointerDown(e, { type: 'path', pathId: path.id })} onDoubleClick={(e) => handleLineDoubleClick(e, path.id)} className="cursor-crosshair" />
                <path d={dPath} stroke={color} strokeWidth={width} strokeDasharray={dash} fill="none" strokeLinecap={lineCap} className="pointer-events-none transition-colors" />
                {path.isHighway && (
                  <path d={dPath} stroke="white" strokeWidth={Math.max(1, parseFloat(width) - 2).toString()} strokeDasharray={dash} fill="none" strokeLinecap={lineCap} className="pointer-events-none transition-colors" />
                )}
                {marker && (
                  <path d={dPath} stroke="transparent" strokeWidth={width} fill="none" markerEnd={marker} className="pointer-events-none" />
                )}
              </g>
            );
          })}
          {paths.map(path => path.points.map((p, i) => (
            <circle key={`${path.id}-pt-${i}`} cx={p.x} cy={p.y} r="6" fill="#ef4444" stroke="white" strokeWidth="2" onPointerDown={(e) => handlePointerDown(e, { type: 'node', pathId: path.id, pointIdx: i })} onDoubleClick={(e) => handleDeletePoint(e, path.id, i)} />
          )))}
          {icons.map(ic => {
            const rot = ic.rotation || 0;
            const scale = ic.scale || 1;
            return (
              <g key={ic.id} onPointerDown={(e) => handlePointerDown(e, { type: 'icon', iconId: ic.id })} style={{transform: `translate(${ic.x}px, ${ic.y}px) rotate(${rot}deg) scale(${scale}) translate(-15px, -15px)`}}>
                <rect width={30} height={30} fill="transparent" />
                <foreignObject width={30} height={30}>
                  <div className="w-full h-full flex items-center justify-center pointer-events-none overflow-visible">
                    {ic.type === 'custom_image' ? <img src={ic.dataUrl} className="w-full h-full object-contain" /> : GetIconComponent(ic.type)}
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>

      {selectedIconId && (
        <div className="flex gap-1 mb-2 w-full justify-center">
          <button onClick={() => updateSelectedIconScale(-0.1)} className="bg-gray-200 w-8 h-8 rounded font-bold text-xl flex items-center justify-center">-</button>
          <button onClick={() => updateSelectedIconScale(0.1)} className="bg-gray-200 w-8 h-8 rounded font-bold text-xl flex items-center justify-center">+</button>
          <button onClick={() => updateSelectedIconRotation(-15)} className="bg-gray-200 w-8 h-8 rounded font-bold text-xl flex items-center justify-center leading-none">↺</button>
          <button onClick={() => updateSelectedIconRotation(15)} className="bg-gray-200 w-8 h-8 rounded font-bold text-xl flex items-center justify-center leading-none">↻</button>
          <button onClick={deleteSelectedIcon} className="bg-red-500 text-white px-3 rounded font-bold text-xs uppercase tracking-wide ml-2">Eliminar</button>
        </div>
      )}

      {selectedPathId && selectedPath && (
        <div className="flex flex-col gap-2 mb-2 w-full justify-center bg-gray-100 p-2 rounded border-2 border-gray-200">
          <span className="text-[10px] font-bold uppercase text-gray-500 text-center tracking-widest">Opciones de Vía</span>
          <div className="grid grid-cols-2 gap-2 w-full">
            <button onClick={togglePathDirt} className="bg-white border-2 border-gray-300 py-2 rounded shadow-sm font-bold text-[10px] uppercase hover:bg-gray-50 transition-colors">
              {selectedPath.isDirt ? 'Hacer Asfalto' : 'Hacer Tierra'}
            </button>
            <button onClick={togglePathHighway} className="bg-white border-2 border-gray-300 py-2 rounded shadow-sm font-bold text-[10px] uppercase hover:bg-gray-50 transition-colors">
              {selectedPath.isHighway ? 'Vía Única' : 'Autopista'}
            </button>
            {showThicknessBtn && (
              <button onClick={cycleThickness} className="bg-white border-2 border-gray-300 py-2 rounded shadow-sm font-bold text-[10px] uppercase hover:bg-gray-50 transition-colors">
                Grosor: {(selectedPath.type === 'secondary' || selectedPath.thickness === 2) ? 'Fino' : (selectedPath.thickness === 3.5 ? 'Medio' : 'Grueso')}
              </button>
            )}
            {paths.length > 1 ? (
              <button onClick={deleteSelectedPath} className={`bg-red-600 text-white border-2 border-red-700 py-2 rounded shadow-sm font-bold text-[10px] uppercase hover:bg-red-700 transition-colors ${!showThicknessBtn ? 'col-span-2' : ''}`}>
                Eliminar Vía
              </button>
            ) : (
              <div className={`flex items-center justify-center text-[9px] text-red-500 font-bold text-center border-2 border-transparent ${!showThicknessBtn ? 'col-span-2' : ''}`}>No eliminable</div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-1 p-2 bg-gray-100 rounded border-2 border-gray-200 mb-2 w-full justify-center items-center">
        {ICON_CATEGORIES["Rally / CC"].slice(0, 5).map(ic => (
          <button key={ic.type} onClick={(e) => { e.stopPropagation(); addIcon(ic.type); }} className="w-8 h-8 p-1 border border-gray-300 bg-white rounded hover:bg-gray-50">{ic.icon}</button>
        ))}
        <button onClick={(e) => { e.stopPropagation(); setShowIconPicker(true); }} className="px-2 py-1 bg-blue-600 text-white font-bold text-[10px] rounded uppercase hover:bg-blue-700 h-8 flex items-center gap-1">
          <Plus size={12}/> Más Iconos
        </button>
      </div>

      {showIconPicker && (
        <UniversalIconPicker 
          onSelect={type => { addIcon(type); setShowIconPicker(false); }}
          onUpload={url => { addIcon('custom_image', url); setShowIconPicker(false); }}
          onClose={() => setShowIconPicker(false)}
        />
      )}

      <div className="grid grid-cols-2 gap-2 mb-4 w-full">
        <button onClick={(e) => { e.stopPropagation(); setPaths([...paths, { id: crypto.randomUUID(), type: 'wrong_way', isDirt: false, isHighway: false, thickness: 5, points: [{x: 50, y: 50}, {x: 20, y: 30}] }]); }} className="bg-black text-white font-bold py-3 rounded text-[10px] uppercase hover:bg-gray-800 transition-colors shadow">+ Adicional</button>
        <button onClick={(e) => { e.stopPropagation(); setPaths([...paths, { id: crypto.randomUUID(), type: 'main', isDirt: false, isHighway: false, thickness: 5, points: [{x: 50, y: 90}, {x: 50, y: 10}] }]); }} className="bg-blue-600 text-white font-bold py-3 rounded text-[10px] uppercase hover:bg-blue-700 transition-colors shadow">+ Principal</button>
      </div>

      <div className="flex gap-2 mt-2 w-full">
        <button onClick={onCancel} className="flex-1 bg-gray-300 font-bold uppercase text-sm py-3 rounded hover:bg-gray-400 transition-colors">Cancelar</button>
        <button onClick={() => onSave({ paths, isRoundabout, icons })} className="flex-1 bg-green-600 text-white font-bold uppercase text-sm py-3 rounded hover:bg-green-700 transition-colors">Guardar</button>
      </div>
    </div>
  );
}

function RoadbookRow({ row, index, onUpdate, onDelete, onInsert }) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedIconId, setSelectedIconId] = useState(null);
  const [draggingIconId, setDraggingIconId] = useState(null);
  const [distMode, setDistMode] = useState(false);
  const [tempDist, setTempDist] = useState(''); 
  const infoRef = useRef(null);

  const handleInfoPointerMove = (e) => {
    if (!draggingIconId) return;
    const r = infoRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    onUpdate(row.id, 'infoIcons', row.infoIcons.map(ic => ic.id === draggingIconId ? { ...ic, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) } : ic));
  };

  const isGreen = row.partialDist < 0.3;

  return (
    <div className="roadbook-row w-full print:block">
      <div className="flex border-b-2 border-black bg-white min-h-[160px] group relative">
        <div className={`w-[30%] border-r-2 border-black relative transition-colors ${isGreen ? 'bg-[#8FFE89]' : 'bg-white'}`}>
          <div 
            className="w-full h-full flex flex-col items-center justify-start pt-6 cursor-text hover:bg-black/5"
            onClick={() => { setTempDist(formatRallyDist(row.totalDist)); setDistMode(true); }}
          >
            {distMode ? (
              <input 
                type="text"
                autoFocus 
                dir="ltr" 
                value={tempDist} 
                onChange={e => setTempDist(e.target.value)} 
                onBlur={() => {
                  const parsed = parseFloat(tempDist.replace(',', '.'));
                  onUpdate(row.id, 'totalDist', isNaN(parsed) ? 0 : parsed);
                  setDistMode(false);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') e.target.blur();
                }}
                className="w-[90%] text-center outline-none bg-yellow-50 text-[2.8rem] sm:text-[3.5rem] leading-none font-bold tracking-tight" 
              />
            ) : (
              <span className="text-[2.8rem] sm:text-[3.5rem] leading-none font-bold tracking-tight whitespace-nowrap">
                {formatRallyDist(row.totalDist)}
              </span>
            )}
          </div>
          
          <div className="absolute bottom-0 left-0 w-[65%] h-[40%] border-t-2 border-r-2 border-black flex items-center justify-center pointer-events-none">
            <span className="text-2xl sm:text-3xl font-semibold text-gray-800 leading-none">
              {formatRallyDist(row.partialDist)}
            </span>
          </div>

          <div className="absolute bottom-0 right-0 w-10 h-10 sm:w-12 sm:h-12 border-t-2 border-l-2 border-black bg-black flex items-center justify-center pointer-events-none">
            <span className="text-lg sm:text-xl font-bold text-white leading-none">
              {index}
            </span>
          </div>
        </div>

        <div className="w-[35%] border-r-2 border-black flex items-center justify-center relative p-2 overflow-hidden">
          <button onClick={() => setEditorOpen(true)} className="w-[140px] h-[140px] flex items-center justify-center hover:bg-gray-50 transition-colors rounded">
            <StaticTulipRenderer data={row.customTulip} id={row.id} />
          </button>
          
          {editorOpen && (
            <div className="fixed inset-0 z-[150] bg-black/50 flex items-center justify-center p-4" onPointerDown={() => setEditorOpen(false)}>
              <div onPointerDown={e => e.stopPropagation()} className="bg-white border-2 border-black rounded-2xl shadow-2xl overflow-y-auto max-h-[95vh] w-full max-w-[360px]">
                <TulipVectorEditor data={row.customTulip} onSave={val => { onUpdate(row.id, 'customTulip', val); setEditorOpen(false); }} onCancel={() => setEditorOpen(false)} />
              </div>
            </div>
          )}
        </div>

        <div className="w-[35%] relative group/info" ref={infoRef} onPointerMove={handleInfoPointerMove} onPointerUp={() => setDraggingIconId(null)} onPointerDown={() => setSelectedIconId(null)}>
          
          {/* TEXTAREA INTERACTIVO: Visible solo en pantalla, se oculta al imprimir */}
          <textarea dir="ltr" value={row.notes} onChange={e => onUpdate(row.id, 'notes', e.target.value.toUpperCase())} className="w-full h-full resize-none outline-none p-4 font-bold uppercase text-2xl focus:bg-gray-50 leading-tight print:hidden" placeholder="Añadir nota..." />
          
          {/* DIV ESTÁTICO DE IMPRESIÓN: Visible solo en el PDF, evita que Chrome estire la fila a lo loco */}
          <div className="hidden print:block w-full h-full p-4 font-bold uppercase text-2xl leading-tight whitespace-pre-wrap overflow-hidden">
            {row.notes}
          </div>

          {row.infoIcons.map(ic => {
            const isSel = selectedIconId === ic.id;
            const scale = ic.scale || 1;
            const rot = ic.rotation || 0;
            return (
              <div 
                key={ic.id} 
                style={{
                  position: 'absolute', 
                  left: `${ic.x}%`, 
                  top: `${ic.y}%`, 
                  transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`, 
                  width: 40, 
                  height: 40
                }} 
                className={`flex items-center justify-center cursor-move touch-none transition-shadow ${isSel ? 'ring-2 ring-blue-500 rounded bg-blue-50/50' : ''}`} 
                onPointerDown={e => { e.stopPropagation(); e.target.setPointerCapture(e.pointerId); setSelectedIconId(ic.id); setDraggingIconId(ic.id); }}
                onPointerUp={e => { e.stopPropagation(); e.target.releasePointerCapture(e.pointerId); setDraggingIconId(null); }}
              >
                {ic.type === 'custom_image' ? <img src={ic.dataUrl} className="w-full h-full object-contain pointer-events-none" /> : <div className="w-full h-full pointer-events-none flex items-center justify-center">{GetIconComponent(ic.type)}</div>}
              </div>
            );
          })}

          {selectedIconId && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 bg-white border-2 border-black rounded-lg p-1 z-50 shadow-xl" onPointerDown={e => e.stopPropagation()}>
              <button onClick={() => onUpdate(row.id, 'infoIcons', row.infoIcons.map(ic => ic.id === selectedIconId ? {...ic, scale: Math.max(0.5, (ic.scale||1)-0.2)} : ic))} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center font-bold text-xl">-</button>
              <button onClick={() => onUpdate(row.id, 'infoIcons', row.infoIcons.map(ic => ic.id === selectedIconId ? {...ic, scale: Math.min(4, (ic.scale||1)+0.2)} : ic))} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center font-bold text-xl">+</button>
              <button onClick={() => onUpdate(row.id, 'infoIcons', row.infoIcons.map(ic => ic.id === selectedIconId ? {...ic, rotation: (ic.rotation||0)-15} : ic))} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center font-bold text-xl leading-none">↺</button>
              <button onClick={() => onUpdate(row.id, 'infoIcons', row.infoIcons.map(ic => ic.id === selectedIconId ? {...ic, rotation: (ic.rotation||0)+15} : ic))} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center font-bold text-xl leading-none">↻</button>
              <button onClick={() => { onUpdate(row.id, 'infoIcons', row.infoIcons.filter(ic => ic.id !== selectedIconId)); setSelectedIconId(null); }} className="w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded flex items-center justify-center ml-2"><Trash2 size={16}/></button>
            </div>
          )}

          <button onClick={() => setPickerOpen(true)} className="absolute top-2 right-2 opacity-0 group-hover/info:opacity-100 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-all shadow-lg z-10 scale-90 hover:scale-100"><ImageIcon size={18}/></button>
          {pickerOpen && <UniversalIconPicker 
            onSelect={type => { onUpdate(row.id, 'infoIcons', [...row.infoIcons, { id: crypto.randomUUID(), type, x: 80, y: 50, scale: 1.2, rotation: 0 }]); setPickerOpen(false); }}
            onUpload={url => { onUpdate(row.id, 'infoIcons', [...row.infoIcons, { id: crypto.randomUUID(), type: 'custom_image', x: 80, y: 50, scale: 1.2, rotation: 0, dataUrl: url }]); setPickerOpen(false); }}
            onClose={() => setPickerOpen(false)}
          />}
        </div>

        <div className="absolute -right-16 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
          <button onClick={() => onInsert(row.id)} className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"><Plus size={20}/></button>
          <button onClick={() => onDelete(row.id)} className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700"><Trash2 size={20}/></button>
        </div>
      </div>
    </div>
  );
}

// --- CABECERA ---

// Recibe ahora los datos desde App para poder exportarlos juntos
function EditableRoadbookHeader({ data, setData }) {
  const [active, setActive] = useState(null);
  
  const renderField = (field, className, placeholder, rows=1, textAlign='center') => {
    const isEditing = active === field;
    if (isEditing) {
      return (
        <textarea 
          autoFocus 
          rows={rows} 
          value={data[field]} 
          onChange={e => setData({...data, [field]: e.target.value})} 
          onBlur={() => setActive(null)} 
          className={`bg-yellow-50 outline-none w-full p-1 font-bold ${className}`}
          style={{ textAlign: textAlign, fontFamily: 'inherit' }}
        />
      );
    }
    return (
      <div 
        onClick={() => setActive(field)} 
        className={`cursor-text hover:bg-gray-100 rounded p-1 whitespace-pre-wrap transition-all ${!data[field] ? 'bg-gray-50 border-2 border-dashed border-gray-200 min-h-[1.5em]' : ''} ${className}`}
        style={{ textAlign: textAlign }}
      >
        {data[field] || placeholder}
      </div>
    );
  };

  return (
    <header className="border-2 border-black border-b-0 p-6 flex flex-col bg-white overflow-hidden">
      <div className="flex justify-between items-center gap-4 mb-6">
        <div className="flex-1 flex flex-col items-center">
          {renderField('titleI', 'text-2xl font-bold italic uppercase', 'INICIO')}
          <div className="w-full border-2 border-black p-4 shadow-[4px_4px_0_0_black] mt-2">
            {renderField('placeI', 'text-[10px] font-bold uppercase mb-1', 'NOMBRE LUGAR SALIDA')}
            {renderField('coordsI', 'text-sm font-mono font-bold', 'COORDENADAS SALIDA', 2)}
          </div>
        </div>

        <div className="w-40 h-40 shrink-0 flex items-center justify-center relative border-2 border-dashed border-gray-200 rounded-full group overflow-hidden hover:border-gray-300 transition-colors">
          {data.logo ? (
            <img src={data.logo} className="w-full h-full object-contain cursor-pointer" onClick={() => setData({...data, logo: null})}/>
          ) : (
            <button onClick={() => {
              const input = document.createElement('input'); input.type='file';
              input.onchange=e=>{ const r=new FileReader(); r.onload=ev=>setData({...data, logo:ev.target.result}); r.readAsDataURL(e.target.files[0]); };
              input.click();
            }} className="flex flex-col items-center text-gray-400 group-hover:text-black font-bold uppercase text-[8px] transition-colors">
              <ImageIcon size={32} className="mb-2"/> Subir Logo
            </button>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center">
          {renderField('titleF', 'text-2xl font-bold italic uppercase', 'FINAL')}
          <div className="w-full border-2 border-black p-4 shadow-[4px_4px_0_0_black] mt-2">
            {renderField('placeF', 'text-[10px] font-bold uppercase mb-1', 'NOMBRE LUGAR DESTINO')}
            {renderField('coordsF', 'text-sm font-mono font-bold', 'COORDENADAS DESTINO', 2)}
          </div>
        </div>
      </div>
      <div className="border-y-2 border-black py-2">
        {renderField('rules', 'text-[9px] font-bold italic leading-tight', 'REGLAMENTO Y NORMAS...', 6, 'left')}
      </div>
    </header>
  );
}

// --- APP PRINCIPAL ---

export default function App() {
  const [roadbook, setRoadbook] = useState([]);
  
  // Hemos movido el estado de la cabecera aquí para poder exportarlo entero
  const [headerData, setHeaderData] = useState(() => JSON.parse(localStorage.getItem('robibook_header_v4')) || { titleI: "Inicio", placeI: "", coordsI: "", titleF: "Final", placeF: "", coordsF: "", logo: null, rules: "" });
  
  const fileInputRef = useRef(null);
  const loadProjectRef = useRef(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  // Auto-guardado en caché para la cabecera (por si refrescas por error)
  useEffect(() => localStorage.setItem('robibook_header_v4', JSON.stringify(headerData)), [headerData]);

  const handlePrint = () => setShowPrintModal(true);

  // Funciones de Guardado/Carga de Proyecto
  const handleSaveProject = () => {
    const projectData = { version: "1.0", header: headerData, roadbook };
    const blob = new Blob([JSON.stringify(projectData)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${headerData.titleI || 'ruta'}_proyecto.rbk`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadProject = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const projectData = JSON.parse(event.target.result);
        if (projectData.roadbook) setRoadbook(projectData.roadbook);
        if (projectData.header) setHeaderData(projectData.header);
      } catch (error) {
        alert("El archivo no es válido o está corrupto.");
      }
    };
    reader.readAsText(file);
    e.target.value = null; 
  };

  useEffect(() => {
    setRoadbook(prev => {
      let isChanged = false;
      const updated = prev.map((row, idx) => {
        let expected = idx === 0 ? row.totalDist : Math.max(0, row.totalDist - prev[idx-1].totalDist);
        expected = parseFloat(expected.toFixed(2));
        if (Math.abs(row.partialDist - expected) > 0.001) { isChanged = true; return { ...row, partialDist: expected }; }
        return row;
      });
      return isChanged ? updated : prev;
    });
  }, [roadbook.map(r => r.totalDist).join(',')]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const xml = new DOMParser().parseFromString(event.target.result, "text/xml");
      const trk = Array.from(xml.getElementsByTagName('trkpt')).map(p => ({
        lat: parseFloat(p.getAttribute('lat')), lon: parseFloat(p.getAttribute('lon'))
      }));
      let dist = 0;
      const pointsWithDist = trk.map((p, i) => {
        if (i > 0) dist += haversineDistance(trk[i-1].lat, trk[i-1].lon, p.lat, p.lon);
        return { ...p, dist };
      });
      const wpts = Array.from(xml.getElementsByTagName('wpt')).map(w => {
        const lat = parseFloat(w.getAttribute('lat')), lon = parseFloat(w.getAttribute('lon'));
        let closest = pointsWithDist[0]; let minErr = Infinity;
        pointsWithDist.forEach(p => { const err = Math.abs(lat-p.lat) + Math.abs(lon-p.lon); if (err < minErr) { minErr = err; closest = p; } });
        return { id: crypto.randomUUID(), totalDist: parseFloat(closest.dist.toFixed(2)), partialDist: 0, tulipId: 'custom', customTulip: { ...defaultCustomTulip }, infoIcons: [], notes: (w.getElementsByTagName('name')[0]?.textContent || "WAYPOINT").toUpperCase() };
      });
      setRoadbook(wpts.sort((a,b) => a.totalDist - b.totalDist));
    };
    reader.readAsText(file); e.target.value = null;
  };

  const handleManualOpen = () => {
    const manualHTML = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Manual de Usuario - Rally RobiBook Pro</title>
          <style>
              :root { --primary: #2563eb; --bg: #f8fafc; --text: #1e293b; --border: #e2e8f0; }
              body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: var(--text); background: var(--bg); margin: 0; padding: 0; }
              .container { max-width: 800px; margin: 40px auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border: 2px solid black; }
              h1 { border-bottom: 2px solid black; padding-bottom: 15px; text-transform: uppercase; font-weight: 800; letter-spacing: -1px; margin-top: 0; }
              h2 { color: var(--primary); margin-top: 40px; border-bottom: 2px solid var(--border); padding-bottom: 8px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; font-size: 1.2rem; }
              h3 { color: #475569; margin-top: 25px; font-weight: 700; }
              .step { background: #f1f5f9; padding: 20px; border-left: 4px solid #f59e0b; margin-bottom: 20px; border-radius: 0 8px 8px 0; }
              ul { padding-left: 20px; }
              li { margin-bottom: 10px; }
              kbd { background: black; color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.85em; font-family: monospace; font-weight: bold; }
              .icon-btn { display: inline-flex; align-items: center; justify-content: center; background: #e2e8f0; border-radius: 4px; padding: 2px 8px; font-weight: bold; font-size: 0.9em; margin: 0 4px; border: 1px solid #cbd5e1; }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>🏁 Manual de Uso: Rally RobiBook Pro</h1>
              <p>Bienvenido al editor profesional de roadbooks. Esta herramienta está diseñada para digitalizar, editar y maquetar rutómetros con calidad de competición. Aquí tienes todo lo necesario para dominarla.</p>
              
              <h2>1. Primeros Pasos y Carga de Rutas</h2>
              <div class="step">
                  <h3>🌍 Importar un Track (GPX)</h3>
                  <p>Haz clic en el botón <span class="icon-btn">GPX</span> de la barra superior para importar tu ruta. La aplicación leerá los Waypoints de tu archivo, calculará automáticamente las distancias kilométricas entre ellos y creará todas las viñetas necesarias.</p>
              </div>
              <div class="step">
                  <h3>➕ Creación Manual</h3>
                  <p>Usa <span class="icon-btn">+ Añadir Fila</span> para crear viñetas desde cero al final del documento. Si necesitas insertar una viñeta entre dos ya existentes, pasa el ratón por el lado derecho de una fila y pulsa el botón azul <b>+</b>.</p>
              </div>

              <h2>2. Editor de Viñetas (El Canvas Vectorial)</h2>
              <p>Haz clic en el dibujo de cualquier viñeta (columna central) para abrir el editor avanzado:</p>
              <ul>
                  <li><b>Dibujar Vías:</b> Usa los botones inferiores para añadir la ruta <b>+ Principal</b> (azul) o vías <b>+ Adicionales</b> (negras).</li>
                  <li><b>Modificar Curvas:</b> Arrastra los puntos rojos para dar forma a las carreteras. 
                      <br><i>Truco:</i> Haz <b>doble clic</b> en la línea para añadir un nuevo punto de curvatura. Haz doble clic en un punto rojo para eliminarlo.</li>
                  <li><b>Tipos de Terreno:</b> Selecciona una línea (se pondrá naranja). En las "Opciones de Vía", cambia a <i>Tierra</i> (línea discontinua) o conviértela en <i>Autopista</i> (doble línea).</li>
                  <li><b>Grosores:</b> En las vías adicionales, pulsa el botón "Grosor" para alternar entre Fino, Medio y Grueso. La "T" de bloqueo se adaptará automáticamente.</li>
                  <li><b>Rotondas Automáticas:</b> En la parte superior del editor, indica el número de salidas de la rotonda y por cuál debes salir. Pulsa <b>Generar</b> y la app trazará la rotonda perfecta al instante.</li>
                  <li><b>Iconos y Símbolos:</b> Arrastra señales o referencias desde el catálogo inferior al lienzo. Una vez colocado, tócalo para que aparezcan los controles de tamaño <kbd>+</kbd> <kbd>-</kbd> y de rotación <kbd>↺</kbd> <kbd>↻</kbd>.</li>
              </ul>

              <h2>3. Gestión de Distancias e Información</h2>
              <ul>
                  <li><b>Editar Kilómetros:</b> Haz clic en el número de la distancia TOTAL (el número grande de la izquierda) y escribe el nuevo valor. Al pulsar <kbd>Enter</kbd>, la distancia Parcial de esa viñeta (y de la siguiente) se recalcularán matemáticamente.</li>
                  <li><b>Avisos visuales:</b> Si la distancia entre dos viñetas es inferior a 300 metros (0.3 km), el recuadro de la distancia se pintará de verde automáticamente para alertar al piloto.</li>
                  <li><b>Caja de Información:</b> Escribe texto libremente en la tercera columna. Si pasas el ratón por encima, verás un botón azul arriba a la derecha para <b>añadir iconos sueltos</b> (peligros, controles, etc.) que puedes arrastrar libremente por el texto para crear tus notas personalizadas.</li>
              </ul>

              <h2>4. Guardar, Cargar e Imprimir</h2>
              <div class="step">
                  <h3>💾 Guardar Proyecto</h3>
                  <p>Pulsa <b>Guardar</b> para descargar un archivo <code>.rbk</code> (RobiBook) en tu ordenador. Este archivo contiene todas tus distancias, dibujos, notas y configuraciones de cabecera. Es tu copia de seguridad.</p>
              </div>
              <div class="step">
                  <h3>📂 Cargar Proyecto</h3>
                  <p>Al empezar a trabajar otro día, pulsa <b>Cargar</b> y selecciona tu archivo <code>.rbk</code> para restaurar tu trabajo exactamente donde lo dejaste, sin perder ni un detalle.</p>
              </div>
              <div class="step">
                  <h3>🖨️ Exportar a PDF (Imprimir)</h3>
                  <p>Pulsa el botón verde <b>Imprimir</b>. En la ventana que aparece, pulsa "Fijar Pantalla". Inmediatamente después, pulsa <kbd>Ctrl + P</kbd> (o <kbd>Cmd + P</kbd> en Mac). En los ajustes de impresión de tu navegador, asegúrate de configurar el tamaño en <b>A4</b>, los márgenes en <b>Predeterminados</b> y desmarcar la opción de imprimir encabezados/pies de página.</p>
              </div>
          </div>
      </body>
      </html>
    `;
    const blob = new Blob([manualHTML], { type: 'text/html;charset=utf-8' });
    window.open(URL.createObjectURL(blob), '_blank');
  };

  return (
    <div id="main-app-container" tabIndex="-1" className="min-h-screen bg-gray-200 text-black font-sans pb-10 focus:outline-none" dir="ltr">
      <header className="bg-slate-900 text-white p-4 shadow-xl print:hidden flex flex-wrap justify-between items-center gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Map className="w-8 h-8" />
          <h1 className="text-xl font-bold uppercase tracking-widest text-white">Rally RobiBook Pro</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Botón de Manual */}
          <button onClick={handleManualOpen} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 px-4 py-2 rounded font-bold text-sm transition-colors text-black mr-4 shadow-sm" title="Abrir instrucciones"><HelpCircle size={16}/> Manual</button>
          
          {/* Botones de Guardar / Cargar */}
          <button onClick={handleSaveProject} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded font-bold text-sm transition-colors text-white" title="Guardar Proyecto"><Save size={16}/> Guardar</button>
          <button onClick={() => loadProjectRef.current?.click()} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 px-4 py-2 rounded font-bold text-sm transition-colors text-white" title="Cargar Proyecto"><FolderOpen size={16}/> Cargar</button>
          <input type="file" ref={loadProjectRef} onChange={handleLoadProject} accept=".rbk,.json" className="hidden" />

          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded font-bold text-sm transition-colors text-white"><Upload size={16}/> GPX</button>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".gpx" className="hidden" />
          <button onClick={() => setRoadbook([...roadbook, { id: crypto.randomUUID(), totalDist: parseFloat(((roadbook[roadbook.length-1]?.totalDist || 0) + 1).toFixed(2)), partialDist: 1, tulipId: 'custom', customTulip: {...defaultCustomTulip}, infoIcons: [], notes: '' }])} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded font-bold text-sm text-white"><Plus size={16}/> Añadir Fila</button>
          <button onClick={() => setRoadbook([])} className="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-4 py-2 rounded font-bold text-sm text-white"><RotateCcw size={16}/> RESET</button>
          <button onClick={handlePrint} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-4 py-2 rounded font-bold text-sm text-white"><Printer size={16}/> Imprimir</button>
        </div>
      </header>

      <main className="max-w-[800px] mx-auto mt-8 bg-white shadow-2xl print:shadow-none print:mt-0 print:max-w-none print:w-full">
        <EditableRoadbookHeader data={headerData} setData={setHeaderData} />
        
        {/* CORRECCIÓN: Se han quitado las clases "print:border-x-0 print:border-t-0" para que respete la cuadrícula en el PDF */}
        <div className="flex w-full border-2 border-black border-b-0 bg-white text-black font-bold uppercase text-center text-[10px] tracking-widest">
          <div className="w-[30%] p-2 border-r-2 border-black">Distancia</div>
          <div className="w-[35%] p-2 border-r-2 border-black">Dirección</div>
          <div className="w-[35%] p-2">Información</div>
        </div>

        {/* CORRECCIÓN: Se han quitado las clases "print:border-0 print:border-t-2 print:border-black" para que no sobreescriba los bordes */}
        <div className="flex flex-col print:block border-2 border-black border-b-0">
          {roadbook.length === 0 && <div className="p-12 text-center text-gray-400 font-bold print:hidden border-b-2 border-black">AÑADE UNA FILA O CARGA UN GPX</div>}
          {roadbook.map((row, index) => (
            <RoadbookRow 
              key={row.id} 
              row={row} 
              index={index + 1} 
              onUpdate={(id, field, val) => setRoadbook(prev => prev.map(r => r.id === id ? { ...r, [field]: val } : r))} 
              onDelete={id => setRowToDelete(id)} 
              onInsert={id => {
                const insertIdx = roadbook.findIndex(r => r.id === id);
                const nextDist = roadbook[insertIdx+1] ? roadbook[insertIdx+1].totalDist : roadbook[insertIdx].totalDist + 0.1;
                const newRow = { id: crypto.randomUUID(), totalDist: parseFloat(((roadbook[insertIdx].totalDist + nextDist)/2).toFixed(2)), partialDist: 0, tulipId: 'custom', customTulip: {...defaultCustomTulip}, infoIcons: [], notes: '' };
                const updated = [...roadbook]; updated.splice(insertIdx+1, 0, newRow); setRoadbook(updated);
              }} 
            />
          ))}
        </div>
      </main>

      {rowToDelete && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4" onPointerDown={() => setRowToDelete(null)}>
          <div className="bg-white p-6 rounded-2xl border-2 border-black text-center max-w-sm" onPointerDown={e => e.stopPropagation()}>
            <Trash2 size={48} className="mx-auto text-red-600 mb-4" /><h2 className="text-xl font-bold mb-6 uppercase text-black">¿Eliminar viñeta?</h2>
            <div className="flex gap-4"><button onClick={() => setRowToDelete(null)} className="flex-1 bg-gray-200 py-3 rounded font-bold text-black hover:bg-gray-300 transition-colors">CANCELAR</button><button onClick={() => { setRoadbook(prev => prev.filter(r => r.id !== rowToDelete)); setRowToDelete(null); }} className="flex-1 bg-red-600 text-white py-3 rounded font-bold hover:bg-red-700 transition-colors">ELIMINAR</button></div>
          </div>
        </div>
      )}

      {showPrintModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center print:hidden backdrop-blur-sm" onPointerDown={() => setShowPrintModal(false)}>
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md text-center border-2 border-black" onPointerDown={e => e.stopPropagation()}>
            <Printer className="w-16 h-16 text-black mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight text-black">Imprimir Roadbook</h2>
            <div className="text-left text-gray-700 mb-6 font-medium text-base bg-yellow-50 p-4 border-2 border-yellow-400 rounded-xl">
              <p className="mb-2 font-bold text-black">Pasos para un PDF perfecto:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Pulsa el botón <b className="text-blue-700">"Fijar Pantalla"</b> de abajo.</li>
                <li>Pulsa inmediatamente <span className="bg-white px-2 py-1 rounded border-2 border-black font-bold font-mono text-sm">Ctrl + P</span> (o Cmd+P).</li>
                <li>En la ventana de impresión pon <b>Tamaño: A4</b>.</li>
                <li>Pon <b>Márgenes: Predeterminados</b> (¡NO pongas "Ninguno" o cortará las viñetas!).</li>
              </ol>
            </div>
            <button
              onClick={() => {
                setShowPrintModal(false);
                setTimeout(() => {
                  const container = document.getElementById('main-app-container');
                  if (container) container.focus();
                }, 100);
              }}
              className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-blue-700 text-lg uppercase tracking-wider transition-colors shadow-[4px_4px_0_0_#1e3a8a] active:translate-y-1 active:shadow-none"
            >
              Fijar Pantalla
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          html, body, #root, #main-app-container { 
            background-color: white !important; 
            margin: 0 !important; 
            padding: 0 !important; 
            height: auto !important;
            min-height: auto !important;
            overflow: visible !important;
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact; 
          }
          @page { 
            margin: 10mm; 
          }
          .min-h-screen { min-height: auto !important; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:w-full { width: 100% !important; max-width: 100% !important; }
          .print\\:mt-0 { margin-top: 0 !important; }
          
          /* Evitar que se corten las viñetas */
          .roadbook-row { 
            page-break-inside: avoid !important; 
            break-inside: avoid !important; 
            display: block !important;
          }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}