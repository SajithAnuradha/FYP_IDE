import { useEffect, useState } from 'react';

// Splice patchedText into the original file at the selected line range
function reconstructFullCode(originalCode, selection, patchedText) {
  if (!originalCode || !selection || !patchedText) return null;
  const lines = originalCode.split('\n');
  const before = lines.slice(0, selection.startLine - 1);
  const after = lines.slice(selection.endLine);
  return [...before, ...patchedText.split('\n'), ...after].join('\n');
}

function DiffView({ original, patched }) {
  if (!original || !patched) return null;

  const originalLines = original.split('\n');
  const patchedLines = patched.split('\n');
  const maxLen = Math.max(originalLines.length, patchedLines.length);
  const rows = [];

  for (let i = 0; i < maxLen; i++) {
    const orig = originalLines[i];
    const next = patchedLines[i];
    if (orig === next) {
      rows.push({ type: 'same', lineOrig: i + 1, lineNew: i + 1, content: orig ?? '' });
    } else if (orig !== undefined && next === undefined) {
      rows.push({ type: 'removed', lineOrig: i + 1, lineNew: null, content: orig });
    } else if (orig === undefined && next !== undefined) {
      rows.push({ type: 'added', lineOrig: null, lineNew: i + 1, content: next });
    } else {
      rows.push({ type: 'removed', lineOrig: i + 1, lineNew: null, content: orig });
      rows.push({ type: 'added', lineOrig: null, lineNew: i + 1, content: next });
    }
  }

  return (
    <div className="font-mono text-xs overflow-x-auto select-text">
      {rows.map((row, idx) => (
        <div
          key={idx}
          className={`flex items-start px-2 py-0.5 ${
            row.type === 'added'
              ? 'bg-green-900/20 border-l-2 border-ide-success'
              : row.type === 'removed'
              ? 'bg-red-900/20 border-l-2 border-ide-error'
              : 'hover:bg-white/[0.02]'
          }`}
        >
          <span className="w-8 text-ide-muted/50 mr-3 select-none shrink-0 text-right">
            {row.lineOrig ?? ' '}
          </span>
          <span
            className={`flex-1 ${
              row.type === 'added'
                ? 'text-green-300'
                : row.type === 'removed'
                ? 'text-red-300 line-through opacity-60'
                : 'text-ide-muted'
            }`}
          >
            <span className="mr-2 select-none font-bold">
              {row.type === 'added' ? '+' : row.type === 'removed' ? '−' : ' '}
            </span>
            {row.content}
          </span>
        </div>
      ))}
    </div>
  );
}

function ConfidenceBadge({ value }) {
  const pct = Math.round(value * 100);
  const color = pct >= 80 ? 'text-ide-success bg-green-900/30 border-green-700/40'
    : pct >= 60 ? 'text-yellow-300 bg-yellow-900/30 border-yellow-700/40'
    : 'text-ide-error bg-red-900/30 border-red-700/40';
  return (
    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${color}`}>
      {pct}% confidence
    </span>
  );
}

export default function PatchModal({ patch, project, selection, onClose, onApply }) {
  const [activeTab, setActiveTab] = useState('diff');

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!patch) return null;

  // ── Parse the actual backend response format ──────────────────────────────
  // Backend returns: { patches: [{ patchedText, explanation, confidence }] }
  const firstPatch = Array.isArray(patch.patches) && patch.patches.length > 0
    ? patch.patches[0]
    : null;

  const patchedText = firstPatch?.patchedText ?? null;
  const explanation =
    firstPatch?.explanation ||
    patch.explanation ||
    patch.message ||
    patch.detail ||
    'Patch generated successfully.';
  const confidence = firstPatch?.confidence ?? null;

  // Reconstruct the full fixed file by splicing patchedText into the original
  const originalCode = project?.buggyCode ?? '';
  const fullFixedCode = patchedText
    ? reconstructFullCode(originalCode, selection, patchedText)
    : null;

  // ─────────────────────────────────────────────────────────────────────────

  const tabs = [
    { id: 'diff',  label: 'Diff',          icon: '±' },
    { id: 'fixed', label: 'Fixed File',     icon: '✓' },
    { id: 'raw',   label: 'Raw Response',   icon: '{}' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl bg-ide-surface border border-ide-border shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-ide-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-ide-success/15 border border-ide-success/30 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-ide-text">Patch Generated</h2>
              <p className="text-xs text-ide-muted">{project?.fileName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {confidence !== null && <ConfidenceBadge value={confidence} />}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-ide-muted hover:text-ide-text hover:bg-ide-hover transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Explanation */}
        <div className="px-5 py-2.5 bg-ide-accent/5 border-b border-ide-border shrink-0 flex items-start gap-2.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" strokeWidth="2" className="mt-0.5 shrink-0">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-xs text-ide-muted leading-relaxed">{explanation}</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-ide-border shrink-0 bg-ide-bg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-ide-accent text-ide-accent'
                  : 'border-transparent text-ide-muted hover:text-ide-text'
              }`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto bg-ide-bg">
          {activeTab === 'diff' && (
            fullFixedCode
              ? <DiffView original={originalCode} patched={fullFixedCode} />
              : <pre className="p-4 text-xs font-mono text-ide-muted whitespace-pre-wrap">
                  {JSON.stringify(patch, null, 2)}
                </pre>
          )}

          {activeTab === 'fixed' && (
            <pre className="p-4 text-xs font-mono text-ide-text whitespace-pre-wrap leading-relaxed">
              {fullFixedCode ?? 'No fixed code could be reconstructed.'}
            </pre>
          )}

          {activeTab === 'raw' && (
            <pre className="p-4 text-xs font-mono text-ide-muted whitespace-pre-wrap">
              {JSON.stringify(patch, null, 2)}
            </pre>
          )}
        </div>

        {/* Footer — Apply + Dismiss always visible */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-ide-border bg-ide-surface shrink-0">
          <p className="text-xs text-ide-muted">
            {fullFixedCode
              ? `Lines ${selection?.startLine}–${selection?.endLine} will be replaced in the editor.`
              : 'Could not reconstruct fixed file — check Raw Response tab.'}
          </p>
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-ide-muted hover:text-ide-text border border-ide-border rounded-lg transition-colors"
            >
              Dismiss
            </button>
            <button
              onClick={() => fullFixedCode && onApply(fullFixedCode)}
              disabled={!fullFixedCode}
              title={!fullFixedCode ? 'No fixed code could be reconstructed' : 'Apply patch to editor'}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
                fullFixedCode
                  ? 'bg-ide-success text-white hover:bg-green-500 shadow-lg shadow-ide-success/20 cursor-pointer'
                  : 'bg-ide-surface text-ide-muted border border-ide-border cursor-not-allowed opacity-40'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
