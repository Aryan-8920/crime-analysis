import React, { useEffect, useRef, useState } from 'react';
import cytoscape, { Core, EventObject } from 'cytoscape';
import { useInvestigation } from '../../context/InvestigationContext';
import { Entity, Relationship, EntityType } from '../../types';
import { getMultiHopNeighborhood, findShortestPath } from '../../utils/graphAlgorithms';
import { soundFX } from '../../utils/soundEffects';
import {
  Network,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Search,
  Filter,
  Eye,
  Route,
  Shield,
  X,
  FileText,
  CheckCircle2,
  Users,
  CreditCard,
  Phone,
  Car,
  MapPin,
  Laptop,
  Layers,
  Radio,
  Share2
} from 'lucide-react';

const ENTITY_COLORS: Record<EntityType, string> = {
  Person: '#00f2fe', // vibrant electric cyan
  'Bank Account': '#10b981', // emerald-500
  'Phone Number': '#f59e0b', // amber-500
  Vehicle: '#a855f7', // purple-500
  Location: '#f43f5e', // rose-500
  Device: '#38bdf8', // sky-400
  'IP Address': '#60a5fa', // blue-400
  'Online Account': '#06b6d4', // cyan-500
  Organization: '#8b5cf6', // violet-500
  Transaction: '#14b8a6', // teal-500
  'Evidence Document': '#94a3b8', // slate-400
};

