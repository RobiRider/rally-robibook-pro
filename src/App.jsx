import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Plus, Printer, Trash2, MapPin, AlertTriangle, Info, 
  ArrowUp, ArrowUpRight, ArrowRight, ArrowDownRight, ArrowDown, 
  ArrowDownLeft, ArrowLeft, ArrowUpLeft, CornerUpRight, CornerUpLeft, Navigation,
  Octagon, Map, PenTool, RotateCcw, Settings, Image as ImageIcon,
  Home, Fuel, Coffee, Camera, Tent
} from 'lucide-react';

// --- UTILIDADES GEOGRÁFICAS ---
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const formatRallyDist = (num) => {
  if (num === null || num === undefined || isNaN(num)) return "0,000";
  return parseFloat(num).toFixed(3).replace('.', ',');
};

// --- MOTOR DE CURVAS ---
const catmullRom2bezier = (points) => {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
  if (points.length === 2) return `M ${points[0].x},${points[0].y} L ${points[1].x},${points[1].y}`;
  
  let d = `M ${points[0].x},${points[0].y} `;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i === 0 ? points[0] : points[i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i + 2 < points.length ? points[i + 2] : p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y} `;
  }
  return d;
};

// --- LIBRERÍA DE ICONOS RALLY ---
const RALLY_ICONS = [
  { type: 'alert_1', label: 'Peligro 1', icon: <AlertTriangle width="100%" height="100%" color="black" strokeWidth={2.5} /> },
  { type: 'alert_2', label: 'Peligro 2', icon: (
      <svg viewBox="0 0 44 24" width="100%" height="100%">
        <AlertTriangle x="0" y="0" width="24" height="24" color="black" strokeWidth={2.5} />
        <AlertTriangle x="20" y="0" width="24" height="24" color="black" strokeWidth={2.5} />
      </svg>
  )},
  { type: 'alert_3', label: 'Peligro 3', icon: (
      <svg viewBox="0 0 64 24" width="100%" height="100%">
        <AlertTriangle x="0" y="0" width="24" height="24" color="black" strokeWidth={2.5} />
        <AlertTriangle x="20" y="0" width="24" height="24" color="black" strokeWidth={2.5} />
        <AlertTriangle x="40" y="0" width="24" height="24" color="black" strokeWidth={2.5} />
      </svg>
  )},
  { type: 'stop', label: 'STOP', icon: (
      <svg viewBox="0 0 24 24" width="100%" height="100%">
        <Octagon x="0" y="0" width="24" height="24" fill="black" color="black" />
        <text x="12" y="15" fill="white" fontSize="7" fontWeight="black" textAnchor="middle">STOP</text>
      </svg>
  )},
  { type: 'speed_30', label: 'Vel 30', icon: (
      <svg viewBox="0 0 24 24" width="100%" height="100%">
        <circle cx="12" cy="12" r="11" fill="white" stroke="black" strokeWidth="2.5" />
        <text x="12" y="16" fill="black" fontSize="10" fontWeight="bold" textAnchor="middle">30</text>
      </svg>
  )},
  { type: 'speed_50', label: 'Vel 50', icon: (
      <svg viewBox="0 0 24 24" width="100%" height="100%">
        <circle cx="12" cy="12" r="11" fill="white" stroke="black" strokeWidth="2.5" />
        <text x="12" y="16" fill="black" fontSize="10" fontWeight="bold" textAnchor="middle">50</text>
      </svg>
  )},
  { type: 'speed_70', label: 'Vel 70', icon: (
      <svg viewBox="0 0 24 24" width="100%" height="100%">
        <circle cx="12" cy="12" r="11" fill="white" stroke="black" strokeWidth="2.5" />
        <text x="12" y="16" fill="black" fontSize="10" fontWeight="bold" textAnchor="middle">70</text>
      </svg>
  )},
  { type: 'waypoint', label: 'Waypoint', icon: <MapPin width="100%" height="100%" fill="black" color="white" strokeWidth={1.5} /> },
  { type: 'house', label: 'Casa', icon: <Home width="100%" height="100%" color="black" strokeWidth={2.5} /> },
  { type: 'gas', label: 'Gasolinera', icon: <Fuel width="100%" height="100%" color="black" strokeWidth={2.5} /> },
  { type: 'cafe', label: 'Cafetería', icon: <Coffee width="100%" height="100%" color="black" strokeWidth={2.5} /> },
  { type: 'camera', label: 'Radar', icon: <Camera width="100%" height="100%" color="black" strokeWidth={2.5} /> },
  { type: 'tent', label: 'Campamento', icon: <Tent width="100%" height="100%" color="black" strokeWidth={2.5} /> },
  { type: 'bridge', label: 'Puente', icon: <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="black" strokeWidth="2.5"><path d="M2 12c0-4 4-8 10-8s10 4 10 8 M2 16h20 M6 16v4 M18 16v4"/></svg> },
  { type: 'water', label: 'Badén/Agua', icon: <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="black" strokeWidth="2.5"><path d="M2 12 Q7 7 12 12 T22 12 M2 18 Q7 13 12 18 T22 18"/></svg> }
];

const RenderIcon = (type) => RALLY_ICONS.find(i => i.type === type)?.icon || null;

// --- ESTRUCTURA VECTORIAL ---
const defaultCustomTulip = {
  isRoundabout: false,
  paths: [{ id: 'main-1', type: 'main', points: [{x: 50, y: 90}, {x: 50, y: 50}, {x: 50, y: 10}] }],
  icons: [] 
};

const normalizeTulip = (data) => {
  if (!data || !Array.isArray(data.paths)) return defaultCustomTulip;
  return { ...data, icons: data.icons || [] };
};

const TULIP_ICONS = [
  { id: 'straight', icon: ArrowUp, label: 'Recto' },
  { id: 'slight_right', icon: ArrowUpRight, label: 'Ligera Derecha' },
  { id: 'right', icon: ArrowRight, label: 'Derecha' },
  { id: 'hard_right', icon: CornerUpRight, label: 'Derecha Cerrada' },
  { id: 'u_turn', icon: ArrowDown, label: 'Media Vuelta' },
  { id: 'hard_left', icon: CornerUpLeft, label: 'Izquierda Cerrada' },
  { id: 'left', icon: ArrowLeft, label: 'Izquierda' },
  { id: 'slight_left', icon: ArrowUpLeft, label: 'Ligera Izquierda' },
  { id: 'start', icon: Navigation, label: 'Salida' }
];

export default function App() {
  const [roadbook, setRoadbook] = useState([]);
  const fileInputRef = useRef(null);
  
  // Nuevo estado para controlar el aviso de impresión
  const [showPrintModal, setShowPrintModal] = useState(false);
  
  // Nuevo estado para controlar la confirmación de borrado
  const [rowToDelete, setRowToDelete] = useState(null);

  const handlePrint = () => {
    // Intenta forzar el foco y lanzar la impresión
    setTimeout(() => {
      window.focus();
      window.print();
    }, 100);
    // Muestra las instrucciones por si el navegador bloquea la acción automática
    setShowPrintModal(true);
  };

  useEffect(() => {
    setRoadbook(prev => {
      let isChanged = false;
      const updated = prev.map((row, index) => {
        let expectedPartial = 0;
        if (index === 0) {
          expectedPartial = row.totalDist; 
        } else {
          const prevTotal = prev[index - 1].totalDist;
          if (row.totalDist < prevTotal) expectedPartial = row.totalDist; 
          else expectedPartial = row.totalDist - prevTotal;
        }
        expectedPartial = Math.max(0, expectedPartial);
        if (Math.abs(row.partialDist - expectedPartial) > 0.0001) {
          isChanged = true; return { ...row, partialDist: expectedPartial };
        }
        return row;
      });
      return isChanged ? updated : prev;
    });
  }, [roadbook.map(r => r.totalDist).join(',')]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const gpxText = event.target.result;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(gpxText, "text/xml");

      const trkseg = xmlDoc.getElementsByTagName('trkpt');
      let points = [];
      let cumulativeDist = 0;

      for (let i = 0; i < trkseg.length; i++) {
        const lat = parseFloat(trkseg[i].getAttribute('lat'));
        const lon = parseFloat(trkseg[i].getAttribute('lon'));
        if (i > 0) {
          const prevLat = parseFloat(trkseg[i-1].getAttribute('lat'));
          const prevLon = parseFloat(trkseg[i-1].getAttribute('lon'));
          cumulativeDist += haversineDistance(prevLat, prevLon, lat, lon);
        }
        points.push({ lat, lon, dist: cumulativeDist });
      }

      const wpts = xmlDoc.getElementsByTagName('wpt');
      let newRoadbook = [];

      if (points.length > 0) {
        newRoadbook.push({
          id: crypto.randomUUID(), totalDist: 0, partialDist: 0,
          tulipId: 'start', customTulip: null, infoIcons: [], notes: 'INICIO / START', lat: points[0].lat, lon: points[0].lon
        });
      }

      for (let i = 0; i < wpts.length; i++) {
        const lat = parseFloat(wpts[i].getAttribute('lat'));
        const lon = parseFloat(wpts[i].getAttribute('lon'));
        let name = "WAYPOINT", desc = "";
        
        const nameNode = wpts[i].getElementsByTagName('name')[0];
        if (nameNode) name = nameNode.textContent.toUpperCase();
        const descNode = wpts[i].getElementsByTagName('desc')[0];
        if (descNode) desc = descNode.textContent.toUpperCase();

        let closestDist = 0, minError = Infinity;
        points.forEach(p => {
          const err = haversineDistance(lat, lon, p.lat, p.lon);
          if (err < minError) { minError = err; closestDist = p.dist; }
        });

        if (closestDist > 0.05) {
          const isStop = name.includes('STOP');
          const isDanger = name.includes('PELIGRO') || name.includes('DANGER');
          
          let initIcons = [];
          if (isStop) initIcons.push({ id: crypto.randomUUID(), type: 'stop', x: 50, y: 50, scale: 1 });
          else if (isDanger) initIcons.push({ id: crypto.randomUUID(), type: 'alert_1', x: 50, y: 50, scale: 1 });

          newRoadbook.push({
            id: crypto.randomUUID(), totalDist: parseFloat(closestDist.toFixed(3)), partialDist: 0, 
            tulipId: 'custom',
            customTulip: { ...JSON.parse(JSON.stringify(defaultCustomTulip)), icons: initIcons },
            infoIcons: [],
            notes: `${name}\n${desc}`.trim(), lat, lon
          });
        }
      }

      newRoadbook.sort((a, b) => a.totalDist - b.totalDist);
      setRoadbook(newRoadbook);
    };
    reader.readAsText(file);
    e.target.value = null; 
  };

  const addManualRow = () => {
    const lastDist = roadbook.length > 0 ? roadbook[roadbook.length - 1].totalDist : 0;
    setRoadbook([...roadbook, {
        id: crypto.randomUUID(), totalDist: parseFloat((lastDist + 1.0).toFixed(3)), partialDist: 1.0,
        tulipId: 'custom', customTulip: JSON.parse(JSON.stringify(defaultCustomTulip)), infoIcons: [], notes: '', lat: null, lon: null
    }]);
  };

  const addResetRow = () => {
    setRoadbook([...roadbook, {
        id: crypto.randomUUID(), totalDist: 0, partialDist: 0,
        tulipId: 'start', customTulip: null, infoIcons: [], notes: '0000\nRESET', lat: null, lon: null
    }]);
  };

  const insertRowAfter = (id) => {
    setRoadbook(prev => {
      const index = prev.findIndex(r => r.id === id);
      if (index === -1) return prev;
      const newRoadbook = [...prev];
      const currentRow = newRoadbook[index];
      const nextRow = newRoadbook[index + 1];
      let suggestedDist = currentRow.totalDist + (nextRow && nextRow.totalDist > currentRow.totalDist ? (nextRow.totalDist - currentRow.totalDist) / 2 : 0.1);

      newRoadbook.splice(index + 1, 0, {
        id: crypto.randomUUID(), totalDist: parseFloat(suggestedDist.toFixed(3)), partialDist: 0,
        tulipId: 'custom', customTulip: JSON.parse(JSON.stringify(defaultCustomTulip)), infoIcons: [], notes: '', lat: null, lon: null
      });
      return newRoadbook;
    });
  };

  const updateRow = (id, fieldOrUpdates, value) => {
    setRoadbook(prev => prev.map(row => {
      if (row.id === id) {
        if (typeof fieldOrUpdates === 'object' && fieldOrUpdates !== null) return { ...row, ...fieldOrUpdates };
        return { ...row, [fieldOrUpdates]: value };
      }
      return row;
    }));
  };

  const requestDeleteRow = (id) => {
    setRowToDelete(id);
  };

  const confirmDelete = () => {
    if (rowToDelete) {
      setRoadbook(prev => prev.filter(row => row.id !== rowToDelete));
      setRowToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 text-black font-sans pb-10">
      <header className="bg-slate-900 text-white p-4 shadow-xl print:hidden flex flex-wrap justify-between items-center gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Map className="w-8 h-8 text-white" />
          <div>
            <h1 className="text-xl font-bold uppercase tracking-widest">Rally RobiBook Pro</h1>
            {/* FRASE ELIMINADA */}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded font-bold text-sm transition-colors"><Upload className="w-4 h-4" /> GPX</button>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".gpx" className="hidden" />
          <button onClick={addManualRow} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded font-bold text-sm transition-colors"><Plus className="w-4 h-4" /> Añadir Fila</button>
          <button onClick={addResetRow} className="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-4 py-2 rounded font-bold text-sm transition-colors"><Info className="w-4 h-4" /> RESET</button>
          <button onClick={handlePrint} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-4 py-2 rounded font-bold text-sm transition-colors"><Printer className="w-4 h-4" /> Imprimir</button>
        </div>
      </header>

      <main className="max-w-[800px] mx-auto mt-8 bg-white shadow-2xl print:shadow-none print:mt-0 print:max-w-none print:w-full">
        <div className="flex w-full border-4 border-black border-b-0 bg-white text-black font-black uppercase text-center text-sm tracking-widest print:border-t-0 print:border-l-0 print:border-r-0">
          <div className="w-[25%] p-2 border-r-4 border-black">Distancia</div>
          <div className="w-[35%] p-2 border-r-4 border-black">Dirección</div>
          <div className="w-[40%] p-2">Información</div>
        </div>
        <div className="flex flex-col border-4 border-black border-b-0 print:border-0 print:border-t-4 print:border-black">
          {roadbook.length === 0 && <div className="p-12 text-center text-gray-400 font-bold print:hidden border-b-4 border-black">AÑADE UNA FILA O CARGA UN GPX</div>}
          {roadbook.map((row, index) => (
            <RoadbookRow key={row.id} row={row} index={index + 1} onUpdate={updateRow} onDelete={requestDeleteRow} onInsert={insertRowAfter} />
          ))}
        </div>
        <div className="h-4 border-t-4 border-black print:hidden"></div>
      </main>

      {/* MODAL DE CONFIRMACIÓN DE BORRADO */}
      {rowToDelete && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center print:hidden backdrop-blur-sm" onPointerDown={() => setRowToDelete(null)}>
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm text-center border-4 border-black" onPointerDown={e => e.stopPropagation()}>
            <Trash2 className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-black mb-2 uppercase tracking-tight">¿Eliminar viñeta?</h2>
            <p className="text-gray-600 mb-6 font-medium">Esta acción eliminará la fila por completo y no se puede deshacer.</p>
            <div className="flex gap-4">
              <button onClick={() => setRowToDelete(null)} className="flex-1 bg-gray-200 text-black font-bold py-3 px-4 rounded hover:bg-gray-300 transition-colors uppercase border-2 border-gray-300">
                Cancelar
              </button>
              <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white font-bold py-3 px-4 rounded hover:bg-red-700 transition-colors uppercase border-2 border-red-700">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL INSTRUCCIONES DE IMPRESIÓN */}
      {showPrintModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center print:hidden backdrop-blur-sm" onPointerDown={() => setShowPrintModal(false)}>
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md text-center border-4 border-black" onPointerDown={e => e.stopPropagation()}>
            <Printer className="w-16 h-16 text-black mx-auto mb-4" />
            <h2 className="text-2xl font-black mb-2 uppercase tracking-tight">Imprimir Roadbook</h2>
            <p className="text-gray-700 mb-6 font-medium text-lg">
              Si la ventana no se abre automáticamente, pulsa:<br/><br/>
              <span className="bg-gray-200 px-3 py-1 rounded border-2 border-gray-400 font-bold font-mono">Ctrl + P</span> (Windows)<br/>
              <span className="bg-gray-200 px-3 py-1 rounded border-2 border-gray-400 font-bold font-mono mt-2 inline-block">Cmd + P</span> (Mac)
            </p>
            <p className="text-sm text-gray-500 mb-6">
              El diseño está optimizado para generar un PDF en formato rollo, ocultando todos los botones y menús.
            </p>
            <button 
              onClick={() => setShowPrintModal(false)} 
              className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded hover:bg-green-700 text-lg uppercase tracking-wider transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background-color: white !important; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 0; size: auto; }
          .print\\:hidden { display: none !important; }
          .print\\:border-0 { border: none !important; }
          .print\\:border-t-4 { border-top-width: 4px !important; }
          .print\\:border-black { border-color: black !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:w-full { width: 100% !important; max-width: 100% !important; }
          .print\\:mt-0 { margin-top: 0 !important; }
          .roadbook-row { page-break-inside: avoid; break-inside: avoid; }
        }
      `}} />
    </div>
  );
}

