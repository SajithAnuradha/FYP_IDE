export default function FunctionInfo({ project }) {
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-ide-muted gap-3">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#484f58" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="text-sm text-center px-4">Select a project to view function details</p>
      </div>
    );
  }

  const info = project.functionInfo;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Panel header */}
      <div className="h-9 flex items-center px-3 border-b border-ide-border bg-ide-bg shrink-0">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#bc8cff" strokeWidth="1.5" className="mr-2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span className="text-xs font-medium text-ide-text">Function Info</span>
      </div>

      <div className="p-3 space-y-3 flex-1 overflow-y-auto">
        {/* Function signature */}
        <div>
          <div className="text-xs text-ide-muted uppercase tracking-wider mb-1.5 font-medium">Signature</div>
          <div className="bg-ide-bg rounded-lg p-2.5 border border-ide-border">
            <code className="text-xs font-mono text-ide-purple leading-relaxed break-all">
              {info.signature}
            </code>
          </div>
        </div>

        {/* Description */}
        <div>
          <div className="text-xs text-ide-muted uppercase tracking-wider mb-1.5 font-medium">Description</div>
          <p className="text-xs text-ide-muted leading-relaxed">{info.description}</p>
        </div>

        {/* Parameters */}
        {info.parameters.length > 0 && (
          <div>
            <div className="text-xs text-ide-muted uppercase tracking-wider mb-1.5 font-medium">Parameters</div>
            <div className="space-y-1.5">
              {info.parameters.map((param) => (
                <div key={param.name} className="flex gap-2 bg-ide-bg rounded p-2 border border-ide-border">
                  <div className="shrink-0">
                    <span className="text-xs font-mono text-ide-accent">{param.name}</span>
                    <span className="text-xs text-ide-muted mx-1">:</span>
                    <span className="text-xs font-mono text-ide-warning">{param.type}</span>
                  </div>
                  <span className="text-xs text-ide-muted">{param.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Returns */}
        <div>
          <div className="text-xs text-ide-muted uppercase tracking-wider mb-1.5 font-medium">Returns</div>
          <div className="flex gap-2 bg-ide-bg rounded p-2 border border-ide-border">
            <span className="text-xs font-mono text-ide-warning shrink-0">{info.returns.type}</span>
            <span className="text-xs text-ide-muted">{info.returns.description}</span>
          </div>
        </div>

        {/* Complexity */}
        <div>
          <div className="text-xs text-ide-muted uppercase tracking-wider mb-1.5 font-medium">Complexity</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-ide-bg rounded p-2 border border-ide-border text-center">
              <div className="text-xs text-ide-muted mb-0.5">Time</div>
              <div className="text-sm font-mono font-bold text-ide-accent">{info.timeComplexity}</div>
            </div>
            <div className="bg-ide-bg rounded p-2 border border-ide-border text-center">
              <div className="text-xs text-ide-muted mb-0.5">Space</div>
              <div className="text-sm font-mono font-bold text-ide-purple">{info.spaceComplexity}</div>
            </div>
          </div>
        </div>

        {/* Bug info */}
        <div>
          <div className="text-xs text-ide-muted uppercase tracking-wider mb-1.5 font-medium flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-ide-error" />
            Known Bug
          </div>
          <div className="bg-ide-error/8 rounded-lg p-2.5 border border-ide-error/25">
            <div className="flex items-start gap-2">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f85149" strokeWidth="2" className="shrink-0 mt-0.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <p className="text-xs text-ide-error leading-relaxed">{info.bugDescription}</p>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-xs text-ide-muted">Bug at line:</span>
              <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-ide-error/15 text-ide-error font-bold">
                {info.bugLine}
              </span>
            </div>
          </div>
        </div>

        {/* Workflow */}
        <div>
          <div className="text-xs text-ide-muted uppercase tracking-wider mb-1.5 font-medium">Workflow</div>
          <div className="space-y-1.5">
            {[
              { step: 1, label: 'Select buggy lines', color: 'text-ide-accent', icon: '⌖' },
              { step: 2, label: 'Describe the fix', color: 'text-ide-warning', icon: '✎' },
              { step: 3, label: 'Generate patch', color: 'text-ide-purple', icon: '⟳' },
              { step: 4, label: 'Run test cases', color: 'text-ide-success', icon: '✓' },
            ].map(({ step, label, color, icon }) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-ide-surface border border-ide-border ${color}`}>
                  {step}
                </div>
                <span className={`text-xs ${color}`}>{icon}</span>
                <span className="text-xs text-ide-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
