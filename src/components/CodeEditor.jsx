import { useRef, useCallback, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { java } from '@codemirror/lang-java';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';

const customTheme = EditorView.theme({
  '&': { background: '#0d1117', color: '#e6edf3' },
  '.cm-content': { caretColor: '#58a6ff', padding: '8px 0' },
  '.cm-cursor': { borderLeftColor: '#58a6ff' },
  '.cm-gutters': {
    background: '#0d1117',
    borderRight: '1px solid #21262d',
    color: '#484f58',
    minWidth: '3.5em',
  },
  '.cm-activeLineGutter': { background: 'rgba(88,166,255,0.06)', color: '#e6edf3' },
  '.cm-activeLine': { background: 'rgba(88,166,255,0.04)' },
  '.cm-selectionBackground, ::selection': { background: 'rgba(88,166,255,0.28) !important' },
  '.cm-focused .cm-selectionBackground': { background: 'rgba(88,166,255,0.32) !important' },
  '.cm-lineNumbers .cm-gutterElement': { paddingRight: '14px', paddingLeft: '8px' },
  '.cm-matchingBracket': { background: 'rgba(88,166,255,0.2)', borderRadius: '2px' },
});

export default function CodeEditor({ project, onSelectionChange, patchedCode, onCodeChange }) {
  const viewRef = useRef(null);
  const [selectionInfo, setSelectionInfo] = useState(null);
  const [showBugHint, setShowBugHint] = useState(true);

  const displayCode = patchedCode || project?.buggyCode || '';

  const handleCreate = useCallback((view) => {
    viewRef.current = view;
  }, []);

  const handleUpdate = useCallback(
    (viewUpdate) => {
      if (!viewUpdate.selectionSet && !viewUpdate.docChanged) return;

      const state = viewUpdate.state;
      const selection = state.selection.main;

      if (selection.empty) {
        setSelectionInfo(null);
        onSelectionChange(null);
        return;
      }

      const selectedText = state.sliceDoc(selection.from, selection.to);
      const fromLine = state.doc.lineAt(selection.from);
      const toLine = state.doc.lineAt(selection.to);

      const startLine = fromLine.number;
      const endLine = toLine.number;

      const contextLines = 3;
      const totalLines = state.doc.lines;

      const beforeStart = Math.max(1, startLine - contextLines);
      const afterEnd = Math.min(totalLines, endLine + contextLines);

      const beforeLines = [];
      for (let i = beforeStart; i < startLine; i++) {
        beforeLines.push(state.doc.line(i).text);
      }

      const afterLines = [];
      for (let i = endLine + 1; i <= afterEnd; i++) {
        afterLines.push(state.doc.line(i).text);
      }

      const info = {
        startLine,
        endLine,
        selectedText,
        before: beforeLines.join('\n'),
        after: afterLines.join('\n'),
      };

      setSelectionInfo(info);
      onSelectionChange(info);
    },
    [onSelectionChange]
  );

  if (!project) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-ide-bg text-ide-muted gap-6">
        <div className="w-20 h-20 rounded-2xl bg-ide-surface border border-ide-border flex items-center justify-center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#484f58" strokeWidth="1.5">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-ide-text text-lg font-medium mb-1">No file open</p>
          <p className="text-sm text-ide-muted">Select a project from the sidebar to start debugging</p>
        </div>
        <div className="flex gap-2 text-xs text-ide-muted">
          {['BubbleSort', 'BinarySearch', 'Fibonacci'].map((name) => (
            <span key={name} className="px-2 py-1 rounded bg-ide-surface border border-ide-border font-mono">
              {name}.java
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Editor tab bar */}
      <div className="h-9 flex items-center border-b border-ide-border bg-ide-bg shrink-0">
        <div className="flex items-center gap-2 px-4 h-full border-r border-ide-border bg-ide-surface">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f0883e" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span className="text-xs font-mono text-ide-text">{project.fileName}</span>
          {!patchedCode && (
            <div className="w-2 h-2 rounded-full bg-ide-error/70 ml-1" title="Has known bug" />
          )}
          {patchedCode && (
            <div className="w-2 h-2 rounded-full bg-ide-success ml-1" title="Patch applied" />
          )}
        </div>
        <div className="flex-1" />

        {/* Toolbar */}
        <div className="flex items-center gap-3 px-3">
          {selectionInfo && (
            <div className="flex items-center gap-2 text-xs px-2 py-1 rounded bg-ide-accent/15 border border-ide-accent/30 text-ide-accent selection-badge">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span>
                Lines {selectionInfo.startLine}–{selectionInfo.endLine} selected
              </span>
            </div>
          )}

          {patchedCode && (
            <span className="text-xs text-ide-success font-medium flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Patch applied
            </span>
          )}

          <button
            onClick={() => setShowBugHint((v) => !v)}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              showBugHint
                ? 'bg-ide-error/15 text-ide-error border border-ide-error/30'
                : 'text-ide-muted hover:text-ide-text border border-ide-border'
            }`}
          >
            {showBugHint ? '🐛 Hide hint' : '🐛 Show hint'}
          </button>
        </div>
      </div>

      {/* Bug hint banner */}
      {showBugHint && !patchedCode && project.functionInfo.bugDescription && (
        <div className="mx-3 mt-2 mb-1 shrink-0 flex items-start gap-2.5 px-3 py-2 rounded-lg bg-ide-error/10 border border-ide-error/25 text-xs">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f85149" strokeWidth="2" className="shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <span className="text-ide-error font-semibold">Bug detected: </span>
            <span className="text-ide-muted">{project.functionInfo.bugDescription}</span>
            <span className="ml-2 text-ide-muted opacity-70">
              — select the buggy lines and describe the fix below
            </span>
          </div>
        </div>
      )}

      {/* Code editor */}
      <div className="flex-1 overflow-hidden">
        <CodeMirror
          value={displayCode}
          height="100%"
          extensions={[java(), customTheme]}
          theme={oneDark}
          onCreateEditor={handleCreate}
          onUpdate={handleUpdate}
          onChange={(code) => onCodeChange?.(code)}
          readOnly={false}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            foldGutter: true,
            drawSelection: true,
            dropCursor: true,
            allowMultipleSelections: false,
            indentOnInput: true,
            syntaxHighlighting: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: false,
            rectangularSelection: false,
            crosshairCursor: false,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            searchKeymap: false,
            foldKeymap: true,
            completionKeymap: false,
            lintKeymap: false,
          }}
          style={{ height: '100%' }}
        />
      </div>

      {/* Bottom status bar */}
      <div className="h-6 bg-ide-surface border-t border-ide-border flex items-center px-3 gap-4 text-xs text-ide-muted shrink-0">
        <span>
          {displayCode.split('\n').length} lines
        </span>
        <span>·</span>
        <span className={patchedCode ? 'text-ide-success' : 'text-ide-error'}>
          {patchedCode ? '✓ Patched' : '⚠ Bug present'}
        </span>
        {selectionInfo && (
          <>
            <span>·</span>
            <span className="text-ide-accent">
              {selectionInfo.selectedText.length} chars selected ({selectionInfo.endLine - selectionInfo.startLine + 1} lines)
            </span>
          </>
        )}
      </div>
    </div>
  );
}