// --- COMPONENTE DE VISTA ESTÁTICA TULIPA (SVG CORE) ---
function StaticTulipRenderer({ data, id }) {
  const { paths, isRoundabout, icons } = normalizeTulip(data);
  const hasEntry = paths.some(p => p.type === 'entry');
  
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      <defs>
        <marker id={`arrow-${id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="black" />
        </marker>
      </defs>

      {isRoundabout && <circle cx="50" cy="50" r="15" fill="none" stroke="black" strokeWidth="4" />}

      {paths.filter(p => p.type === 'secondary').map(path => (
        <path key={path.id} d={catmullRom2bezier(path.points)} fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {paths.filter(p => p.type === 'entry').map(path => (
        <g key={path.id}>
          <path d={catmullRom2bezier(path.points)} fill="none" stroke="black" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          {path.points.length > 0 && <circle cx={path.points[0].x} cy={path.points[0].y} r="5" fill="black" />}
        </g>
      ))}
      {paths.filter(p => p.type === 'main').map(path => (
        <g key={path.id}>
          <path d={catmullRom2bezier(path.points)} fill="none" stroke="black" strokeWidth="5" markerEnd={`url(#arrow-${id})`} strokeLinecap="round" strokeLinejoin="round" />
          {!hasEntry && path.points.length > 0 && <circle cx={path.points[0].x} cy={path.points[0].y} r="5" fill="black" />}
        </g>
      ))}
      
      {icons.map(ic => {
        const size = 30 * (ic.scale || 1);
        const xPos = ic.x - size / 2;
        const yPos = ic.y - size / 2;
        
        if (ic.type === 'custom_image') {
          return <image key={ic.id} href={ic.dataUrl} x={xPos} y={yPos} width={size} height={size} preserveAspectRatio="xMidYMid meet" />;
        }
        
        return (
          <svg key={ic.id} x={xPos} y={yPos} width={size} height={size} overflow="visible">
            {RenderIcon(ic.type)}
          </svg>
        );
      })}
    </svg>
  );
}

