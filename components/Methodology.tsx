
import React from 'react';
import { Button } from './Button';

export const Methodology: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 pb-32 max-w-6xl mx-auto">

            {/* Header / Nav */}
            <div className="mb-16 md:mb-24 pt-8 border-b-4 border-swiss-black pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div className="space-y-2">
                    <h1 className="text-7xl md:text-9xl font-black text-swiss-black tracking-tighter leading-none -ml-1 md:-ml-2">
                        METHOD
                    </h1>
                    <div className="flex items-center gap-3">
                        <div className="h-px w-12 bg-swiss-black"></div>
                        <div className="text-lg md:text-2xl font-medium font-mono uppercase tracking-widest text-swiss-black">
                            Protocol v1.0
                        </div>
                    </div>
                </div>
                <Button variant="ghost" onClick={onBack} className="text-xs md:text-sm">&larr; RETURN TO ENGINE</Button>
            </div>

            {/* Abstract */}
            <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-24">
                <div className="md:col-span-3 border-t-4 border-swiss-black pt-4">
                    <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-swiss-blue">00 // Abstract</h3>
                </div>
                <div className="md:col-span-9 border-t-2 border-swiss-border pt-4 space-y-8">
                    <p className="text-2xl md:text-4xl font-bold leading-tight tracking-tight text-swiss-black">
                        A structured decision-support framework integrating causal modeling with multi-criteria prioritization to resolve complex resource allocation problems.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm leading-relaxed text-swiss-muted font-mono">
                        <p>
                            Public administrations and mission-driven teams frequently encounter a crowded field of plausible interventions with limited analytical capacity for fair comparison.
                            This methodology synthesizes the <strong className="text-swiss-black">Outcome–Cause–Intervention (OCI)</strong> causal structure with the <strong className="text-swiss-black">Analytic Hierarchy Process (AHP)</strong> [1].
                        </p>
                        <p>
                            Unlike purely data-driven rankings that miss contextual nuance, or purely deliberative processes that lack consistency, this protocol produces a transparent, auditable utility score. It anchors on a single strategic outcome, decomposes causal drivers, and rigorously assesses intervention utility through pairwise comparison matrices.
                        </p>
                    </div>
                </div>
            </section>

            {/* OCI Model */}
            <section className="mb-24">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-12">
                    <div className="md:col-span-3 border-t-4 border-swiss-black pt-4">
                        <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-swiss-blue">01 // Taxonomy</h3>
                    </div>
                    <div className="md:col-span-9 border-t-2 border-swiss-border pt-4">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-swiss-black">OCI HIERARCHY</h2>
                        <p className="font-mono text-xs uppercase tracking-widest max-w-xl mb-12 text-swiss-black/60">
                            The system imposes a strict three-tier ontology to ensure traceability. Every score assigned to an action must be mathematically traceable to the root causes it addresses.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-swiss-black bg-swiss-black shadow-sharp">
                    {/* Outcome */}
                    <div className="group relative bg-white p-8 h-80 flex flex-col justify-between border-b-2 md:border-b-0 md:border-r-2 border-swiss-black hover:bg-swiss-blue hover:text-white transition-colors duration-300">
                        <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-swiss-blue group-hover:text-white transition-colors">Tier I</div>
                        <div>
                            <div className="text-8xl font-black mb-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">A</div>
                            <h4 className="text-2xl font-bold tracking-tight uppercase">Outcome</h4>
                        </div>
                        <div className="text-[10px] font-mono leading-relaxed border-t border-swiss-border group-hover:border-white/30 pt-4 mt-4 transition-colors">
                            The singular objective function. The state-change the system seeks to maximize.
                        </div>
                    </div>

                    {/* Causes */}
                    <div className="group relative bg-white p-8 h-80 flex flex-col justify-between border-b-2 md:border-b-0 md:border-r-2 border-swiss-black hover:bg-swiss-blue hover:text-white transition-colors duration-300">
                        <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-swiss-blue group-hover:text-white transition-colors">Tier II</div>
                        <div>
                            <div className="text-8xl font-black mb-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">B</div>
                            <h4 className="text-2xl font-bold tracking-tight uppercase">Drivers</h4>
                        </div>
                        <div className="text-[10px] font-mono leading-relaxed border-t border-swiss-border group-hover:border-white/30 pt-4 mt-4 transition-colors">
                            Probabilistic causal factors influencing the Outcome. Weighted by structural impact.
                        </div>
                    </div>

                    {/* Interventions */}
                    <div className="group relative bg-white p-8 h-80 flex flex-col justify-between hover:bg-swiss-blue hover:text-white transition-colors duration-300">
                        <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-swiss-blue group-hover:text-white transition-colors">Tier III</div>
                        <div>
                            <div className="text-8xl font-black mb-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">C</div>
                            <h4 className="text-2xl font-bold tracking-tight uppercase">Actions</h4>
                        </div>
                        <div className="text-[10px] font-mono leading-relaxed border-t border-swiss-border group-hover:border-white/30 pt-4 mt-4 transition-colors">
                            Discrete operational programs. Mapped to drivers and scored on execution parameters.
                        </div>
                    </div>
                </div>
            </section>

            {/* AHP Math */}
            <section className="mb-24">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                    <div className="md:col-span-3 border-t-4 border-swiss-black pt-4">
                        <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-swiss-blue">02 // Computation</h3>
                    </div>
                    <div className="md:col-span-9 border-t-2 border-swiss-border pt-4">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 uppercase">Eigenvector Centrality</h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <p className="text-lg font-medium leading-relaxed text-swiss-black">
                                    We derive priority vectors from the principal right eigenvector of reciprocal pairwise comparison matrices. This approach minimizes the cognitive load on experts by decomposing complex ranking tasks into a series of dyadic comparisons.
                                </p>

                                <div className="border-l-4 border-swiss-black pl-6 py-2">
                                    <h4 className="font-mono font-bold text-xs uppercase tracking-widest mb-2 text-swiss-black">Comparison Mapping</h4>
                                    <p className="text-sm font-mono text-swiss-muted leading-relaxed">
                                        Expert inputs on a bidirectional scale `[-9, 9]` are mapped to the fundamental Saaty scale `[1/9, 9]` to populate the comparison matrix `A`, where `a_ij = 1/a_ji`.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-swiss-gray/10 p-8 border-2 border-swiss-border group hover:border-swiss-black transition-colors">
                                <div className="font-mono text-xs font-bold text-swiss-black uppercase tracking-widest mb-6 border-b border-swiss-black pb-2">Mathematical Definition</div>

                                <div className="space-y-6 font-mono text-sm text-swiss-black">
                                    <div className="flex items-center gap-4">
                                        <span className="text-swiss-blue font-bold text-lg">01</span>
                                        <div className="flex-1">
                                            <div className="font-bold mb-1">Characteristic Equation</div>
                                            <div className="bg-white border border-swiss-border p-3 text-center font-bold shadow-sm">
                                                A &middot; w = &lambda;<sub>max</sub> &middot; w
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className="text-swiss-blue font-bold text-lg">02</span>
                                        <div className="flex-1">
                                            <div className="font-bold mb-1">Consistency Ratio (CR)</div>
                                            <div className="bg-white border border-swiss-border p-3 text-center text-xs shadow-sm">
                                                CR = (CI / RI) &lt; 0.10
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-[10px] text-swiss-muted leading-relaxed mt-4 pt-4 border-t border-swiss-border">
                                        Where <span className="font-bold">w</span> is the normalized weight vector, <span className="font-bold">&lambda;<sub>max</sub></span> is the maximal eigenvalue, and <span className="font-bold">RI</span> is the random index for matrix size n.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Scoring Logic */}
            <section className="mb-24">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                    <div className="md:col-span-3 border-t-4 border-swiss-black pt-4">
                        <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-swiss-blue">03 // Synthesis</h3>
                    </div>
                    <div className="md:col-span-9 border-t-2 border-swiss-border pt-4">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-12 uppercase">Utility Function</h2>

                        <div className="bg-white border-2 border-swiss-black p-8 md:p-16 shadow-sharp relative overflow-hidden group transition-all hover:shadow-hover hover:translate-x-[2px] hover:translate-y-[2px]">
                            {/* Solid Blue Bar */}
                            <div className="absolute top-0 left-0 w-full h-2 bg-swiss-blue"></div>

                            <div className="font-mono text-xs font-bold text-swiss-muted uppercase mb-8 pt-4">Final Score Calculation</div>
                            <div className="text-2xl md:text-5xl font-black tracking-tight leading-tight mb-12 font-mono">
                                S<sub>i</sub> = C<sub>i</sub> &times; E<sub>i</sub> &times; F<sub>i</sub>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t-2 border-swiss-gray pt-8">
                                <div className="space-y-3">
                                    <div className="text-xs font-mono font-bold uppercase bg-swiss-black text-white inline-block px-2 py-1">Term C</div>
                                    <strong className="block text-xl font-bold">Coverage</strong>
                                    <p className="text-xs text-swiss-muted leading-relaxed font-mono">
                                        The cumulative importance of all Drivers targeted by the Intervention.
                                        <br /><span className="opacity-50 italic">&sum; w_cause</span>
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <div className="text-xs font-mono font-bold uppercase bg-swiss-black text-white inline-block px-2 py-1">Term E</div>
                                    <strong className="block text-xl font-bold">Effectiveness</strong>
                                    <p className="text-xs text-swiss-muted leading-relaxed font-mono">
                                        The global weight derived from the "Effectiveness" AHP comparison matrix.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <div className="text-xs font-mono font-bold uppercase bg-swiss-black text-white inline-block px-2 py-1">Term F</div>
                                    <strong className="block text-xl font-bold">Feasibility</strong>
                                    <p className="text-xs text-swiss-muted leading-relaxed font-mono">
                                        The global weight derived from the "Feasibility" AHP comparison matrix.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dependency Logic */}
            <section className="mb-24">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                    <div className="md:col-span-3 border-t-4 border-swiss-black pt-4">
                        <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-swiss-blue">04 // Dependencies</h3>
                    </div>
                    <div className="md:col-span-9 border-t-2 border-swiss-border pt-4">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 uppercase">Prerequisite Propagation</h2>

                        <div className="space-y-8">
                            <p className="text-lg font-medium leading-relaxed text-swiss-black">
                                Interventions may have prerequisite relationships where one action must precede another. The scoring algorithm accounts for these dependencies through iterative score propagation.
                            </p>

                            <div className="bg-swiss-gray/10 border-2 border-swiss-border p-8">
                                <h4 className="font-mono font-bold text-xs uppercase tracking-widest mb-6 text-swiss-black">Propagation Rule</h4>
                                <div className="bg-white border-2 border-swiss-black p-6 mb-6 shadow-sharp">
                                    <div className="text-2xl md:text-4xl font-black tracking-tight text-center font-mono">
                                        If B → A, then S<sub>B</sub> ≥ S<sub>A</sub>
                                    </div>
                                </div>
                                <p className="text-sm font-mono text-swiss-muted leading-relaxed">
                                    When intervention A depends on prerequisite B, the score of B is boosted to match the maximum score of any intervention that depends on it. This ensures prerequisites are never deprioritized when they enable high-value interventions.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="border-l-4 border-swiss-blue pl-6 py-2">
                                    <h4 className="font-mono font-bold text-xs uppercase tracking-widest mb-3 text-swiss-black">Example Case</h4>
                                    <p className="text-sm text-swiss-muted leading-relaxed">
                                        "Graduate Bachelors" → "Enroll in Masters Program"
                                        <br /><br />
                                        If the Masters program scores 85/100 but the Bachelors degree scored only 40/100 initially, the Bachelors score is propagated to 85/100 to reflect its enabling role.
                                    </p>
                                </div>

                                <div className="border-l-4 border-swiss-black pl-6 py-2">
                                    <h4 className="font-mono font-bold text-xs uppercase tracking-widest mb-3 text-swiss-black">Chain Resolution</h4>
                                    <p className="text-sm text-swiss-muted leading-relaxed">
                                        For dependency chains (A → B → C), the algorithm iterates up to 10 times or until score stability, ensuring transitive propagation through multi-step prerequisites.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Appendix (References & Contact) */}
            <section className="bg-swiss-gray/10 border-t-2 border-swiss-black p-12 md:p-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    <div className="md:col-span-3">
                        <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-swiss-muted">Appendix</h3>
                    </div>
                    <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Refs Column */}
                        <div className="space-y-4">
                            <h4 className="font-mono font-bold text-xs uppercase tracking-widest text-swiss-black mb-4 border-b border-swiss-black pb-1 inline-block">References</h4>
                            <ul className="space-y-4 text-xs font-mono text-swiss-muted">
                                <li className="flex gap-4 items-baseline">
                                    <span className="font-bold text-swiss-black">[1]</span>
                                    <span>Saaty, T. L. (1980). <em>The Analytic Hierarchy Process: Planning, Priority Setting, Resource Allocation</em>. McGraw-Hill International Book Co.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Resources & Contact Column */}
                        <div className="space-y-8">
                            {/* Repo */}
                            <div className="space-y-4">
                                <h4 className="font-mono font-bold text-xs uppercase tracking-widest text-swiss-black mb-4 border-b border-swiss-black pb-1 inline-block">Repository</h4>
                                <div className="text-xs font-mono text-swiss-muted flex flex-col gap-2">
                                    <span className="font-bold text-swiss-black">Source Code</span>
                                    <a
                                        href="https://github.com/gbrlpzz/OCI-AHP_Priority_Engine"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-swiss-blue transition-colors hover:underline decoration-swiss-blue decoration-2 underline-offset-4"
                                    >
                                        github.com/gbrlpzz
                                    </a>
                                </div>
                            </div>

                            {/* Contact */}
                            <div className="space-y-4">
                                <h4 className="font-mono font-bold text-xs uppercase tracking-widest text-swiss-black mb-4 border-b border-swiss-black pb-1 inline-block">Correspondence</h4>
                                <div className="text-xs font-mono text-swiss-muted flex flex-col gap-2">
                                    <span className="font-bold text-swiss-black">Gabriele Pizzi</span>
                                    <a
                                        href="mailto:info@operaincerta.com"
                                        className="hover:text-swiss-blue transition-colors hover:underline decoration-swiss-blue decoration-2 underline-offset-4"
                                    >
                                        info@operaincerta.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="flex justify-center pt-16 border-t-2 border-swiss-border">
                <Button
                    variant="primary"
                    onClick={onBack}
                    className="text-xl px-16 py-8"
                >
                    START ANALYSIS &rarr;
                </Button>
            </div>

        </div>
    );
};
