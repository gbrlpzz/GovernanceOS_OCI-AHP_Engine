
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { 
  Step, 
  OCIState, 
  INITIAL_STATE, 
  AhpResult
} from './types';
import { calculateAHP } from './services/ahp';
import { generateCauses, generateInterventions } from './services/gemini';
import { Button } from './components/Button';
import { ComparisonSlider } from './components/ComparisonSlider';
import { ConsistencyBadge } from './components/ConsistencyBadge';
import { NetworkGraph } from './components/NetworkGraph';
import { Methodology } from './components/Methodology';

// Helper for combinatorics
const getPairs = <T extends { id: string }>(items: T[]) => {
  const pairs: { id: string, a: T, b: T }[] = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      pairs.push({
        id: `${items[i].id}-${items[j].id}`,
        a: items[i],
        b: items[j]
      });
    }
  }
  return pairs;
};

// Standardized Empty State Component
const EmptyState: React.FC<{ label: string }> = ({ label }) => (
    <div className="h-64 w-full bg-stripe-pattern border-2 border-swiss-border flex items-center justify-center select-none">
        <span className="bg-white px-6 py-3 font-mono text-xs font-bold text-swiss-muted uppercase tracking-widest border-2 border-swiss-border shadow-sm">
            {label}
        </span>
    </div>
);

// Custom Tick Component to fix TS overload errors
const CustomYAxisTick = (props: any) => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text 
        x={-10} 
        y={0} 
        dy={4} 
        textAnchor="end" 
        fill="#000000" 
        fontSize={11} 
        fontFamily="JetBrains Mono" 
        fontWeight={700} 
        style={{textTransform: 'uppercase'}}
      >
        {payload.value}
      </text>
    </g>
  );
};

