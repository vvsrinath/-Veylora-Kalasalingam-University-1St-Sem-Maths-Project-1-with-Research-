import React, { useState } from 'react';
import { CheckIcon, CopyIcon } from 'lucide-react';
import mathLabCode from '../../../research/fuel_math_lab.py?raw';
import regressionCode from '../../../research/fuel_regression.py?raw';
import numericalCode from '../../../research/numerical_differentiation.py?raw';

const PROGRAMS = [
{ id: 'math-lab', label: 'Math lab', filename: 'fuel_math_lab.py', code: mathLabCode },
{ id: 'regression', label: 'Regression', filename: 'fuel_regression.py', code: regressionCode },
{ id: 'numerical', label: 'Numerical', filename: 'numerical_differentiation.py', code: numericalCode }];


export function CodeViewer() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const program = PROGRAMS[active];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(program.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-w-0 rounded-3xl border border-white/10 bg-navydark/60 p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Python programs</h3>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-soft transition-colors duration-150 hover:border-accent/40 hover:text-accent">
          
          {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {PROGRAMS.map((item, i) =>
        <button
          key={item.id}
          type="button"
          onClick={() => {
            setActive(i);
            setCopied(false);
          }}
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-150 ${
          i === active ? 'bg-accent text-navy' : 'bg-white/5 text-muted hover:text-soft'}`
          }>
          
            {item.label}
          </button>
        )}
      </div>

      <p className="mt-4 font-mono text-xs text-muted">{program.filename}</p>
      <pre className="mt-2 max-h-96 w-full min-w-0 overflow-auto rounded-2xl border border-white/10 bg-navy/70 p-4 text-xs leading-relaxed text-soft/90">
        <code>{program.code}</code>
      </pre>
    </div>);

}
