import { useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Check, ArrowRight, type LucideIcon } from "lucide-react";

type Step = { icon: LucideIcon; title: string; description: string };

/** Project-owned marketing diagram; no external workflow execution. */
export default function RoutingWorkflow({ steps, results, resultLabel, compact = false }: { steps: Step[]; results: string[]; resultLabel: string; compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.25 });
  const reducedMotion = useReducedMotion();
  return <div ref={ref} className={`simple-flow-layout routing-workflow${compact ? " routing-workflow-compact" : ""}`} data-playing={visible && !reducedMotion}>
    <ol className="simple-flow-steps">{steps.map((step, index) => <li className={`routing-step routing-step-${index}`} key={step.title}>
      <div className="simple-step-top"><span className="simple-step-icon"><step.icon size={19} /></span><span className="simple-step-number">0{index + 1}</span></div>
      <h3>{step.title}</h3><p>{step.description}</p>
      <span className="routing-step-progress" aria-hidden="true" />
      {index < steps.length - 1 && <span className={`routing-link routing-link-${index}`} aria-hidden="true"><span className="routing-particle" /><ArrowRight size={13} /></span>}
    </li>)}</ol>
    <aside className="simple-flow-result"><span className="simple-result-label">{resultLabel}</span>
      <ul>{results.map((result, index) => <li key={result} className={`routing-result routing-result-${index}`}><span className="routing-result-icon"><Check size={14} aria-hidden="true" /></span><span>{result}</span></li>)}</ul>
    </aside>
  </div>;
}
