import { useState, type DragEvent } from 'react';
import { ChevronDown, ChevronRight, Clock3, GripVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import {
  PRIORITY_META,
  TASK_STATUS_META,
  avatarColor,
} from '../../utils/meta';
import { formatMinutes } from '../../utils/time';
import { useApp } from '../../context/AppContext';
import { Badge, IconButton } from '../ui';
import type { Task, TaskStatus } from '../../types';

const STATUS_FLOW: TaskStatus[] = ['todo', 'inProgress', 'review', 'done'];

export function TaskCard({
  task,
  onEdit,
  onDelete,
  dragging,
  onDragStart,
  onDragEnd,
}: {
  task: Task;
  onEdit: (t: Task) => void;
  onDelete: (t: Task) => void;
  dragging: boolean;
  onDragStart: (e: DragEvent<HTMLDivElement>, t: Task) => void;
  onDragEnd: () => void;
}) {
  const { toggleSubtask, addSubtask, removeSubtask, moveTask } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');

  const prio = PRIORITY_META[task.priority];
  const doneCount = task.subtasks.filter((s) => s.done).length;
  const subtaskPct = task.subtasks.length ? (doneCount / task.subtasks.length) * 100 : 0;

  const commitSubtask = () => {
    if (newSubtask.trim()) {
      addSubtask(task.id, newSubtask);
      setNewSubtask('');
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
      className={`group relative card-surface cursor-grab active:cursor-grabbing transition-all duration-150 ${
        dragging ? 'opacity-40 ring-2 ring-brand-400/50' : `hover:border-edge shadow-panel hover:-translate-y-0.5 ${prio.glow}`
      }`}
    >
      <div className="p-3">
        {task.priority === 'critical' && (
          <div className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-rose-400/70 to-transparent" />
        )}
        <div className="flex items-start gap-2 mb-2">
          <GripVertical size={13} className="mt-1 text-slate-700 group-hover:text-slate-500 shrink-0" />
          <button className="flex-1 text-left" onClick={() => setExpanded((v) => !v)} title="Expand subtasks">
            <p className={`text-[13px] leading-snug font-medium ${task.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-100'} group-hover:text-white`}>
              {task.title}
            </p>
          </button>
          <div className="relative flex items-center gap-0.5 shrink-0">
            <IconButton icon={Pencil} label="Edit task" onClick={() => onEdit(task)} className="opacity-0 group-hover:opacity-100" />
            <IconButton icon={Trash2} label="Delete task" tone="danger" onClick={() => onDelete(task)} className="opacity-0 group-hover:opacity-100" />
            <button
              className="p-1.5 rounded-md text-slate-400 hover:bg-panel-2 hover:text-white"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Move task"
            >
              <ChevronDown size={14} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-7 z-20 w-40 rounded-lg card-surface shadow-float p-1 animate-scale-in">
                  <p className="px-2 py-1 text-[10px] uppercase tracking-wide text-slate-600 font-semibold">Move to</p>
                  {STATUS_FLOW.filter((s) => s !== task.status).map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        moveTask(task.id, s);
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-slate-300 hover:bg-panel-2 hover:text-white text-left"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${TASK_STATUS_META[s].bar}`} />
                      {TASK_STATUS_META[s].label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          <Badge className={prio.badge}>
            <span className={`w-1.5 h-1.5 rounded-full ${prio.dot}`} />
            {prio.label}
          </Badge>
          <Badge className="bg-panel-2 text-slate-400 ring-edge">{task.category}</Badge>
          <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-slate-500 mono">
            <Clock3 size={11} /> {formatMinutes(task.estimatedMinutes)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: avatarColor(task.clientName) }}
            />
            <span className="truncate">{task.clientName}</span>
          </span>
          <span className="text-[11px] text-slate-600 truncate">{task.assignee}</span>
        </div>

        {task.subtasks.length > 0 && (
          <div className="mt-2.5">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full bg-panel-2 overflow-hidden">
                <div
                  className={`h-full ${task.status === 'done' ? 'bg-mint-500' : 'bg-brand-400'} transition-all duration-300`}
                  style={{ width: `${subtaskPct}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 mono">{doneCount}/{task.subtasks.length}</span>
            </div>
          </div>
        )}

        {expanded && (
          <div className="mt-3 pt-3 border-t border-edge/60 animate-fade-in">
            {task.subtasks.map((s) => (
              <div key={s.id} className="flex items-center gap-2 py-1 group/sub">
                <button
                  onClick={() => toggleSubtask(task.id, s.id)}
                  className={`flex items-center gap-2 flex-1 text-left text-xs ${
                    s.done ? 'text-slate-600 line-through' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                      s.done ? 'bg-mint-500 border-transparent' : 'border-edge bg-panel-2'
                    }`}
                  >
                    {s.done && <span className="text-base-2 text-[9px] leading-none">✓</span>}
                  </span>
                  <span className="truncate">{s.title}</span>
                </button>
                <button
                  onClick={() => removeSubtask(task.id, s.id)}
                  className="text-slate-700 hover:text-rose-400 opacity-0 group-hover/sub:opacity-100"
                  aria-label="Remove subtask"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))}
            <div className="flex items-center gap-1.5 mt-2">
              <input
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && commitSubtask()}
                placeholder="Break into another subtask…"
                className="flex-1 bg-panel-2 border border-edge rounded-md px-2 py-1 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-brand-400/50"
              />
              <button
                onClick={commitSubtask}
                className="p-1.5 rounded-md text-brand-300 hover:bg-brand-500/15 disabled:opacity-40"
                disabled={!newSubtask.trim()}
                aria-label="Add subtask"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 flex items-center gap-1 text-[10px] text-slate-600 hover:text-slate-400"
        >
          <ChevronRight size={11} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
          {expanded ? 'Collapse' : `${task.subtasks.length} subtasks`}
        </button>
      </div>
      {task.status === 'done' && <div className="absolute inset-x-0 bottom-0 h-0.5 bg-mint-500/40" />}
    </div>
  );
}