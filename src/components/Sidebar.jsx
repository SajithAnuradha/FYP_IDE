import { useState } from 'react';
// import { projects } from '../data/projects.js';
import {projects} from '../data/temp/projects_sample_1'

const CATEGORY_COLORS = {
  'Sorting': 'text-blue-400',
  'Searching': 'text-cyan-400',
  'Dynamic Programming': 'text-purple-400',
  'Data Structures': 'text-orange-400',
  'Strings': 'text-green-400',
  'Recursion': 'text-pink-400',
  'Arrays': 'text-yellow-400',
};

const CATEGORY_ICONS = {
  'Sorting': '⟳',
  'Searching': '⌕',
  'Dynamic Programming': '◈',
  'Data Structures': '◉',
  'Strings': 'Aa',
  'Recursion': 'ƒ',
  'Arrays': '[]',
};

export default function Sidebar({ selectedProject, onSelectProject, patchedProjects }) {
  const [collapsed, setCollapsed] = useState(false);

  const grouped = projects.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  if (collapsed) {
    return (
      <div className="w-10 bg-ide-surface border-r border-ide-border flex flex-col items-center py-3 gap-3 shrink-0">
        <button
          onClick={() => setCollapsed(false)}
          className="text-ide-muted hover:text-ide-text transition-colors"
          title="Expand sidebar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => { onSelectProject(p); setCollapsed(false); }}
            title={p.name}
            className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold transition-colors ${
              selectedProject?.id === p.id
                ? 'bg-ide-accent/20 text-ide-accent'
                : 'text-ide-muted hover:bg-ide-hover hover:text-ide-text'
            }`}
          >
            {p.id}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="w-56 bg-ide-surface border-r border-ide-border flex flex-col shrink-0 overflow-hidden">
      {/* Sidebar header */}
      <div className="h-9 flex items-center justify-between px-3 border-b border-ide-border shrink-0">
        <span className="text-xs font-semibold text-ide-muted uppercase tracking-wider">Explorer</span>
        <button
          onClick={() => setCollapsed(true)}
          className="text-ide-muted hover:text-ide-text transition-colors"
          title="Collapse sidebar"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      {/* Project tree */}
      <div className="flex-1 overflow-y-auto py-1">
        <div className="px-3 py-1.5">
          <div className="flex items-center gap-1.5 text-xs text-ide-muted mb-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <span className="uppercase tracking-wider font-medium">FYP-BugProjects</span>
          </div>

          {Object.entries(grouped).map(([category, catProjects]) => (
            <div key={category} className="mb-2">
              <div className="flex items-center gap-1.5 px-1 py-0.5 text-xs text-ide-muted">
                <span>{CATEGORY_ICONS[category] || '◦'}</span>
                <span className={`font-medium ${CATEGORY_COLORS[category] || 'text-ide-muted'}`}>
                  {category}
                </span>
              </div>

              {catProjects.map((project) => {
                const isSelected = selectedProject?.id === project.id;
                const isPatched = patchedProjects?.has(project.id);

                return (
                  <button
                    key={project.id}
                    onClick={() => onSelectProject(project)}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded text-left transition-all group ${
                      isSelected
                        ? 'bg-ide-accent/15 text-ide-text border-l-2 border-ide-accent'
                        : 'text-ide-muted hover:bg-ide-hover hover:text-ide-text border-l-2 border-transparent'
                    }`}
                  >
                    {/* File icon */}
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={isSelected ? '#58a6ff' : '#8b949e'}
                      strokeWidth="1.5"
                      className="shrink-0"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>

                    <span className="text-xs font-mono truncate flex-1">{project.fileName}</span>

                    {/* Status indicators */}
                    <div className="flex items-center gap-1 shrink-0">
                      {isPatched ? (
                        <div className="w-2 h-2 rounded-full bg-ide-success" title="Patch applied" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-ide-error/70" title="Has bug" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mx-3 mt-3 p-2.5 rounded-lg bg-ide-bg border border-ide-border">
          <div className="text-xs text-ide-muted mb-2 font-medium">Project Stats</div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="text-center p-1.5 rounded bg-ide-surface">
              <div className="text-lg font-bold text-ide-text font-mono">10</div>
              <div className="text-xs text-ide-muted">Projects</div>
            </div>
            <div className="text-center p-1.5 rounded bg-ide-surface">
              <div className="text-lg font-bold text-ide-success font-mono">
                {patchedProjects?.size || 0}
              </div>
              <div className="text-xs text-ide-muted">Patched</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