export const NetworkGraphView: React.FC = () => {
  const {
    cases,
    entities,
    relationships,
    evidence,
    activeCaseId,
    setActiveCaseId,
    selectedEntityId,
    setSelectedEntityId,
    selectedRelationshipId,
    setSelectedRelationshipId,
    setActiveTab,
  } = useInvestigation();

  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);

  // Filter & Layout Controls
  const [selectedCase, setSelectedCase] = useState<string>(activeCaseId);
  const [selectedEntityType, setSelectedEntityType] = useState<string>('all');
  const [hopDepth, setHopDepth] = useState<number | null>(null);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [graphLayout, setGraphLayout] = useState<'cose' | 'concentric' | 'breadthfirst' | 'circle' | 'grid'>('cose');

  // Interactive Inspector States
  const [selectedNodeData, setSelectedNodeData] = useState<Entity | null>(null);
  const [selectedEdgeData, setSelectedEdgeData] = useState<Relationship | null>(null);

  // Shortest Path State
  const [pathFinderMode, setPathFinderMode] = useState<boolean>(false);
  const [pathSourceId, setPathSourceId] = useState<string>('');
  const [pathTargetId, setPathTargetId] = useState<string>('');
  const [pathResult, setPathResult] = useState<{ nodeCount: number; edgeCount: number } | null>(null);

  useEffect(() => {
    setSelectedCase(activeCaseId);
  }, [activeCaseId]);

  const caseEntities = entities.filter(
    (e) =>
      e.caseId === selectedCase &&
      (selectedEntityType === 'all' || e.type === selectedEntityType)
  );

  const caseRelationships = relationships.filter((r) => r.caseId === selectedCase);

  // Initialize and update Cytoscape graph
  useEffect(() => {
    if (!containerRef.current) return;

    const elements: cytoscape.ElementDefinition[] = [];

    // Add nodes with tactical styling
    caseEntities.forEach((ent) => {
      elements.push({
        data: {
          id: ent.id,
          label: ent.name,
          type: ent.type,
          color: ENTITY_COLORS[ent.type] || '#94a3b8',
        },
      });
    });

    // Add edges
    caseRelationships.forEach((rel) => {
      const hasSource = caseEntities.some((e) => e.id === rel.sourceEntityId);
      const hasTarget = caseEntities.some((e) => e.id === rel.targetEntityId);

      if (hasSource && hasTarget) {
        elements.push({
          data: {
            id: rel.id,
            source: rel.sourceEntityId,
            target: rel.targetEntityId,
            label: rel.relationshipType.replace(/_/g, ' '),
            relationshipType: rel.relationshipType,
          },
        });
      }
    });

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)',
            label: showLabels ? 'data(label)' : '',
            color: '#f8fafc',
            'font-size': '11px',
            'font-family': 'monospace',
            'text-valign': 'bottom',
            'text-margin-y': 6,
            width: 34,
            height: 34,
            'border-width': 2.5,
            'border-color': '#060d1a',
            'text-background-opacity': 0.85,
            'text-background-color': '#060d1a',
            'text-background-padding': '3px',
            'transition-property': 'background-color, border-color, width, height, opacity',
            'transition-duration': 0.25,
          },
        },
        {
          selector: 'edge',
          style: {
            width: 1.8,
            'line-color': '#1e293b',
            'target-arrow-color': '#334155',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'arrow-scale': 0.85,
            label: showLabels ? 'data(label)' : '',
            'font-size': '8.5px',
            'font-family': 'monospace',
            color: '#94a3b8',
            'text-rotation': 'autorotate',
            'text-background-opacity': 0.9,
            'text-background-color': '#050a14',
            'text-background-padding': '2px',
          },
        },
        {
          selector: 'node:selected',
          style: {
            'border-width': 4.5,
            'border-color': '#00f2fe',
            width: 44,
            height: 44,
          },
        },
        {
          selector: 'edge:selected',
          style: {
            width: 3.5,
            'line-color': '#00f2fe',
            'target-arrow-color': '#00f2fe',
          },
        },
        {
          selector: '.dimmed',
          style: {
            opacity: 0.12,
          },
        },
        {
          selector: '.highlighted',
          style: {
            'border-color': '#00f2fe',
            'border-width': 3.5,
            'line-color': '#00f2fe',
            'target-arrow-color': '#00f2fe',
            width: 3,
            opacity: 1,
          },
        },
        {
          selector: '.path-highlighted',
          style: {
            'border-color': '#10b981',
            'border-width': 4,
            'line-color': '#10b981',
            'target-arrow-color': '#10b981',
            width: 3.8,
            opacity: 1,
          },
        },
      ],
      layout: {
        name: graphLayout,
        animate: true,
        animationDuration: 500,
        nodeDimensionsIncludeLabels: true,
        padding: 50,
      },
    });

    cyRef.current = cy;

    cy.on('tap', 'node', (evt: EventObject) => {
      soundFX.playClick();
      const node = evt.target;
      const ent = entities.find((e) => e.id === node.id());
      if (ent) {
        setSelectedNodeData(ent);
        setSelectedEdgeData(null);
        setSelectedEntityId(ent.id);

        if (pathFinderMode && !pathSourceId) {
          setPathSourceId(ent.id);
        } else if (pathFinderMode && pathSourceId && !pathTargetId) {
          setPathTargetId(ent.id);
        }
      }
    });

    cy.on('tap', 'edge', (evt: EventObject) => {
      soundFX.playClick();
      const edge = evt.target;
      const rel = relationships.find((r) => r.id === edge.id());
      if (rel) {
        setSelectedEdgeData(rel);
        setSelectedNodeData(null);
        setSelectedRelationshipId(rel.id);
      }
    });

    cy.on('tap', (evt: EventObject) => {
      if (evt.target === cy) {
        setSelectedNodeData(null);
        setSelectedEdgeData(null);
      }
    });

    if (selectedEntityId) {
      const node = cy.$id(selectedEntityId);
      if (node.length > 0) {
        node.select();
        const ent = entities.find((e) => e.id === selectedEntityId);
        if (ent) setSelectedNodeData(ent);
      }
    }

    return () => {
      cy.destroy();
      cyRef.current = null;
    };
  }, [selectedCase, selectedEntityType, showLabels, graphLayout]);

  // Apply hop traversal
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    if (hopDepth === null || !selectedEntityId) {
      cy.elements().removeClass('dimmed highlighted path-highlighted');
      return;
    }

    const result = getMultiHopNeighborhood(selectedEntityId, caseRelationships, hopDepth);

    cy.elements().addClass('dimmed');
    result.nodeIds.forEach((nId) => {
      cy.$id(nId).removeClass('dimmed').addClass('highlighted');
    });
    result.edgeIds.forEach((eId) => {
      cy.$id(eId).removeClass('dimmed').addClass('highlighted');
    });
  }, [hopDepth, selectedEntityId, caseRelationships]);

  const handleFindPath = () => {
    const cy = cyRef.current;
    if (!cy || !pathSourceId || !pathTargetId) return;

    soundFX.playScan();
    const path = findShortestPath(pathSourceId, pathTargetId, caseRelationships);
    if (!path) {
      setPathResult(null);
      alert('No recorded path found between selected entities in current case evidence.');
      return;
    }

    cy.elements().addClass('dimmed');
    path.pathNodeIds.forEach((nId) => {
      cy.$id(nId).removeClass('dimmed').addClass('path-highlighted');
    });
    path.pathEdgeIds.forEach((eId) => {
      cy.$id(eId).removeClass('dimmed').addClass('path-highlighted');
    });

    setPathResult({
      nodeCount: path.pathNodeIds.length,
      edgeCount: path.pathEdgeIds.length,
    });
    soundFX.playSuccess();
  };

  const handleClearPath = () => {
    soundFX.playClick();
    const cy = cyRef.current;
    if (cy) {
      cy.elements().removeClass('dimmed highlighted path-highlighted');
    }
    setPathFinderMode(false);
    setPathSourceId('');
    setPathTargetId('');
    setPathResult(null);
    setHopDepth(null);
  };

  const handleZoomIn = () => {
    soundFX.playClick();
    cyRef.current?.zoom(cyRef.current.zoom() * 1.25);
  };

  const handleZoomOut = () => {
    soundFX.playClick();
    cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  };

  const handleFit = () => {
    soundFX.playClick();
    cyRef.current?.fit();
  };

  const handleResetLayout = () => {
    soundFX.playClick();
    cyRef.current?.layout({ name: graphLayout, animate: true, animationDuration: 600 }).run();
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header & Tactical Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
            <span>Interactive Network Analysis Engine</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Spatial topology visualization connecting physical persons, banking nodes, vehicle assets, and cellular relays with multi-hop BFS graph traversal.
          </p>
        </div>

        {/* Multi-Hop Depth Controller Bar */}
        <div className="flex items-center gap-1.5 bg-[#090f19] border border-cyan-900/60 p-1.5 rounded-lg text-xs self-start sm:self-auto shadow-md">
          <span className="text-[10px] uppercase font-bold text-cyan-400 px-2 font-mono">
            Hop Range:
          </span>
          {[1, 2, 3, 4].map((hop) => (
            <button
              key={hop}
              onClick={() => {
                soundFX.playClick();
                if (!selectedEntityId) {
                  const firstPerson = caseEntities.find((e) => e.type === 'Person') || caseEntities[0];
                  if (firstPerson) setSelectedEntityId(firstPerson.id);
                }
                setHopDepth(hop === hopDepth ? null : hop);
              }}
              className={`px-2.5 py-1 rounded text-xs font-bold font-mono transition-all cursor-pointer ${
                hopDepth === hop
                  ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-md shadow-cyan-950/80 ring-1 ring-cyan-300/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {hop} Hop{hop > 1 ? 's' : ''}
            </button>
          ))}
          {hopDepth !== null && (
            <button
              onClick={() => {
                soundFX.playClick();
                setHopDepth(null);
              }}
              className="px-2 py-1 text-slate-500 hover:text-cyan-300 text-[10px] font-mono cursor-pointer"
              title="Reset hop filter"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="bg-[#090f19]/95 border border-slate-800/90 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg backdrop-blur-md">
        {/* Left Toolbar Items: Case, Entity Type & Layout Algorithm Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Case Selector */}
          <select
            value={selectedCase}
            onChange={(e) => {
              soundFX.playClick();
              setSelectedCase(e.target.value);
              setActiveCaseId(e.target.value);
            }}
            className="bg-[#050a14] border border-cyan-900/60 text-slate-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-400 font-mono font-bold"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} - {c.title}
              </option>
            ))}
          </select>

          {/* Entity Type Filter */}
          <select
            value={selectedEntityType}
            onChange={(e) => {
              soundFX.playClick();
              setSelectedEntityType(e.target.value);
            }}
            className="bg-[#050a14] border border-slate-800 text-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Entity Classes</option>
            <option value="Person">Persons Only</option>
            <option value="Bank Account">Bank Accounts</option>
            <option value="Phone Number">Phone Numbers</option>
            <option value="Vehicle">Vehicles</option>
            <option value="Device">Devices / IP</option>
          </select>

          {/* Layout Switcher */}
          <div className="flex items-center gap-1 bg-[#050a14] border border-slate-800 px-2 py-1 rounded">
            <span className="text-slate-500 text-[10px] font-mono uppercase">Layout:</span>
            <select
              value={graphLayout}
              onChange={(e) => {
                soundFX.playClick();
                setGraphLayout(e.target.value as 'cose' | 'concentric' | 'breadthfirst' | 'circle' | 'grid');
              }}
              className="bg-transparent text-cyan-300 text-xs focus:outline-none font-mono cursor-pointer"
            >
              <option value="cose">CoSE (Physics Force)</option>
              <option value="concentric">Concentric (Radar)</option>
              <option value="breadthfirst">Breadthfirst (Hierarchy)</option>
              <option value="circle">Circular (Orbital)</option>
              <option value="grid">Grid (Matrix)</option>
            </select>
          </div>

          {/* Path Finder Toggle */}
          <button
            onClick={() => {
              soundFX.playClick();
              setPathFinderMode(!pathFinderMode);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold border transition-all cursor-pointer ${
              pathFinderMode
                ? 'bg-emerald-950 text-emerald-300 border-emerald-600 shadow-md shadow-emerald-950/60'
                : 'bg-[#050a14] text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Route className="w-3.5 h-3.5 text-emerald-400" />
            <span>Find Shortest Path</span>
          </button>
        </div>

        {/* Right Toolbar Items: Graph Controls */}
        <div className="flex items-center gap-1 bg-[#050a14] border border-slate-800 p-0.5 rounded">
          <button
            onClick={handleZoomIn}
            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleFit}
            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="Fit to Viewport"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetLayout}
            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="Recalculate Physics Layout"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              setShowLabels(!showLabels);
            }}
            className={`px-2 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
              showLabels ? 'text-cyan-400 font-bold bg-cyan-950/60' : 'text-slate-500'
            }`}
          >
            Labels
          </button>
        </div>
      </div>

      {/* Path Finder Inputs Bar (if enabled) */}
      {pathFinderMode && (
        <div className="bg-[#090f19] border border-emerald-800/80 rounded-xl p-3 flex flex-wrap items-center gap-3 text-xs shadow-lg animate-in fade-in">
          <span className="font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
            <Route className="w-4 h-4 text-emerald-400" />
            Shortest Path Traversal:
          </span>

          <div className="flex items-center gap-2">
            <label className="text-slate-400">Origin:</label>
            <select
              value={pathSourceId}
              onChange={(e) => setPathSourceId(e.target.value)}
              className="bg-[#050a14] border border-slate-800 text-slate-200 rounded px-2 py-1 text-xs font-mono"
            >
              <option value="">Select Origin Node</option>
              {caseEntities.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.id} - {e.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-slate-400">Destination:</label>
            <select
              value={pathTargetId}
              onChange={(e) => setPathTargetId(e.target.value)}
              className="bg-[#050a14] border border-slate-800 text-slate-200 rounded px-2 py-1 text-xs font-mono"
            >
              <option value="">Select Destination Node</option>
              {caseEntities.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.id} - {e.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleFindPath}
            disabled={!pathSourceId || !pathTargetId}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded font-bold font-mono transition-colors cursor-pointer shadow-md"
          >
            Trace Path
          </button>

          <button
            onClick={handleClearPath}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors cursor-pointer"
          >
            Clear
          </button>

          {pathResult && (
            <span className="text-emerald-300 font-mono text-[11px] font-bold">
              &bull; Connected Path Isolated: {pathResult.nodeCount} nodes across {pathResult.edgeCount} hops
            </span>
          )}
        </div>
      )}

      {/* Main Canvas + Detail Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Cytoscape Canvas Container */}
        <div className="lg:col-span-3 bg-[#030712] border border-cyan-950/80 rounded-xl relative min-h-[580px] overflow-hidden shadow-2xl">
          <div ref={containerRef} className="w-full h-[580px]" />

          {/* Floating High-Tech Radar Overlay */}
          <div className="absolute top-3 left-3 bg-[#070d18]/90 backdrop-blur-md border border-cyan-900/60 rounded-lg px-2.5 py-1.5 text-[10px] font-mono text-cyan-400/90 flex items-center gap-2 shadow-lg pointer-events-none">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>TOPOLOGY RADAR // {caseEntities.length} NODES · {caseRelationships.length} EDGES</span>
          </div>

          {/* Canvas Floating Legend */}
          <div className="absolute bottom-3 left-3 bg-[#070d18]/95 backdrop-blur-md border border-slate-800 rounded-lg p-2.5 text-[10px] space-y-1.5 shadow-2xl pointer-events-none">
            <div className="font-bold text-cyan-400 uppercase tracking-wider text-[9px] font-mono">
              Entity Classification
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]"></span>
                <span>Person</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]"></span>
                <span>Bank Account</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]"></span>
                <span>Phone Number</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.8)]"></span>
                <span>Vehicle</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.8)]"></span>
                <span>IP / Device</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.8)]"></span>
                <span>Location</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Inspector Panel */}
        <div className="bg-[#090f19] border border-cyan-900/60 rounded-xl p-4 shadow-xl space-y-4 text-xs">
          {selectedNodeData ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: ENTITY_COLORS[selectedNodeData.type] }}
                  ></div>
                  <span className="font-mono text-cyan-400 font-bold">{selectedNodeData.id}</span>
                </div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold font-mono">
                  {selectedNodeData.type}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{selectedNodeData.name}</h3>
                <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  Docket: <span className="text-cyan-300">{selectedNodeData.caseId}</span>
                </div>
              </div>

              <div className="bg-[#050a14] p-2.5 rounded-lg border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Confidence Metric:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {Math.round(selectedNodeData.confidence * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Evidentiary Status:</span>
                  <span className="text-slate-200 font-semibold">{selectedNodeData.reviewStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Source Citations:</span>
                  <span className="font-mono text-cyan-400 font-bold">{selectedNodeData.sourceEvidenceIds.length} records</span>
                </div>
              </div>

              {selectedNodeData.notes && (
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1 font-mono">
                    Investigative Context
                  </span>
                  <p className="text-slate-300 leading-snug bg-[#050a14] p-2.5 rounded-lg border border-slate-800 text-[11px]">
                    {selectedNodeData.notes}
                  </p>
                </div>
              )}

              {/* Hop exploration actions */}
              <div className="pt-2 space-y-1.5">
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedEntityId(selectedNodeData.id);
                    setHopDepth(2);
                  }}
                  className="w-full py-1.5 bg-gradient-to-r from-cyan-900 to-cyan-800 hover:from-cyan-800 hover:to-cyan-700 text-cyan-100 border border-cyan-600/60 rounded text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  Isolate 2-Hop Perimeter
                </button>
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setPathFinderMode(true);
                    setPathSourceId(selectedNodeData.id);
                  }}
                  className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs transition-colors cursor-pointer"
                >
                  Set as Path Origin
                </button>
              </div>
            </div>
          ) : selectedEdgeData ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-[10px] text-cyan-400 font-mono font-bold">CORRELATION LINK</span>
                <span className="text-[10px] text-slate-400 font-semibold font-mono">{selectedEdgeData.id}</span>
              </div>

              <div>
                <div className="text-[11px] text-purple-400 font-mono font-bold">
                  {selectedEdgeData.relationshipType}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-white font-mono">
                  <span>{selectedEdgeData.sourceEntityId}</span>
                  <span className="text-cyan-400">&rarr;</span>
                  <span>{selectedEdgeData.targetEntityId}</span>
                </div>
              </div>

              <div className="bg-[#050a14] p-2.5 rounded-lg border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Confidence:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {Math.round(selectedEdgeData.confidence * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="text-slate-200 font-medium">{selectedEdgeData.reviewStatus}</span>
                </div>
                {selectedEdgeData.timestamp && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Recorded:</span>
                    <span className="text-slate-300 text-[10px] font-mono">
                      {new Date(selectedEdgeData.timestamp).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {selectedEdgeData.excerpt && (
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1 font-mono">
                    Evidentiary Transcript Excerpt
                  </span>
                  <p className="text-slate-300 italic bg-[#050a14] p-2.5 rounded-lg border border-slate-800 text-[11px] leading-relaxed">
                    "{selectedEdgeData.excerpt}"
                  </p>
                </div>
              )}

              {selectedEdgeData.sourceEvidenceIds.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 font-mono">
                    Supporting Case Dossier
                  </span>
                  <div className="bg-[#050a14] p-2 rounded-lg border border-slate-800 text-cyan-400 font-mono text-[11px] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{selectedEdgeData.sourceEvidenceIds[0]}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-14 text-center text-slate-500 space-y-2">
              <Network className="w-9 h-9 text-cyan-500/40 mx-auto animate-pulse" />
              <div className="text-xs text-slate-300 font-bold font-mono">NODE RADAR READY</div>
              <p className="text-[11px] text-slate-500 leading-snug px-3">
                Click on any node to isolate entity attributes and explore hop neighborhoods, or select an edge to inspect supporting evidence.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* High-Grade Classification Bottom Bar */}
      <div className="bg-[#050a14] border border-cyan-950/70 rounded-lg p-2.5 text-xs text-slate-400 flex items-center justify-between gap-3 font-mono">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-slate-300">
            RECORD CLASSIFICATION // LAW ENFORCEMENT SENSITIVE · EVIDENTIARY AUDIT TRAIL LOGGED
          </span>
        </div>
        <span className="hidden sm:inline text-cyan-400/80 text-[11px]">
          ACTIVE ENGINE: CYTOSCAPE WEBKIT
        </span>
      </div>
    </div>
  );
};
