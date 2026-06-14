import { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { runJavaTestCase } from './utils/javaRunner.js';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import CodeEditor from './components/CodeEditor.jsx';
import FunctionInfo from './components/FunctionInfo.jsx';
import FeedbackPanel from './components/FeedbackPanel.jsx';
import TestResults from './components/TestResults.jsx';
import PatchModal from './components/PatchModal.jsx';


const API_BASE = 'https://sajithanuradha890-fyp-fastapi-backend.hf.space';

function formatApiError(errorData, fallbackMessage) {
  const detail = errorData?.detail;

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item?.msg) {
          const location = Array.isArray(item.loc) ? item.loc.join('.') : item.loc;
          return location ? `${location}: ${item.msg}` : item.msg;
        }
        return null;
      })
      .filter(Boolean)
      .join(' | ');
  }

  if (typeof detail === 'string') return detail;
  if (typeof errorData?.message === 'string') return errorData.message;

  return fallbackMessage;
}

function Toast({ message, type }) {
  return (
    <div
      className={`fixed top-12 right-4 z-[100] flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-xl text-sm font-medium toast-enter border ${
        type === 'success'
          ? 'bg-green-900/80 border-green-600/50 text-green-300'
          : type === 'error'
          ? 'bg-red-900/80 border-red-600/50 text-red-300'
          : 'bg-blue-900/80 border-blue-600/50 text-blue-300'
      }`}
    >
      {type === 'success' && (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
      {type === 'error' && (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      )}
      {message}
    </div>
  );
}

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [selection, setSelection] = useState(null);
  const [patchedProjects, setPatchedProjects] = useState(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [patch, setPatch] = useState(null);
  const [showPatchModal, setShowPatchModal] = useState(false);
  const [testRunning, setTestRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [toast, setToast] = useState(null);

  const toastTimeout = useRef(null);
  const editorCodeRef = useRef(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToast(null), 3500);
  }, []);

  const handleSelectProject = useCallback((project) => {
    setSelectedProject(project);
    setSelection(null);
    setApiError(null);
    setPatch(null);
    setTestResults(null);
    editorCodeRef.current = null; // reset so new project's code is used
  }, []);

  const handleSelectionChange = useCallback((sel) => {
    setSelection(sel);
    if (sel) setApiError(null);
  }, []);

  const currentPatchedCode = selectedProject ? patchedProjects.get(selectedProject.id) : null;

  const handleGeneratePatch = useCallback(
    async (feedback = '') => {
      if (!selectedProject || !selection) return;

      setIsLoading(true);
      setApiError(null);
      const trimmedFeedback = feedback.trim();

      const payload = {
        fileName: selectedProject.fileName,
        language: 'java',
        selection: {
          startLine: selection.startLine,
          endLine: selection.endLine,
          selectedText: selection.selectedText,
        },
        context: {
          before: selection.before,
          after: selection.after,
        },
        naturalLanguageFeedback: trimmedFeedback || "Fix this issue",
      };


      try {
        const response = await axios.post(`${API_BASE}/generate-patch`, payload, {
          timeout: 90000,
          headers: { 'Content-Type': 'application/json' },
        });
        setPatch(response.data);
        setShowPatchModal(true);
        showToast('Patch generated successfully!', 'success');
      } catch (err) {
        const fallbackMessage =
          (err.code === 'ECONNABORTED'
            ? 'Request timed out. The backend may be starting up — try again.'
            : null) || `Failed to generate patch: ${err.message}`;
        const msg = formatApiError(err.response?.data, fallbackMessage);
        setApiError(msg);
        showToast(msg, 'error');
      } finally {
        setIsLoading(false);
      }
    },
    [selectedProject, selection, showToast]
  );

  const handleApplyPatch = useCallback(
    (patchedCode) => {
      if (!selectedProject) return;
      setPatchedProjects((prev) => new Map(prev).set(selectedProject.id, patchedCode));
      setShowPatchModal(false);
      setPatch(null);
      setTestResults(null);
      editorCodeRef.current = null; // reset so patched code is picked up via currentPatchedCode
      showToast('Patch applied to editor!', 'success');
    },
    [selectedProject, showToast]
  );

  const handleCodeChange = useCallback((code) => {
    editorCodeRef.current = code;
  }, []);

  const handleRunTests = useCallback(async () => {
    if (!selectedProject) return;

    setTestRunning(true);
    setTestResults(null);

    // Use live editor content if user has edited; otherwise fall back to stored patched/buggy code
    const codeToTest = editorCodeRef.current ?? currentPatchedCode ?? selectedProject.buggyCode;

    const results = await Promise.all(
      selectedProject.testCases.map(async (tc) => {
        if (!tc.runnerMain) {
          return { id: tc.id, passed: false, stdout: '', stderr: 'No test harness defined', exitCode: -1, timedOut: false };
        }
        try {
          const { stdout, stderr, exitCode, timedOut } = await runJavaTestCase(codeToTest, tc.runnerMain);
          const passed = !timedOut && exitCode === 0 && stdout === tc.expected;
          return { id: tc.id, passed, stdout, stderr, exitCode, timedOut };
        } catch (err) {
          return { id: tc.id, passed: false, stdout: '', stderr: err.message, exitCode: -1, timedOut: false };
        }
      })
    );

    setTestResults(results);
    setTestRunning(false);

    const passCount = results.filter((r) => r.passed).length;
    const total = results.length;
    if (passCount === total) {
      showToast(`All ${total} tests passed! ✓`, 'success');
    } else {
      showToast(`${passCount}/${total} tests passed`, 'error');
    }
  }, [selectedProject, currentPatchedCode, showToast]);

  return (
    <div className="h-screen flex flex-col bg-ide-bg overflow-hidden">
      <Header selectedProject={selectedProject} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          selectedProject={selectedProject}
          onSelectProject={handleSelectProject}
          patchedProjects={patchedProjects}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top: Code editor + Function info */}
          <div className="flex overflow-hidden" style={{ flex: '1 1 0', minHeight: 0 }}>
            <div
              className="flex flex-col overflow-hidden border-r border-ide-border"
              style={{ flex: '0 0 65%' }}
            >
              <CodeEditor
                project={selectedProject}
                onSelectionChange={handleSelectionChange}
                patchedCode={currentPatchedCode}
                onCodeChange={handleCodeChange}
              />
            </div>

            <div
              className="flex flex-col overflow-hidden bg-ide-surface"
              style={{ flex: '0 0 35%' }}
            >
              <FunctionInfo project={selectedProject} />
            </div>
          </div>

          {/* Bottom: Feedback + Test results */}
          <div
            className="flex shrink-0 border-t border-ide-border"
            style={{ height: '260px' }}
          >
            <div
              className="flex flex-col overflow-hidden border-r border-ide-border bg-ide-surface"
              style={{ flex: '0 0 60%' }}
            >
              <FeedbackPanel
                project={selectedProject}
                selection={selection}
                onGeneratePatch={handleGeneratePatch}
                isLoading={isLoading}
                apiError={apiError}
              />
            </div>

            <div
              className="flex flex-col overflow-hidden bg-ide-surface"
              style={{ flex: '0 0 40%' }}
            >
              <TestResults
                project={selectedProject}
                patchedCode={currentPatchedCode}
                onRunTests={handleRunTests}
                testRunning={testRunning}
                testResults={testResults}
              />
            </div>
          </div>
        </div>
      </div>

      {showPatchModal && patch && (
        <PatchModal
          patch={patch}
          project={selectedProject}
          selection={selection}
          onClose={() => setShowPatchModal(false)}
          onApply={handleApplyPatch}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