// Extracted Component to fix Hook Rules (Error #300)
const DefinitionView: React.FC<{
    state: OCIState;
    setState: React.Dispatch<React.SetStateAction<OCIState>>;
    onNext: () => void;
    isGenerating: boolean;
    handleAiCauses: () => void;
    handleAiInterventions: () => void;
    addCause: (label: string) => void;
    addIntervention: (label: string, targets: string[]) => void;
}> = ({ state, setState, onNext, isGenerating, handleAiCauses, handleAiInterventions, addCause, addIntervention }) => {
    const [tempCause, setTempCause] = useState('');
    const [tempInt, setTempInt] = useState('');
    const [tempTargets, setTempTargets] = useState<string[]>([]);

    return (
      <div className="space-y-24 animate-in fade-in duration-500 pb-32">
        {/* Outcome Section */}
        <section aria-labelledby="outcome-title" className="grid grid-cols-1 lg:grid-cols-12 gap-16 border-t-4 border-swiss-black pt-12">
          <div className="lg:col-span-4">
            <h2 id="outcome-title" className="text-6xl font-black text-swiss-black tracking-tighter mb-8">
                <span className="text-swiss-blue mr-4">//</span>01
                <br />OUTCOME
            </h2>
            <p className="text-swiss-black font-mono text-xs uppercase tracking-widest leading-relaxed border-l-2 border-swiss-black pl-4">
                Define the singular strategic objective for this prioritization session.
            </p>
          </div>
          <div className="lg:col-span-8">
             <label htmlFor="outcome-input" className="block text-[10px] font-mono font-bold uppercase tracking-widest mb-3 text-swiss-black">Primary Objective</label>
             <div className="relative group">
                <input 
                  id="outcome-input"
                  className="w-full bg-white border-2 border-swiss-border p-6 text-3xl md:text-5xl font-black text-swiss-black placeholder-swiss-border/50 focus:border-swiss-black outline-none transition-all font-sans tracking-tight leading-none"
                  placeholder="ENTER STRATEGIC GOAL..."
                  value={state.outcome}
                  onChange={(e) => setState(s => ({ ...s, outcome: e.target.value }))}
                  autoComplete="off"
                />
                <div className="absolute bottom-0 right-0 p-2 pointer-events-none">
                    <div className="w-4 h-4 border-r-2 border-b-2 border-swiss-black"></div>
                </div>
             </div>
          </div>
        </section>

        {/* Causes Section */}
        <section aria-labelledby="causes-title" className="grid grid-cols-1 lg:grid-cols-12 gap-16 border-t-4 border-swiss-black pt-12">
          <div className="lg:col-span-4 space-y-8">
            <h2 id="causes-title" className="text-6xl font-black text-swiss-black tracking-tighter mb-2">
                <span className="text-swiss-blue mr-4">//</span>02
                <br />DRIVERS
            </h2>
            <p className="text-swiss-black font-mono text-xs uppercase tracking-widest leading-relaxed border-l-2 border-swiss-black pl-4">
                Identify structural factors and root causes influencing the outcome.
            </p>
            <Button variant="secondary" onClick={handleAiCauses} isLoading={isGenerating} disabled={!state.outcome} className="w-full justify-between group">
               <span>AI DISCOVERY</span>
               <span className="bg-swiss-black text-white px-2 font-mono group-hover:bg-swiss-blue">+</span>
            </Button>
          </div>
          <div className="lg:col-span-8 space-y-8">
             <div className="flex gap-4 items-end">
                <div className="flex-1">
                    <label htmlFor="cause-input" className="block text-[10px] font-mono font-bold uppercase tracking-widest mb-2 text-swiss-black">New Driver</label>
                    <input 
                    id="cause-input"
                    className="w-full h-16 bg-white border-2 border-swiss-border px-6 text-xl font-bold text-swiss-black focus:border-swiss-black outline-none transition-colors font-sans tracking-tight"
                    placeholder="ENTER DRIVER LABEL..."
                    value={tempCause}
                    onChange={e => setTempCause(e.target.value)}
                    onKeyDown={e => { if(e.key === 'Enter') { addCause(tempCause); setTempCause(''); }}}
                    />
                </div>
                <Button 
                  onClick={() => { addCause(tempCause); setTempCause(''); }} 
                  disabled={!tempCause}
                  type="button"
                  className="h-16 w-32"
                >
                  <span className="hidden md:inline">ADD</span>
                  <span className="md:hidden">+</span>
                </Button>
             </div>

             <div className="space-y-4">
               {state.causes.map((c, i) => (
                 <div key={c.id} className="bg-white p-6 gap-6 flex justify-between items-center group hover:border-swiss-black border-2 border-swiss-border hover:shadow-hover transition-all duration-200 min-h-[88px]">
                   <div className="flex items-baseline gap-6">
                      <span className="font-mono text-xs font-bold text-swiss-black/40">{(i+1).toString().padStart(2, '0')}</span>
                      <span className="font-bold text-xl text-swiss-black tracking-tight">{c.label}</span>
                   </div>
                   <Button
                    variant="danger"
                    className="h-8 px-4 text-[10px]"
                    onClick={() => setState(s => ({...s, causes: s.causes.filter(x => x.id !== c.id)}))}
                    aria-label={`Remove ${c.label}`}
                    type="button"
                   >
                     REMOVE
                   </Button>
                 </div>
               ))}
               {state.causes.length === 0 && <EmptyState label="No Drivers Logged" />}
             </div>
          </div>
        </section>

        {/* Interventions Section */}
        <section aria-labelledby="int-title" className="grid grid-cols-1 lg:grid-cols-12 gap-16 border-t-4 border-swiss-black pt-12">
          <div className="lg:col-span-4 space-y-8">
            <h2 id="int-title" className="text-6xl font-black text-swiss-black tracking-tighter mb-2">
                <span className="text-swiss-blue mr-4">//</span>03
                <br />ACTIONS
            </h2>
            <p className="text-swiss-black font-mono text-xs uppercase tracking-widest leading-relaxed border-l-2 border-swiss-black pl-4">
                Propose interventions and map them to the drivers they address.
            </p>
            <Button variant="secondary" onClick={handleAiInterventions} isLoading={isGenerating} disabled={state.causes.length === 0} className="w-full justify-between group">
               <span>AI GENERATE</span>
               <span className="bg-swiss-black text-white px-2 font-mono group-hover:bg-swiss-blue">+</span>
            </Button>
          </div>
          
          <div className="lg:col-span-8 space-y-12">
             <div className="bg-swiss-gray/10 border-2 border-swiss-border p-8 space-y-8 relative">
                <div className="absolute top-0 left-0 bg-swiss-black text-white px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-widest transform -translate-y-1/2 ml-4 shadow-sharp">Entry Terminal</div>
                
                <div>
                  <label htmlFor="int-name" className="block text-[10px] font-bold font-mono text-swiss-black mb-3 uppercase tracking-widest">Intervention Label</label>
                  <input 
                    id="int-name"
                    className="w-full h-16 bg-white border-2 border-swiss-border px-6 text-swiss-black focus:border-swiss-black outline-none font-bold text-xl transition-colors tracking-tight font-sans"
                    placeholder="e.g. Public Transit Expansion"
                    value={tempInt}
                    onChange={e => setTempInt(e.target.value)}
                  />
                </div>
                <div>
                  <span className="block text-[10px] font-bold font-mono text-swiss-black mb-3 uppercase tracking-widest">Target Drivers</span>
                  <div className="flex flex-wrap gap-3" role="group" aria-label="Select target causes">
                      {state.causes.map(c => (
                          <button 
                              key={c.id}
                              type="button"
                              onClick={() => {
                                  setTempTargets(prev => prev.includes(c.id) ? prev.filter(id => id !== c.id) : [...prev, c.id]);
                              }}
                              aria-pressed={tempTargets.includes(c.id)}
                              className={`
                                px-4 py-3 text-[10px] font-mono uppercase tracking-widest border-2 transition-all duration-200
                                ${tempTargets.includes(c.id) 
                                    ? 'bg-swiss-black text-swiss-white border-swiss-black font-bold shadow-sharp -translate-y-[2px]' 
                                    : 'bg-white border-swiss-border text-swiss-muted hover:border-swiss-black hover:text-swiss-black hover:shadow-hover focus-visible:border-swiss-black'
                                }
                              `}
                          >
                              {c.label}
                          </button>
                      ))}
                      {state.causes.length === 0 && <span className="text-swiss-muted font-mono text-xs italic px-2">Define drivers first.</span>}
                  </div>
                </div>
                <Button 
                  variant="primary" 
                  type="button"
                  disabled={!tempInt || tempTargets.length === 0}
                  onClick={() => { addIntervention(tempInt, tempTargets); setTempInt(''); setTempTargets([]); }}
                  className="w-full h-16"
                >
                  ADD INTERVENTION
                </Button>
             </div>

             <div className="space-y-4">
                {state.interventions.map((i, idx) => (
                  <div key={i.id} className="flex bg-white border-2 border-swiss-border hover:border-swiss-black hover:shadow-hover transition-all p-6 gap-6 group items-center min-h-[88px]">
                    <div className="font-mono text-lg font-bold text-swiss-black/20">{(idx+1).toString().padStart(2, '0')}</div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="font-bold text-xl text-swiss-black tracking-tight leading-tight">{i.label}</h4>
                            <Button 
                                variant="danger"
                                className="h-8 px-4 text-[10px]"
                                onClick={() => setState(s => ({...s, interventions: s.interventions.filter(x => x.id !== i.id)}))}
                                aria-label={`Remove ${i.label}`}
                                type="button"
                            >
                                REMOVE
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {i.targetCauseIds.map(tid => (
                                <span key={tid} className="text-[9px] font-mono font-bold uppercase px-2 py-1 border border-swiss-border bg-swiss-gray/30 text-swiss-black">
                                    {state.causes.find(c => c.id === tid)?.label}
                                </span>
                            ))}
                        </div>
                    </div>
                  </div>
                ))}
                 {state.interventions.length === 0 && <EmptyState label="No Actions Logged" />}
             </div>
          </div>
        </section>

        {/* Live Visualization */}
        {state.causes.length > 0 && (
             <section className="border-t-4 border-swiss-black pt-12">
                <div className="flex justify-between items-end mb-8">
                    <h2 className="text-sm font-mono font-bold text-swiss-black uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 bg-swiss-blue"></span>
                        System Architecture
                    </h2>
                </div>
                <NetworkGraph 
                    outcome={state.outcome}
                    causes={state.causes}
                    interventions={state.interventions}
                    className=""
                />
             </section>
        )}

        <div className="flex justify-end pt-20 border-t-2 border-swiss-border">
            <Button 
                disabled={state.causes.length < 1 || state.interventions.length < 1} 
                onClick={onNext}
                type="button"
                className="w-full md:w-auto text-xl px-16 py-8"
            >
                START ANALYSIS
            </Button>
        </div>
      </div>
    );
};

