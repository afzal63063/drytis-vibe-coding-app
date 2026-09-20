import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button, Field, Modal, Select, TextArea, TextInput } from '../ui';
import { TASK_CATEGORIES } from '../../types';
import type { Priority, Task, TaskCategory } from '../../types';

const PRIORITIES: Array<{ value: Priority; label: string }> = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export function TaskModal({
  open,
  onClose,
  task,
}: {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
}) {
  const { addTask, updateTask } = useApp();
  const editing = Boolean(task);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('API Bug');
  const [priority, setPriority] = useState<Priority>('medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);
  const [assignee, setAssignee] = useState('Afaq (AI-1)');
  const [clientName, setClientName] = useState('');
  const [subtasks, setSubtasks] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    setTitle(task?.title ?? '');
    setDescription(task?.description ?? '');
    setCategory(task?.category ?? 'API Bug');
    setPriority(task?.priority ?? 'medium');
    setEstimatedMinutes(task?.estimatedMinutes ?? 45);
    setAssignee(task?.assignee ?? 'Afaq (AI-1)');
    setClientName(task?.clientName ?? '');
    setSubtasks(task?.subtasks.map((s) => s.title) ?? []);
  }, [open, task]);

  const save = () => {
    if (!title.trim()) return;
    if (task) {
      updateTask(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        priority,
        estimatedMinutes,
        assignee,
        clientName,
        subtasks: subtasks
          .filter((t) => t.trim())
          .map((t) => {
            const existing = task.subtasks.find((s) => s.title === t.trim());
            return { id: existing?.id ?? Math.random().toString(36).slice(2, 9), title: t.trim(), done: existing?.done ?? false };
          }),
      });
    } else {
      addTask({
        title,
        description,
        category,
        priority,
        estimatedMinutes,
        assignee,
        clientName,
        subtaskTitles: subtasks,
      });
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit task' : 'Create task'}
      subtitle={editing ? 'Update queue item and subtask breakdown' : 'Queue a new engineering task. Break it into subtasks instantly.'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={save} disabled={!title.trim()}>
            {editing ? 'Save changes' : 'Create task'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Task title">
          <TextInput
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Fix 500 on checkout when promo is applied"
          />
        </Field>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Field label="Category">
            <Select value={category} onChange={(e) => setCategory(e.target.value as TaskCategory)}>
              {TASK_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Priority">
            <Select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Estimate (minutes)">
            <TextInput
              type="number"
              min={5}
              step={5}
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(Number(e.target.value) || 0)}
            />
          </Field>
          <Field label="Assignee">
            <TextInput value={assignee} onChange={(e) => setAssignee(e.target.value)} />
          </Field>
          <Field label="Client / project">
            <TextInput
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Northwind Retail"
            />
          </Field>
        </div>

        <Field label="Description" hint="Optional context for the session.">
          <TextArea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Environment, reproduction steps, acceptance criteria…" />
        </Field>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-400">Subtasks breakdown</span>
            <Button size="sm" variant="ghost" icon={Plus} onClick={() => setSubtasks((s) => [...s, ''])}>
              Add subtask
            </Button>
          </div>
          <div className="space-y-2">
            {subtasks.map((st, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded border border-edge bg-panel-2 shrink-0" />
                <TextInput
                  value={st}
                  onChange={(e) => setSubtasks((arr) => arr.map((x, j) => (j === i ? e.target.value : x)))}
                  placeholder={`Subtask ${i + 1} — e.g. reproduce locally`}
                />
                <button
                  onClick={() => setSubtasks((arr) => arr.filter((_, j) => j !== i))}
                  className="p-1.5 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                  aria-label="Remove subtask"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            {subtasks.length === 0 && (
              <p className="text-xs text-slate-600">No subtasks yet — add steps to decompose the work.</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}