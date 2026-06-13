import { useState } from 'react';

const SUGGESTION_TEMPLATES = [
  "The swap operation uses arr[j] instead of the saved temp variable",
  "The right boundary should be arr.length - 1 to avoid out-of-bounds access",
  "The base case returns the wrong value causing all recursive results to be incorrect",
  "The pointer is initialized incorrectly, creating a circular reference",
  "The size counter is never decremented after the element is removed",
];

export default function FeedbackPanel({ project, selection, onGeneratePatch, isLoading, apiError }) {
  const [feedback, setFeedback] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const canSubmit = project && selection && feedback.trim().length > 0 && !isLoading;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onGeneratePatch(feedback.trim());
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Panel header */}
      <div className="h-9 flex items-center justify-between px-3 border-b border-ide-border bg-ide-bg shrink-0">
        <div className="flex items-center gap-2">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="text-xs font-medium text-ide-text">Natural Language Feedback</span>
        </div>
        <button
          onClick={() => setShowSuggestions((v) => !v)}
          className="text-xs text-ide-muted hover:text-ide-accent transition-colors flex items-center gap-1"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Templates
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden p-3 gap-2.5">
        {/* Selection status */}
        <div
          className={`flex items-center gap-2 text-xs rounded-lg px-2.5 py-1.5 border transition-all ${
            selection
              ? 'bg-ide-accent/10 border-ide-accent/30 text-ide-accent'
              : 'bg-ide-surface border-ide-border text-ide-muted'
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {selection ? (
              <polyline points="20 6 9 17 4 12" />
            ) : (
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            )}
          </svg>
          {selection ? (
            <span>
              Lines <strong>{selection.startLine}–{selection.endLine}</strong> selected ({selection.selectedText.split('\n').length} lines)
            </span>
          ) : (
            <span>No lines selected — click &amp; drag in the editor to select buggy code</span>
          )}
        </div>

        {/* Template suggestions */}
        {showSuggestions && (
          <div className="shrink-0 bg-ide-bg border border-ide-border rounded-lg p-2 space-y-1">
            <div className="text-xs text-ide-muted font-medium mb-1.5">Quick templates:</div>
            {SUGGESTION_TEMPLATES.map((s, i) => (
              <button
                key={i}
                onClick={() => { setFeedback(s); setShowSuggestions(false); }}
                className="w-full text-left text-xs text-ide-muted hover:text-ide-text hover:bg-ide-hover rounded px-2 py-1.5 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Feedback textarea */}
        <div className="flex-1 flex flex-col min-h-0">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              selection
                ? `Describe what's wrong with lines ${selection.startLine}–${selection.endLine} and how to fix it...\n\nExample: "Line ${project?.functionInfo?.bugLine || 'X'} uses the wrong variable — it should use temp instead of arr[j]"`
                : 'First select the buggy lines in the code editor, then describe the fix here...'
            }
            disabled={!project}
            className="flex-1 resize-none bg-ide-bg border border-ide-border rounded-lg p-3 text-xs font-mono text-ide-text placeholder-ide-muted/60 focus:outline-none focus:border-ide-accent/60 transition-colors leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="flex items-center justify-between mt-1 px-0.5">
            <span className="text-xs text-ide-muted">{feedback.length} chars · Ctrl+Enter to submit</span>
            {feedback.length > 0 && (
              <button
                onClick={() => setFeedback('')}
                className="text-xs text-ide-muted hover:text-ide-error transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* API error */}
        {apiError && (
          <div className="shrink-0 flex items-start gap-2 text-xs bg-ide-error/10 border border-ide-error/30 rounded-lg px-2.5 py-2 text-ide-error">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {apiError}
          </div>
        )}

        {/* Generate Patch button */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`shrink-0 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            canSubmit
              ? 'bg-gradient-to-r from-ide-accent to-ide-purple text-white hover:opacity-90 shadow-lg shadow-ide-accent/20 cursor-pointer'
              : 'bg-ide-surface text-ide-muted cursor-not-allowed border border-ide-border'
          }`}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12a9 9 0 11-6.219-8.56" />
              </svg>
              Generating patch…
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              Generate Patch
            </>
          )}
        </button>

        {/* Hint */}
        {!selection && project && (
          <p className="text-xs text-ide-muted text-center shrink-0">
            💡 Tip: Select code in the editor first, then describe what to fix
          </p>
        )}
      </div>
    </div>
  );
}
