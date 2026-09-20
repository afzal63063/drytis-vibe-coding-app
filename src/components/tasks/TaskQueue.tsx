import { useState, type DragEvent } from 'react';
import { Plus, ListTodo } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TASK_STATUS_META } from '../../utils/meta';
import { Button } from '../ui';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import type { Task, TaskStatus } from '../../types';

const COLUMNS: TaskStatus[] = ['todo', 'inProgress', 'review', 'done'];
const COLUMN_HINTS: Record<TaskStatus, string> = {
  todo: 'Queued for pickup',
  inProgress: 'Active drytis session',
  review: 'Awaiting verification',
  done: 'Shipped & billed',
};

/**
 * Module A — Kanban Task Queue.
 * Tasks flow across Todo → In Progress → Review → Done with drag & drop,
 * subtask checklists, inline progress, and inline create/edit modals.
 */
export function TaskQueue() {
  const { state, moveTask, deleteTask } = useApp();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<TaskStatus | null>(null);
  const [editing, setEditing] = useState<Task | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const startDrag = (e: DragEvent<HTMLDivElement>, t: Task) => {
    setDraggingId(t.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', t.id);
  };

  const dropOn = (status: TaskStatus) => {
    if (draggingId) moveTask(draggingId, status);
    setOverCol(null);
  };

  const refreshEdit = editing ? state.tasks.find((t) => t.id === editing.id) ?? null : null;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <ListTodo size={18} className="text-brand-300" />
            Task Queue
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {state.tasks.filter((t) => t.status === 'todo').length} queued ·{' '}
            {state.tasks.filter((t) => t.status === 'inProgress').length} in progress ·{' '}
            {state.tasks.filter((t) => t.status === 'done').length} completed
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setCreateOpen(true)}>
          New task
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {COLUMNS.map((status) => {
          const meta = TASK_STATUS_META[status];
          const items = state.tasks.filter((t) => t.status === status);
          const isOver = overCol === status;
          const laneBilled = state.timeEntries
            .filter((e) => items.some((t) => t.id === e.taskId))
            .reduce((a, e) => a + e.seconds, 0);

          return (
            <div
              key={status}
              onDragOver={(e) => {
                e.preventDefault();
                setOverCol(status);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setOverCol(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                dropOn(status);
              }}
              className={`rounded-xl border transition-colors duration-150 flex flex-col min-h-[260px] ${
                isOver ? 'border-brand-400/60 bg-brand-500/[0.07] shadow-glow' : 'border-edge/70 bg-base-2/40'
              }`}
            >
              <div className="px-3.5 pt-3.5 pb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${meta.bar}`} />
                  <h3 className="text-[13px] font-semibold text-slate-200">{meta.label}</h3>
                  <span className="mono text-[11px] text-slate-600 bg-panel-2 rounded-md px-1.5 py-0.5">
                    {items.length}
                  </span>
                </div>
                {status === 'todo' && (
                  <Button size="sm" variant="ghost" icon={Plus} onClick={() => setCreateOpen(true)}>
                    Add
                  </Button>
                )}
              </div>
              <p className="px-3.5 text-[10px] text-slate-600 -mt-1 mb-2">{COLUMN_HINTS[status]}</p>

              <div className="px-2.5 pb-2.5 flex-1 space-y-2.5 overflow-y-auto max-h-[calc(100vh-360px)]">
                {items.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    onEdit={(task) => setEditing(task)}
                    onDelete={(task) => {
                      if (window.confirm(`Delete "${task.title}"?`)) deleteTask(task.id);
                    }}
                    dragging={draggingId === t.id}
                    onDragStart={startDrag}
                    onDragEnd={() => setDraggingId(null)}
                  />
                ))}
                {items.length === 0 && (
                  <div className="rounded-lg border border-dashed border-edge text-center py-6 text-[11px] text-slate-600">
                    {isOver ? 'Drop to queue here' : 'No tasks in this lane'}
                  </div>
                )}
              </div>

              {laneBilled > 0 && (
                <div className="px-3.5 pb-2.5">
                  <p className="text-[10px] text-slate-600">{(laneBilled / 3600).toFixed(1)} billed hrs in this lane</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {createOpen && <TaskModal open={createOpen} onClose={() => setCreateOpen(false)} />}
      {refreshEdit && <TaskModal key={refreshEdit.id} open={true} task={refreshEdit} onClose={() => setEditing(null)} />}
    </div>
  );
}