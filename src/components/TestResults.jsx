import { useState } from 'react';

export default function TestResults({ project, patchedCode, onRunTests, testRunning, testResults }) {
  const [expanded, setExpanded] = useState(null);

  const testCases = project?.testCases || [];

  const getResultForTest = (tc) => {
    if (!testResults) return null;
    return testResults.find((r) => r.id === tc.id);
  };

  const passCount = testResults ? testResults.filter((r) => r.passed).length : 0;
  const totalCount = testCases.length;
  const allPassed = testResults && passCount === totalCount;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Panel header */}
      <div className="h-9 flex items-center justify-between px-3 border-b border-ide-border bg-ide-bg shrink-0">
        <div className="flex items-center gap-2">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="1.5">
            <polyline points="9 11 12 14 22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          <span className="text-xs font-medium text-ide-text">Test Cases</span>
        </div>

        {testResults && (
          <div className={`text-xs font-bold ${allPassed ? 'text-ide-success' : 'text-ide-error'}`}>
            {passCount}/{totalCount} passed
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden p-3 gap-2.5">
        {/* Summary bar */}
        {testResults && (
          <div className="shrink-0">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-ide-muted">Test suite</span>
              <span className={allPassed ? 'text-ide-success' : 'text-ide-error'}>
                {allPassed ? '✓ All tests passed' : `${totalCount - passCount} failing`}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-ide-surface overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  allPassed ? 'bg-ide-success' : 'bg-ide-error'
                }`}
                style={{ width: `${(passCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Test cases list */}
        <div className="flex-1 overflow-y-auto space-y-1.5 min-h-0">
          {!project ? (
            <div className="flex flex-col items-center justify-center h-full text-ide-muted gap-2">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#484f58" strokeWidth="1.5">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              <p className="text-xs text-center">Select a project to see test cases</p>
            </div>
          ) : (
            testCases.map((tc, idx) => {
              const result = getResultForTest(tc);
              const isPassed = result?.passed;
              const isExpanded = expanded === tc.id;

              return (
                <div
                  key={tc.id}
                  className={`rounded-lg border transition-all overflow-hidden ${
                    result === null || result === undefined
                      ? 'border-ide-border bg-ide-surface'
                      : isPassed
                      ? 'border-ide-success/30 bg-ide-success/5'
                      : 'border-ide-error/30 bg-ide-error/5'
                  }`}
                >
                  <button
                    onClick={() => setExpanded(isExpanded ? null : tc.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left"
                  >
                    {/* Status icon */}
                    <div className="shrink-0">
                      {result === null || result === undefined ? (
                        <div className="w-4 h-4 rounded-full border-2 border-ide-border" />
                      ) : isPassed ? (
                        <div className="w-4 h-4 rounded-full bg-ide-success flex items-center justify-center">
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-ide-error flex items-center justify-center">
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-ide-muted font-mono">#{idx + 1}</span>
                        <span className={`text-xs font-medium truncate ${
                          result === null || result === undefined
                            ? 'text-ide-muted'
                            : isPassed
                            ? 'text-ide-success'
                            : 'text-ide-error'
                        }`}>
                          {tc.description}
                        </span>
                      </div>
                    </div>

                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#484f58"
                      strokeWidth="2"
                      className={`shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="px-3 pb-2.5 space-y-1.5 border-t border-ide-border/50 pt-2">
                      <div className="flex gap-2">
                        <span className="text-xs text-ide-muted w-16 shrink-0">Input:</span>
                        <code className="text-xs font-mono text-ide-text bg-ide-bg rounded px-1.5 py-0.5">{tc.input}</code>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-xs text-ide-muted w-16 shrink-0">Expected:</span>
                        <code className="text-xs font-mono text-ide-success bg-ide-success/10 rounded px-1.5 py-0.5">{tc.expected}</code>
                      </div>
                      {result && (
                        <>
                          <div className="flex gap-2 items-start">
                            <span className="text-xs text-ide-muted w-16 shrink-0 mt-0.5">Output:</span>
                            <code className={`text-xs font-mono rounded px-1.5 py-0.5 break-all ${
                              isPassed
                                ? 'text-ide-success bg-ide-success/10'
                                : 'text-ide-error bg-ide-error/10'
                            }`}>
                              {result.stdout || '(empty)'}
                            </code>
                          </div>
                          {result.timedOut && (
                            <div className="flex gap-2">
                              <span className="text-xs text-ide-muted w-16 shrink-0">Error:</span>
                              <code className="text-xs font-mono text-ide-error bg-ide-error/10 rounded px-1.5 py-0.5">
                                Timed out — possible infinite loop
                              </code>
                            </div>
                          )}
                          {!result.timedOut && result.stderr && (
                            <div className="flex gap-2 items-start">
                              <span className="text-xs text-ide-muted w-16 shrink-0 mt-0.5">Error:</span>
                              <code className="text-xs font-mono text-ide-error bg-ide-error/10 rounded px-1.5 py-0.5 break-all">
                                {result.stderr.split('\n')[0]}
                              </code>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Run tests button */}
        {project && (
          <button
            onClick={onRunTests}
            disabled={testRunning}
            className={`shrink-0 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              testRunning
                ? 'bg-ide-surface text-ide-muted cursor-not-allowed border border-ide-border'
                : patchedCode
                ? 'bg-gradient-to-r from-ide-success/80 to-ide-teal/70 text-white hover:opacity-90 shadow-lg shadow-ide-success/15 cursor-pointer'
                : 'bg-ide-surface text-ide-muted border border-ide-border hover:bg-ide-hover hover:text-ide-text cursor-pointer'
            }`}
          >
            {testRunning ? (
              <>
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                Running tests…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                {patchedCode ? 'Run Tests (Fixed)' : 'Run Tests (Buggy)'}
              </>
            )}
          </button>
        )}

        {/* Legend */}
        {testResults && (
          <div className="shrink-0 flex items-center justify-center gap-4 text-xs text-ide-muted">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-ide-success" />
              <span>{passCount} passed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-ide-error" />
              <span>{totalCount - passCount} failed</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
