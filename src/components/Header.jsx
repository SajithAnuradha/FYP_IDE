export default function Header({ selectedProject }) {
  return (
    <header className="h-10 bg-ide-surface border-b border-ide-border flex items-center px-4 gap-4 shrink-0 z-10">
      {/* Window controls */}
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80" />
        <div className="w-3 h-3 rounded-full bg-green-500 opacity-80" />
      </div>

      <div className="w-px h-5 bg-ide-border" />

      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-gradient-to-br from-ide-accent to-ide-purple flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>
        <span className="text-ide-text font-semibold text-sm tracking-wide">JavaBugIDE</span>
        <span className="text-ide-muted text-xs">— FYP Research Tool</span>
      </div>

      {/* Breadcrumb */}
      {selectedProject && (
        <div className="flex items-center gap-1.5 text-xs text-ide-muted ml-2">
          <span className="text-ide-accent">src</span>
          <span>/</span>
          <span className="text-ide-warning font-medium">{selectedProject.fileName}</span>
          <span className="ml-2 px-1.5 py-0.5 rounded bg-ide-border text-ide-muted font-mono">
            {selectedProject.category}
          </span>
          <span
            className={`ml-1 px-1.5 py-0.5 rounded text-xs font-medium ${
              selectedProject.difficulty === 'Easy'
                ? 'bg-green-900/40 text-green-400'
                : 'bg-yellow-900/40 text-yellow-400'
            }`}
          >
            {selectedProject.difficulty}
          </span>
        </div>
      )}

      <div className="ml-auto flex items-center gap-3 text-xs text-ide-muted">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-ide-success pulse-dot" />
          <span>Backend connected</span>
        </div>
        <div className="w-px h-4 bg-ide-border" />
        <span className="text-ide-accent font-medium">Java</span>
        <span>UTF-8</span>
        <span>LF</span>
      </div>
    </header>
  );
}