// --- EDITOR VECTORIAL TULIPA ---
function TulipVectorEditor({ data, onSave, onCancel }) {
  const normData = normalizeTulip(data);
  const [paths, setPaths] = useState(normData.paths);
  const [icons, setIcons] = useState(normData.icons);
  const [isRoundabout, setIsRoundabout] = useState(normData.isRoundabout);
  
  const [rExits, setRExits] = useState(3);
  const [rTarget, setRTarget] = useState(2);

  const svgRef = useRef(null);
  const customImgInputRef = useRef(null);
  
  const [dragging, setDragging] = useState(null); 
  const [selectedIconId, setSelectedIconId] = useState(null);

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
    
    if (target.type === 'icon') setSelectedIconId(target.iconId);
    else setSelectedIconId(null);
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

  const updateSelectedIconScale = (delta) => {
    if (!selectedIconId) return;
    setIcons(icons.map(ic => {
      if (ic.id === selectedIconId) return { ...ic, scale: Math.max(0.5, Math.min(4, (ic.scale || 1) + delta)) };
      return ic;
    }));
  };

  const deleteSelectedIcon = () => {
    if (!selectedIconId) return;
    setIcons(icons.filter(ic => ic.id !== selectedIconId));
    setSelectedIconId(null);
  };

  const addIcon = (type, dataUrl = null) => {
    const newIcon = { id: crypto.randomUUID(), type, x: 50, y: 50, scale: 1, dataUrl };
    setIcons([...icons, newIcon]);
    setSelectedIconId(newIcon.id);
  };

  const handleCustomImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => addIcon('custom_image', event.target.result);
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const addSecondaryPath = () => setPaths([...paths, { id: crypto.randomUUID(), type: 'secondary', points: [{x: 50, y: 50}, {x: 80, y: 30}] }]);
  const addMainPath = () => setPaths([...paths, { id: crypto.randomUUID(), type: 'main', points: [{x: 50, y: 90}, {x: 50, y: 50}, {x: 50, y: 10}] }]);
  const generateRoundabout = () => {
    const newPaths = [];
    const totalLegs = rExits + 1;
    newPaths.push({ id: crypto.randomUUID(), type: 'entry', points: [{x: 50, y: 90}, {x: 50, y: 65}] });
    for (let i = 1; i <= rExits; i++) {
      const angle = Math.PI / 2 - i * (2 * Math.PI / totalLegs);
      const isTarget = (i === rTarget);
      const r1 = 15; const r2 = isTarget ? 45 : 30;
      newPaths.push({ id: crypto.randomUUID(), type: isTarget ? 'main' : 'secondary', points: [{x: 50 + r1 * Math.cos(angle), y: 50 + r1 * Math.sin(angle)}, {x: 50 + r2 * Math.cos(angle), y: 50 + r2 * Math.sin(angle)}] });
    }
    setPaths(newPaths); setIsRoundabout(true);
  };

  return (
    <div className="flex flex-col items-center select-none w-full">
      <div className="text-[10px] text-gray-500 mb-2 font-bold uppercase flex justify-between w-full px-2">
        <span>Arrástrame</span>
        <span>Línea 2 clics = + Nodo</span>
      </div>
      
      <div className="w-64 h-64 border-2 border-dashed border-gray-400 bg-gray-50 mb-2 relative touch-none shadow-inner rounded overflow-hidden" onPointerDown={() => setSelectedIconId(null)}>
        <svg ref={svgRef} viewBox="0 0 100 100" className="w-full h-full overflow-visible" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
          <defs><marker id="editor-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 1 L 10 5 L 0 9 z" fill="#000" /></marker></defs>
          {isRoundabout && <circle cx="50" cy="50" r="15" fill="none" stroke="#cbd5e1" strokeWidth="4" />}
          
          {paths.map(path => (
            <g key={path.id}>
              <path d={catmullRom2bezier(path.points)} stroke="transparent" strokeWidth="15" fill="none" onDoubleClick={(e) => handleLineDoubleClick(e, path.id)} className="cursor-crosshair" />
              {path.type === 'secondary' && <path d={catmullRom2bezier(path.points)} stroke="#64748b" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none" />}
              {path.type === 'entry' && <path d={catmullRom2bezier(path.points)} stroke="black" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none" />}
              {path.type === 'main' && <path d={catmullRom2bezier(path.points)} stroke="black" strokeWidth="4" fill="none" markerEnd="url(#editor-arrow)" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none" />}
            </g>
          ))}

          {paths.map(path => path.points.map((p, i) => (
            <circle key={`${path.id}-pt-${i}`} cx={p.x} cy={p.y} r="6" fill="#ef4444" stroke="white" strokeWidth="2" className="cursor-grab active:cursor-grabbing hover:fill-red-500 transition-all"
              onPointerDown={(e) => handlePointerDown(e, { type: 'node', pathId: path.id, pointIdx: i })} onDoubleClick={(e) => handleDeletePoint(e, path.id, i)}
            />
          )))}

          {icons.map(ic => {
            const size = 30 * (ic.scale || 1);
            const xPos = ic.x - size / 2;
            const yPos = ic.y - size / 2;
            const isSelected = selectedIconId === ic.id;

            return (
              <g key={ic.id} onPointerDown={(e) => handlePointerDown(e, { type: 'icon', iconId: ic.id })} className="cursor-grab active:cursor-grabbing">
                <rect x={xPos - 5} y={yPos - 5} width={size + 10} height={size + 10} fill="transparent" />
                {isSelected && <rect x={xPos - 2} y={yPos - 2} width={size + 4} height={size + 4} fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2,2" rx="2" />}
                
                {ic.type === 'custom_image' ? (
                  <image href={ic.dataUrl} x={xPos} y={yPos} width={size} height={size} preserveAspectRatio="xMidYMid meet" className="pointer-events-none"/>
                ) : (
                  <svg x={xPos} y={yPos} width={size} height={size} overflow="visible" className="pointer-events-none">
                    {RenderIcon(ic.type)}
                  </svg>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {selectedIconId && (
        <div className="w-full bg-blue-50 border border-blue-300 shadow-sm rounded p-1 mb-2 flex justify-between items-center relative z-20">
          <span className="text-[10px] font-bold text-blue-800 ml-2 uppercase">Tamaño Icono</span>
          <div className="flex gap-1">
            <button onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); updateSelectedIconScale(-0.2); }} className="px-3 py-1 bg-white border border-blue-200 rounded text-lg font-bold hover:bg-blue-100 leading-none">-</button>
            <button onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); updateSelectedIconScale(0.2); }} className="px-3 py-1 bg-white border border-blue-200 rounded text-lg font-bold hover:bg-blue-100 leading-none">+</button>
            <button onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); deleteSelectedIcon(); }} className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-bold hover:bg-red-200 ml-2"><Trash2 size={16}/></button>
          </div>
        </div>
      )}

      <div className="w-full bg-slate-100 p-2 rounded mb-2 border border-slate-300">
        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
          <button onClick={() => customImgInputRef.current?.click()} className="shrink-0 flex items-center gap-1 h-8 px-2 bg-blue-100 border border-blue-300 rounded hover:bg-blue-200 text-xs font-bold text-blue-800 whitespace-nowrap">
            <ImageIcon size={14}/> Subir
          </button>
          <input type="file" ref={customImgInputRef} onChange={handleCustomImageUpload} accept="image/*" className="hidden" />
          
          {RALLY_ICONS.map(ic => (
            <button key={ic.type} onClick={() => addIcon(ic.type)} className="shrink-0 w-8 h-8 p-1 bg-white border border-slate-300 rounded hover:bg-blue-50 flex items-center justify-center" title={ic.label}>
              <div className="w-full h-full pointer-events-none">{ic.icon}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full bg-blue-50 border border-blue-200 rounded p-2 mb-2">
        <div className="text-xs font-bold text-blue-800 mb-1 flex items-center gap-1"><Settings size={12}/> Rotonda Automática</div>
        <div className="flex items-center gap-2 text-xs">
          <label className="flex items-center text-slate-700">Sal: <input type="number" min="1" max="8" value={rExits} onChange={e => setRExits(Math.max(1, Number(e.target.value)))} className="w-8 ml-1 p-0.5 border rounded text-center" /></label>
          <label className="flex items-center text-slate-700">Tomar: <input type="number" min="1" max={rExits} value={rTarget} onChange={e => setRTarget(Math.max(1, Math.min(rExits, Number(e.target.value))))} className="w-8 ml-1 p-0.5 border rounded text-center" /></label>
          <button onClick={generateRoundabout} className="ml-auto bg-blue-600 text-white px-2 py-1 rounded font-bold hover:bg-blue-700 transition">Generar</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 w-full mb-2">
        <button onClick={addSecondaryPath} className="bg-slate-200 text-slate-800 text-xs font-bold py-2 px-1 rounded border border-slate-300 hover:bg-slate-300">+ Vía Secundaria</button>
        <button onClick={addMainPath} className="bg-slate-800 text-white text-xs font-bold py-2 px-1 rounded hover:bg-slate-700">+ Vía Principal</button>
      </div>

      <div className="w-full mt-2 pt-2 border-t-2 border-slate-200 flex gap-2">
        <button onClick={onCancel} className="flex-1 bg-slate-200 text-slate-700 font-bold py-2 rounded hover:bg-slate-300">Cancelar</button>
        <button onClick={() => onSave({ paths, isRoundabout, icons })} className="flex-1 bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700 shadow">Guardar Cambios</button>
      </div>
    </div>
  );
}

// --- COMPONENTE DE FILA PRINCIPAL ---
function RoadbookRow({ row, index, onUpdate, onDelete, onInsert }) {
  const [showTulipEditor, setShowTulipEditor] = useState(false);
  
  const [isEditingDist, setIsEditingDist] = useState(false);
  const [tempDist, setTempDist] = useState('');
  const handleDistClick = () => { setTempDist(row.totalDist.toString()); setIsEditingDist(true); };
  const handleDistBlur = () => {
    setIsEditingDist(false);
    let val = parseFloat(tempDist.replace(',', '.'));
    if (isNaN(val)) val = row.totalDist; 
    onUpdate(row.id, 'totalDist', val);
  };

  const infoRef = useRef(null);
  const customInfoImgInputRef = useRef(null);
  const [infoIcons, setInfoIcons] = useState(row.infoIcons || []);
  const [showInfoIconPicker, setShowInfoIconPicker] = useState(false);
  
  const [draggingInfo, setDraggingInfo] = useState(null);
  const [selectedInfoIconId, setSelectedInfoIconId] = useState(null);

  useEffect(() => { setInfoIcons(row.infoIcons || []) }, [row.infoIcons]);

  const handleInfoAddIcon = (type, dataUrl = null) => {
    const newIcons = [...infoIcons, { id: crypto.randomUUID(), type, x: 80, y: 50, scale: 1, dataUrl }];
    setInfoIcons(newIcons);
    onUpdate(row.id, 'infoIcons', newIcons);
    setShowInfoIconPicker(false);
    setSelectedInfoIconId(newIcons[newIcons.length - 1].id);
  };

  const handleInfoCustomImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => handleInfoAddIcon('custom_image', event.target.result);
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const handleInfoPointerDown = (e, id) => {
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    setDraggingInfo(id);
    setSelectedInfoIconId(id);
  };

  const handleInfoPointerMove = (e) => {
    if (!draggingInfo) return;
    const rect = infoRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setInfoIcons(infoIcons.map(ic => ic.id === draggingInfo ? { ...ic, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) } : ic));
  };

  const handleInfoPointerUp = (e) => {
    if (draggingInfo) {
      e.target.releasePointerCapture(e.pointerId);
      setDraggingInfo(null);
      onUpdate(row.id, 'infoIcons', infoIcons); 
    }
  };

  const updateSelectedInfoIconScale = (delta) => {
    if (!selectedInfoIconId) return;
    const updated = infoIcons.map(ic => ic.id === selectedInfoIconId ? { ...ic, scale: Math.max(0.5, Math.min(4, (ic.scale || 1) + delta)) } : ic);
    setInfoIcons(updated);
    onUpdate(row.id, 'infoIcons', updated);
  };

  const deleteSelectedInfoIcon = () => {
    if (!selectedInfoIconId) return;
    const updated = infoIcons.filter(ic => ic.id !== selectedInfoIconId);
    setInfoIcons(updated);
    onUpdate(row.id, 'infoIcons', updated);
    setSelectedInfoIconId(null);
  };

  const isCustomMode = row.tulipId === 'custom' && row.customTulip;

  return (
    <div className="flex border-b-4 border-black bg-white roadbook-row min-h-[160px] relative group">
      
      <div className="w-[25%] border-r-4 border-black flex flex-col">
        <div className="flex-1 border-b-4 border-black flex items-center justify-center p-2 relative bg-white hover:bg-gray-50 cursor-text" onClick={!isEditingDist ? handleDistClick : undefined}>
          {isEditingDist ? (
            <input autoFocus type="text" value={tempDist} onChange={(e) => setTempDist(e.target.value)} onBlur={handleDistBlur} onKeyDown={e => { if (e.key === 'Enter') e.target.blur() }} className="w-full text-center text-4xl sm:text-5xl font-black text-black bg-transparent outline-none" />
          ) : (
            <span className="text-4xl sm:text-5xl font-black text-black tracking-tighter">{formatRallyDist(row.totalDist)}</span>
          )}
        </div>
        <div className="h-[40%] min-h-[50px] flex items-center justify-center p-1 bg-white">
          <span className="text-2xl sm:text-3xl font-bold text-black">{formatRallyDist(row.partialDist)}</span>
        </div>
      </div>

      <div className="w-[35%] border-r-4 border-black relative flex items-center justify-center p-4 bg-white">
        <div className="absolute top-2 left-2 border-[3px] border-black bg-white px-2 py-0.5 text-lg font-black text-black z-10">{index}</div>

        <button onClick={() => setShowTulipEditor(true)} className="w-full h-full flex items-center justify-center focus:outline-none print:pointer-events-none hover:bg-gray-50 transition-colors p-2">
          {isCustomMode ? (
            <div className="w-24 h-24 sm:w-32 sm:h-32"><StaticTulipRenderer data={row.customTulip} id={row.id} /></div>
          ) : (
            (() => {
              const currentTulip = TULIP_ICONS.find(t => t.id === row.tulipId) || TULIP_ICONS[0];
              const IconComponent = currentTulip.icon;
              return <IconComponent className="w-24 h-24 text-black stroke-[2]" />;
            })()
          )}
        </button>

        {showTulipEditor && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-4 border-black shadow-2xl p-3 z-50 w-[360px] flex flex-col print:hidden rounded-xl">
            <TulipVectorEditor 
              data={row.customTulip || defaultCustomTulip} 
              onSave={(newTulip) => { onUpdate(row.id, { customTulip: newTulip, tulipId: 'custom' }); setShowTulipEditor(false); }}
              onCancel={() => setShowTulipEditor(false)}
            />
          </div>
        )}
      </div>

      <div 
        className="w-[40%] flex flex-col bg-white relative group/info" 
        ref={infoRef}
        onPointerMove={handleInfoPointerMove}
        onPointerUp={handleInfoPointerUp}
        onPointerLeave={handleInfoPointerUp}
        onPointerDown={() => setSelectedInfoIconId(null)}
      >
        <textarea
          value={row.notes}
          onChange={(e) => onUpdate(row.id, 'notes', e.target.value)}
          className="w-full h-full resize-none bg-transparent outline-none text-black font-black uppercase text-xl sm:text-2xl leading-tight p-4 focus:bg-gray-50"
          placeholder="NOTAS..."
        />
        {row.lat && row.lon && (
          <div className="absolute bottom-1 right-2 text-xs text-black font-bold font-mono tracking-tighter opacity-80 pointer-events-none">
            N{row.lat.toFixed(5)} W{Math.abs(row.lon).toFixed(5)}
          </div>
        )}

        {infoIcons.map(ic => {
          const isSelected = selectedInfoIconId === ic.id;
          const size = 40 * (ic.scale || 1);
          
          return (
            <div 
              key={ic.id}
              style={{ position: 'absolute', left: `${ic.x}%`, top: `${ic.y}%`, transform: 'translate(-50%, -50%)', width: size, height: size }}
              onPointerDown={(e) => handleInfoPointerDown(e, ic.id)}
              className={`cursor-grab active:cursor-grabbing flex items-center justify-center transition-shadow ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/50' : ''} rounded`}
            >
              {ic.type === 'custom_image' ? (
                <img src={ic.dataUrl} className="w-full h-full object-contain pointer-events-none" />
              ) : (
                <div className="w-full h-full pointer-events-none flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-full h-full overflow-visible">
                    {RenderIcon(ic.type)}
                  </svg>
                </div>
              )}
            </div>
          );
        })}

        {selectedInfoIconId && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white border border-blue-400 shadow-xl rounded px-2 py-1 flex gap-2 items-center z-40 print:hidden">
            <button onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); updateSelectedInfoIconScale(-0.2); }} className="w-8 h-8 bg-gray-100 rounded text-xl font-bold hover:bg-gray-200 flex items-center justify-center">-</button>
            <button onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); updateSelectedInfoIconScale(0.2); }} className="w-8 h-8 bg-gray-100 rounded text-xl font-bold hover:bg-gray-200 flex items-center justify-center">+</button>
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            <button onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); deleteSelectedInfoIcon(); }} className="w-8 h-8 text-red-600 bg-red-50 hover:bg-red-200 rounded flex items-center justify-center"><Trash2 size={16}/></button>
          </div>
        )}

        <button 
          onPointerDown={(e) => { e.stopPropagation(); setShowInfoIconPicker(!showInfoIconPicker); }}
          className="absolute top-2 right-2 opacity-0 group-hover/info:opacity-100 transition-opacity bg-blue-600 text-white p-2 rounded-full shadow hover:bg-blue-700 print:hidden z-20"
          title="Añadir icono a la información"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        {showInfoIconPicker && (
          <div className="absolute top-12 right-2 bg-white border-2 border-black shadow-xl p-2 rounded w-[260px] z-30 flex flex-col gap-2 print:hidden" onPointerDown={e => e.stopPropagation()}>
            <div className="text-[10px] font-bold text-center text-slate-500 uppercase border-b pb-1">Selecciona Icono</div>
            
            <div className="flex gap-1 overflow-x-auto pb-1 custom-scrollbar">
              <button onClick={() => customInfoImgInputRef.current?.click()} className="shrink-0 flex items-center gap-1 h-8 px-2 bg-blue-100 border border-blue-300 rounded hover:bg-blue-200 text-xs font-bold text-blue-800 whitespace-nowrap">
                <ImageIcon size={14}/> Subir Foto
              </button>
              <input type="file" ref={customInfoImgInputRef} onChange={handleInfoCustomImage} accept="image/*" className="hidden" />

              {RALLY_ICONS.map(ic => (
                <button 
                  key={ic.type} onClick={() => handleInfoAddIcon(ic.type)} 
                  className="shrink-0 w-8 h-8 border border-gray-200 rounded hover:bg-gray-100 flex items-center justify-center p-1"
                  title={ic.label}
                >
                  <div className="w-full h-full pointer-events-none flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-full h-full overflow-visible">{ic.icon}</svg>
                  </div>
                </button>
              ))}
            </div>
            
            <button onClick={() => setShowInfoIconPicker(false)} className="w-full mt-1 bg-red-100 text-red-700 text-xs font-bold py-1 rounded">Cerrar</button>
          </div>
        )}
      </div>

      <div className="absolute -right-14 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity print:hidden flex flex-col gap-2">
        <button onClick={() => onInsert(row.id)} className="p-3 bg-blue-600 text-white hover:bg-blue-700 rounded-full shadow-lg" title="Insertar fila debajo"><Plus className="w-5 h-5" /></button>
        <button onClick={() => onDelete(row.id)} className="p-3 bg-red-600 text-white hover:bg-red-700 rounded-full shadow-lg" title="Eliminar"><Trash2 className="w-5 h-5" /></button>
      </div>
    </div>
  );
}