type ViewState = 'TOOL' | 'METHODOLOGY';

function App() {
  const [view, setView] = useState<ViewState>('TOOL');
  const [state, setState] = useState<OCIState>(INITIAL_STATE);
  const [currentStep, setCurrentStep] = useState<Step>(Step.DEFINE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMethodologyHint, setShowMethodologyHint] = useState(false);

  // Show hint once on mount
  useEffect(() => {
     const timer = setTimeout(() => setShowMethodologyHint(true), 1500);
     return () => clearTimeout(timer);
  }, []);

  // --- Actions ---

  const addCause = (label: string) => {
    if (!label.trim()) return;
    setState(s => ({
      ...s,
      causes: [...s.causes, { id: uuidv4(), label }]
    }));
  };

  const addIntervention = (label: string, targetIds: string[]) => {
    if (!label.trim()) return;
    setState(s => ({
      ...s,
      interventions: [...s.interventions, { id: uuidv4(), label, targetCauseIds: targetIds }]
    }));
  };

  const updateComparison = (
    type: 'causes' | 'eff' | 'feas',
    pairId: string,
    value: number
  ) => {
    setState(s => ({
      ...s,
      [type === 'causes' ? 'causeComparisons' : type === 'eff' ? 'effComparisons' : 'feasComparisons']: {
        ...s[type === 'causes' ? 'causeComparisons' : type === 'eff' ? 'effComparisons' : 'feasComparisons'],
        [pairId]: value
      }
    }));
  };

  // --- AI Helpers ---
  const handleAiCauses = async () => {
    if (!state.outcome) return;
    setIsGenerating(true);
    const suggestions = await generateCauses(state.outcome);
    const newCauses = suggestions.map(label => ({ id: uuidv4(), label }));
    setState(s => ({ ...s, causes: [...s.causes, ...newCauses] }));
    setIsGenerating(false);
  };

  const handleAiInterventions = async () => {
    if (state.causes.length === 0) return;
    setIsGenerating(true);
    const rawCauses = state.causes.map(c => c.label);
    const suggestions = await generateInterventions(state.outcome, rawCauses);
    
    const newInterventions = suggestions.map(s => {
       const targetIds = s.targets.map(t => state.causes.find(c => c.label.toLowerCase() === t.toLowerCase())?.id).filter(Boolean) as string[];
       return { id: uuidv4(), label: s.label, targetCauseIds: targetIds };
    });

    setState(s => ({ ...s, interventions: [...s.interventions, ...newInterventions] }));
    setIsGenerating(false);
  };

  // --- AHP Calculations ---
  const causeResults = useMemo(() => 
    calculateAHP(state.causes, state.causeComparisons), 
  [state.causes, state.causeComparisons]);

  const effResults = useMemo(() => 
    calculateAHP(state.interventions, state.effComparisons), 
  [state.interventions, state.effComparisons]);

  const feasResults = useMemo(() => 
    calculateAHP(state.interventions, state.feasComparisons), 
  [state.interventions, state.feasComparisons]);

  // --- Final Scoring ---
  const finalScores = useMemo(() => {
    return state.interventions.map(intervention => {
      const coverage = intervention.targetCauseIds.reduce((sum, causeId) => {
        return sum + (causeResults.weights[causeId] || 0);
      }, 0);

      const effW = effResults.weights[intervention.id] || 0;
      const feasW = feasResults.weights[intervention.id] || 0;
      const baseScore = coverage * effW * feasW;

      return {
        ...intervention,
        coverage,
        effW,
        feasW,
        baseScore,
      };
    }).sort((a, b) => b.baseScore - a.baseScore);
  }, [state.interventions, causeResults, effResults, feasResults]);

  const maxScore = Math.max(...finalScores.map(s => s.baseScore), 0.00001);

  const interventionScoreMap = useMemo(() => {
    const map: Record<string, number> = {};
    finalScores.forEach(fs => {
        map[fs.id] = fs.baseScore / maxScore; 
    });
    return map;
  }, [finalScores, maxScore]);

  const handleExportJson = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "oci_protocol_report.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
  };

  // --- Render Functions ---
  // renderDefinitionStep logic moved to DefinitionView component

  const renderComparisonStep = (
    title: string, 
    subtitle: string,
    items: {id: string, label: string}[], 
    comparisons: Record<string, number>,
    type: 'causes' | 'eff' | 'feas',
    nextStep: Step,
    prevStep: Step
  ) => {
    const pairs = getPairs(items);
    
    return (
      <div className="space-y-16 animate-in slide-in-from-right-10 duration-500 pb-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-swiss-black pb-8 gap-8">
            <div className="space-y-4">
                <h2 className="text-6xl md:text-8xl font-black text-swiss-black tracking-tighter leading-none">{title}</h2>
                <p className="text-swiss-black font-mono text-sm max-w-xl uppercase tracking-wide border-l-4 border-swiss-black pl-6 py-1 leading-relaxed">
                    {subtitle}
                </p>
            </div>
            {/* Badge moved to sticky container */}
        </div>

        {pairs.length > 0 ? (
            <div className="grid gap-16">
                {pairs.map(pair => (
                    <div key={pair.id} className="space-y-2">
                        <ComparisonSlider
                            leftLabel={pair.a.label}
                            rightLabel={pair.b.label}
                            value={comparisons[pair.id] || 0}
                            onChange={(val) => updateComparison(type, pair.id, val)}
                        />
                    </div>
                ))}
            </div>
        ) : (
            <div className="py-20 border-2 border-swiss-border bg-stripe-pattern flex flex-col items-center justify-center gap-4 shadow-inner">
                <div className="font-mono font-bold text-swiss-black text-lg bg-white px-4 py-2 border-2 border-swiss-black shadow-sharp">SINGLE ITEM DETECTED</div>
                <div className="text-swiss-black font-mono text-sm max-w-md text-center bg-white p-2">
                    Weight is automatically assigned as 100%. No pairwise comparison needed.
                </div>
            </div>
        )}

        <div className="flex justify-between items-center pt-16 border-t-2 border-swiss-border">
             <Button variant="ghost" onClick={() => setCurrentStep(prevStep)} type="button">&larr; BACK</Button>
             <div className="flex flex-col items-end gap-2">
                <Button onClick={() => setCurrentStep(nextStep)} type="button" className="text-lg px-12 py-6">PROCEED &rarr;</Button>
             </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const data = finalScores.map(item => ({
        name: item.label,
        score: (item.baseScore / maxScore) * 100, 
        raw: item.baseScore,
        coverage: item.coverage,
        eff: item.effW,
        feas: item.feasW
    }));

    const winner = finalScores.length > 0 ? finalScores[0] : null;

    return (
      <div className="space-y-16 animate-in zoom-in-95 duration-500 pb-24">
        
        <div className="border-b-4 border-swiss-black pb-10 no-print">
            <div className="flex flex-col md:flex-row justify-between md:items-end mb-6 gap-6">
                <div>
                    <span className="block text-xs font-mono font-bold uppercase tracking-widest text-swiss-muted mb-2">Strategic Outcome</span>
                    <h2 className="text-4xl md:text-6xl font-black text-swiss-black tracking-tighter leading-none">{state.outcome}</h2>
                </div>
                <div className="flex gap-4">
                    <Button variant="secondary" onClick={handleExportJson} type="button" className="hidden md:flex">EXPORT JSON</Button>
                    <Button variant="primary" onClick={(e) => { e.preventDefault(); window.print(); }} type="button">PRINT REPORT</Button>
                </div>
            </div>
        </div>

        {/* Executive Summary / Winner Ticket */}
        {winner && (
            <div className="border-2 border-swiss-black bg-swiss-black text-white p-8 md:p-12 shadow-sharp relative overflow-hidden print:shadow-none print:border-black">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                    <div className="text-9xl font-black tracking-tighter">01</div>
                </div>
                <div className="relative z-10">
                    <span className="bg-swiss-blue text-white px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest mb-6 inline-block print:bg-white print:text-black print:border print:border-black">Highest Priority Intervention</span>
                    <h3 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">{winner.label}</h3>
                    <div className="grid grid-cols-3 gap-8 max-w-xl mt-8 border-t border-white/20 pt-6">
                         <div>
                             <div className="text-[10px] font-mono uppercase opacity-60 mb-1">Score</div>
                             <div className="text-3xl font-mono font-bold">{(winner.baseScore / maxScore * 100).toFixed(1)}</div>
                         </div>
                         <div>
                             <div className="text-[10px] font-mono uppercase opacity-60 mb-1">Impact</div>
                             <div className="text-3xl font-mono font-bold">{(winner.effW * 100).toFixed(0)}%</div>
                         </div>
                         <div>
                             <div className="text-[10px] font-mono uppercase opacity-60 mb-1">Feasibility</div>
                             <div className="text-3xl font-mono font-bold">{(winner.feasW * 100).toFixed(0)}%</div>
                         </div>
                    </div>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 break-inside-avoid">
            {/* Main Chart */}
            <div className="lg:col-span-2 border-2 border-swiss-black p-8 h-[700px] print:h-[500px] relative bg-white shadow-sharp print:shadow-none print:border-black">
                <div className="absolute top-0 left-0 bg-swiss-black text-white px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest print:border print:border-black print:bg-white print:text-black">Priority Matrix</div>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 0, right: 40, top: 40, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="0 0" stroke="#E5E5E5" horizontal={false} vertical={true} />
                        <XAxis type="number" hide />
                        <YAxis 
                            dataKey="name" 
                            type="category" 
                            width={200} 
                            tick={CustomYAxisTick} 
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip 
                            cursor={{fill: '#F2F2F2'}}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                return (
                                    <div className="bg-white border-2 border-swiss-black p-4 shadow-sharp">
                                        <p className="font-mono text-xs font-bold uppercase mb-2">{payload[0].payload.name}</p>
                                        <div className="flex items-baseline gap-2">
                                            <p className="text-2xl font-black text-swiss-blue">{Number(payload[0].value).toFixed(1)}</p>
                                            <span className="text-xs font-bold">/ 100</span>
                                        </div>
                                    </div>
                                );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="score" barSize={40}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#0044FF' : '#000000'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Details Table */}
            <div className="space-y-4">
                <div className="bg-swiss-gray/50 p-4 text-[10px] font-mono font-bold text-swiss-black uppercase tracking-widest border-2 border-swiss-black print:bg-white print:border-black">
                    Full Breakdown
                </div>
                {finalScores.map((fs, idx) => (
                    <div key={fs.id} className="bg-white border-2 border-swiss-border p-6 transition-all group hover:border-swiss-black hover:shadow-hover print:border-black print:shadow-none">
                        <div className="flex justify-between items-baseline mb-4">
                            <span className="font-bold text-swiss-black text-lg flex items-baseline gap-3 leading-none">
                                <span className="font-mono text-swiss-muted text-xs">0{idx + 1}</span>
                                {fs.label}
                            </span>
                            <span className="font-mono text-swiss-blue text-xl font-bold print:text-black">{(fs.baseScore / maxScore * 100).toFixed(1)}</span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-swiss-border">
                            <div className="space-y-2">
                                <div className="text-[9px] uppercase text-swiss-muted font-mono font-bold">Coverage</div>
                                <div className="h-1.5 w-full bg-swiss-gray border border-swiss-gray overflow-hidden">
                                    <div className="h-full bg-swiss-black" style={{width: `${fs.coverage * 100}%`}}></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-[9px] uppercase text-swiss-muted font-mono font-bold">Effect</div>
                                <div className="h-1.5 w-full bg-swiss-gray border border-swiss-gray overflow-hidden">
                                    <div className="h-full bg-swiss-black" style={{width: `${fs.effW * 100}%`}}></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-[9px] uppercase text-swiss-muted font-mono font-bold">Feas</div>
                                <div className="h-1.5 w-full bg-swiss-gray border border-swiss-gray overflow-hidden">
                                    <div className="h-full bg-swiss-black" style={{width: `${fs.feasW * 100}%`}}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
        {/* Network View in Results */}
        <div className="border-t-4 border-swiss-black pt-12 break-inside-avoid print:break-before-page">
             <div className="flex items-center gap-4 mb-8">
                 <div className="w-4 h-4 bg-swiss-blue print:bg-black"></div>
                 <h3 className="font-mono text-sm font-bold text-swiss-black uppercase tracking-widest">Logic Graph</h3>
             </div>
             <NetworkGraph 
                outcome={state.outcome}
                causes={state.causes}
                interventions={state.interventions}
                causeWeights={causeResults.weights}
                interventionWeights={interventionScoreMap}
                className="h-[600px] print:h-[500px] print:border-black print:shadow-none"
             />
        </div>
        
        <div className="flex justify-center pb-12 pt-12 no-print">
            <Button variant="secondary" onClick={() => setCurrentStep(Step.DEFINE)} type="button" className="text-lg px-12 py-6">START NEW SESSION</Button>
        </div>
      </div>
    );
  };

  const stepIndex = [Step.DEFINE, Step.COMPARE_CAUSES, Step.COMPARE_EFF, Step.COMPARE_FEAS, Step.RESULTS].indexOf(currentStep);

  // Logic for Floating Consistency Badge
  let currentCR = 0;
  if (currentStep === Step.COMPARE_CAUSES) currentCR = causeResults.consistencyRatio;
  else if (currentStep === Step.COMPARE_EFF) currentCR = effResults.consistencyRatio;
  else if (currentStep === Step.COMPARE_FEAS) currentCR = feasResults.consistencyRatio;

  const showBadge = view === 'TOOL' && [Step.COMPARE_CAUSES, Step.COMPARE_EFF, Step.COMPARE_FEAS].includes(currentStep);

  return (
    <div className="min-h-screen bg-white text-swiss-black font-sans flex flex-col relative">
      
      {/* Global Print Header - Repeats on every page due to fixed positioning */}
      <div className="hidden print:flex fixed top-0 left-0 w-full justify-between items-center border-b border-black pb-2 bg-white z-50">
        <div className="text-[8px] font-mono uppercase">
            Generated with: <span className="font-bold">Priority Engine</span> // <a href="https://github.com/gbrlpzz/OCI-AHP_Priority_Engine" className="underline decoration-1">github.com/gbrlpzz/OCI-AHP_Priority_Engine</a>
        </div>
        <div className="text-[8px] font-mono uppercase text-gray-500">
            Copyright &copy; 2025 Gabriele Pizzi // Opera Incerta. All rights reserved.
        </div>
      </div>

      <header className="border-b-2 border-swiss-black bg-white sticky top-0 z-50 shadow-sm no-print" role="banner">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-24 flex justify-between items-center">
          <div className="flex items-center gap-3 select-none cursor-pointer group" onClick={() => setView('TOOL')}>
             <h1 className="text-3xl font-black tracking-tighter text-swiss-black group-hover:text-swiss-blue transition-colors leading-none mt-1">PRIORITY<span className="text-swiss-blue group-hover:text-swiss-black">_ENGINE</span></h1>
             <span className="hidden lg:block text-[10px] font-mono text-swiss-muted tracking-[0.2em] uppercase bg-swiss-gray/30 px-2 py-1 border border-swiss-border mt-1">// AHP-OCI PROTOCOL</span>
          </div>
          
          <div className="flex gap-8 items-center h-full relative">
              <div className="relative">
                  <button 
                    onClick={() => { setView('METHODOLOGY'); setShowMethodologyHint(false); }}
                    className={`
                      px-5 py-2 font-mono text-[10px] font-bold uppercase tracking-widest border-2 transition-all duration-200
                      ${view === 'METHODOLOGY' 
                        ? 'border-swiss-blue text-swiss-blue' 
                        : 'border-transparent text-swiss-muted hover:text-swiss-black hover:border-swiss-black'
                      }
                    `}
                  >
                    Methodology
                  </button>

                  {/* Onboarding Hint Popup */}
                  {showMethodologyHint && view === 'TOOL' && (
                     <div className="absolute top-full mt-4 right-0 w-64 bg-swiss-blue border-2 border-swiss-black text-white p-5 shadow-sharp z-50 animate-in slide-in-from-top-2 fade-in duration-300">
                        {/* Arrow */}
                        <div className="absolute -top-2 right-8 w-4 h-4 bg-swiss-blue border-l-2 border-t-2 border-swiss-black rotate-45"></div>
                        
                        <div className="relative z-10">
                             <div className="flex justify-between items-start mb-2">
                                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-white/60">System Hint</span>
                                <button onClick={() => setShowMethodologyHint(false)} className="text-white hover:text-black font-mono font-bold transition-colors">✕</button>
                             </div>
                             <p className="text-sm font-bold leading-tight mb-4 tracking-tight">
                                New to the protocol? Check the decision logic before you start.
                             </p>
                             <button 
                                onClick={() => { setView('METHODOLOGY'); setShowMethodologyHint(false); }}
                                className="text-[10px] font-mono font-bold uppercase border-b-2 border-white pb-px hover:bg-white hover:text-swiss-blue transition-all"
                             >
                                Read Methodology &rarr;
                             </button>
                        </div>
                     </div>
                  )}
              </div>
              
              {view === 'TOOL' && (
                  <nav aria-label="Progress" className="hidden md:flex border-2 border-swiss-black bg-white shadow-sharp ml-4">
                    {[
                    { id: Step.DEFINE, label: 'Setup' },
                    { id: Step.COMPARE_CAUSES, label: 'Drivers' },
                    { id: Step.COMPARE_EFF, label: 'Effect' },
                    { id: Step.COMPARE_FEAS, label: 'Feas' },
                    { id: Step.RESULTS, label: 'Report' }
                    ].map((s, i) => {
                        const isActive = currentStep === s.id;
                        const isPast = stepIndex > i;
                        return (
                            <button 
                                key={s.id} 
                                onClick={() => isPast ? setCurrentStep(s.id) : null}
                                disabled={!isPast && !isActive}
                                className={`px-6 py-3 text-[10px] font-mono font-bold uppercase tracking-widest border-r-2 border-swiss-black last:border-r-0 flex items-center gap-2 transition-all
                                    ${isActive ? 'bg-swiss-blue text-white' : isPast ? 'text-swiss-black bg-white hover:bg-swiss-gray cursor-pointer' : 'text-swiss-muted bg-swiss-gray/10'}
                                `}
                            >
                                <span className={isActive ? 'opacity-100' : 'opacity-30'}>0{i+1}</span>
                                <span className="hidden lg:inline">{s.label}</span>
                            </button>
                        )
                    })}
                </nav>
              )}
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-[1600px] mx-auto w-full px-6 md:px-12 py-16 print:p-0 print:max-w-none" role="main">
        {view === 'METHODOLOGY' && <Methodology onBack={() => setView('TOOL')} />}

        {view === 'TOOL' && currentStep === Step.DEFINE && (
            <DefinitionView 
                state={state}
                setState={setState}
                onNext={() => setCurrentStep(Step.COMPARE_CAUSES)}
                isGenerating={isGenerating}
                handleAiCauses={handleAiCauses}
                handleAiInterventions={handleAiInterventions}
                addCause={addCause}
                addIntervention={addIntervention}
            />
        )}
        
        {view === 'TOOL' && currentStep === Step.COMPARE_CAUSES && renderComparisonStep(
            "DRIVER IMPACT",
            "Assess the relative weight of each driver on the strategic outcome.",
            state.causes,
            state.causeComparisons,
            'causes',
            Step.COMPARE_EFF,
            Step.DEFINE
        )}

        {view === 'TOOL' && currentStep === Step.COMPARE_EFF && renderComparisonStep(
            "EFFECTIVENESS",
            "Evaluate the theoretical impact of each intervention on its targeted drivers.",
            state.interventions,
            state.effComparisons,
            'eff',
            Step.COMPARE_FEAS,
            Step.COMPARE_CAUSES
        )}

        {view === 'TOOL' && currentStep === Step.COMPARE_FEAS && renderComparisonStep(
            "FEASIBILITY",
            "Assess implementation constraints (Cost, Politics, Tech) for each intervention.",
            state.interventions,
            state.feasComparisons,
            'feas',
            Step.RESULTS,
            Step.COMPARE_EFF
        )}

        {view === 'TOOL' && currentStep === Step.RESULTS && renderResults()}
      </main>

      {/* Sticky Consistency Badge */}
      {showBadge && (
         <div className="fixed bottom-8 right-8 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500 no-print">
            <ConsistencyBadge cr={currentCR} />
         </div>
      )}

      <footer className="border-t border-swiss-border py-8 mt-auto bg-white no-print" role="contentinfo">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[10px] text-swiss-muted uppercase tracking-widest">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-swiss-blue rounded-full animate-pulse"></div>
                System Operational
            </div>
            <div className="flex items-center gap-6">
                <span>Copyright &copy; 2025 Gabriele Pizzi // Opera Incerta</span>
                <a 
                    href="https://github.com/gbrlpzz/OCI-AHP_Priority_Engine" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-swiss-black transition-colors border-b border-transparent hover:border-swiss-black pb-px"
                >
                    GitHub
                </a>
                <a 
                    href="mailto:info@operaincerta.com" 
                    className="hover:text-swiss-black transition-colors border-b border-transparent hover:border-swiss-black pb-px"
                >
                    Contact
                </a>
            </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
