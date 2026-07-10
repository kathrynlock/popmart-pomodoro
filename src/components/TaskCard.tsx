
import { useContext, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task, TaskStatus } from '../types';
import { useAppState, useAppActions } from '../context/AppContext';
import { ParticleContext } from '../context/ParticleContext';

interface TaskCardProps {
  task: Task;
  columnIndex: number;
  onDragStart: () => void;
  onDragEnd: () => void;
}

const COLS = {
  backlog: { title: 'backlog', dot: '#A4D1F2' },
  progress: { title: 'in progress', dot: '#FFC58A' },
  done: { title: 'done', dot: '#B7DE7F' },
};

const TASK_ORDER: TaskStatus[] = ['backlog', 'progress', 'done'];

export function TaskCard({ task, columnIndex, onDragStart, onDragEnd }: TaskCardProps) {
  const { deleteTask, moveTask } = useAppActions();
  const { state } = useAppState();
  const particles = useContext(ParticleContext);
  const cardRef = useRef<HTMLDivElement>(null);
  const prevRectRef = useRef<DOMRect | null>(null);
  const col = COLS[task.status];
  const canBack = columnIndex > 0;
  const canForward = columnIndex < 2;
  const nextStatus = TASK_ORDER[columnIndex + 1] as TaskStatus;
  const prevStatus = TASK_ORDER[columnIndex - 1] as TaskStatus;

  const isDone = task.status === 'done';
  const showLanding = state.justDone === task.id;

  const { attributes, listeners, setNodeRef, isDragging, transform, transition } = useSortable({
    id: `task-${task.id}`,
    data: { task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  useEffect(() => {
    if (isDragging) {
      onDragStart();
    } else {
      onDragEnd();
    }
  }, [isDragging, onDragStart, onDragEnd]);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || isDragging) return;

    const currentRect = el.getBoundingClientRect();

    if (prevRectRef.current) {
      const dx = prevRectRef.current.left - currentRect.left;
      const dy = prevRectRef.current.top - currentRect.top;

      if (dx !== 0 || dy !== 0) {
        el.style.transition = 'none';
        el.style.transform = `translate(${dx}px, ${dy}px)`;

        requestAnimationFrame(() => {
          el.style.transition = 'transform 0.22s cubic-bezier(0.2, 0.8, 0.3, 1)';
          el.style.transform = '';
        });
      }
    }

    prevRectRef.current = currentRect;
  }, [task.status, columnIndex, isDragging]);

  const handleMoveToNext = () => {
    const ns = TASK_ORDER[columnIndex + 1];
    if (ns === 'done' && particles) {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight * 0.5;
      particles.confetti(cx, cy, { count: 60, power: 8 });
    }
    moveTask(task.id, ns);
  };

  return (
    <div
        ref={(node) => {
          cardRef.current = node;
          setNodeRef(node);
        }}
        {...listeners}
        {...attributes}
        style={{
          ...style,
          background: '#fff',
          borderRadius: '18px',
          padding: '14px 14px 12px',
          boxShadow: '0 6px 16px rgba(74, 59, 82, 0.09)',
          border: '2px solid #FBF6FA',
          cursor: isDragging ? 'grabbing' : 'grab',
          animation: showLanding && !isDragging ? 'ffLand 0.5s ease' : 'none',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <span
            style={{
              flex: 'none',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: col.dot,
              marginTop: '4px',
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 800,
                fontSize: '15px',
                color: isDone ? '#9BB07A' : '#4A3B52',
                lineHeight: '1.3',
                textDecoration: isDone ? 'line-through' : 'none',
                textDecorationColor: isDone ? '#CFE3AE' : 'transparent',
              }}
            >
              {task.title}
            </div>
            {task.desc && (
              <div style={{ fontSize: '13px', color: '#A695AE', marginTop: '3px', lineHeight: '1.35' }}>
                {task.desc}
              </div>
            )}
          </div>
          <button
            onClick={() => deleteTask(task.id)}
            title="remove"
            style={{
              flex: 'none',
              border: 'none',
              cursor: 'pointer',
              background: 'transparent',
              color: '#D8C7DE',
              fontSize: '16px',
              fontWeight: 900,
              lineHeight: 1,
              padding: '2px',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#F5A0C4')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#D8C7DE')}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '10px' }}>
          {canBack && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveTask(task.id, prevStatus);
              }}
              style={{
                border: 'none',
                cursor: 'pointer',
                background: '#F4EEF8',
                color: '#9B84A6',
                borderRadius: '10px',
                padding: '4px 10px',
                fontWeight: 800,
                fontSize: '12px',
                transition: 'background 0.2s ease',
              }}
            >
              ‹ back
            </button>
          )}
          {canForward && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMoveToNext();
              }}
              style={{
                border: 'none',
                cursor: 'pointer',
                background: nextStatus === 'done' ? '#DBF0BA' : '#FFE0BE',
                color: nextStatus === 'done' ? '#5E7A2E' : '#B8763A',
                borderRadius: '10px',
                padding: '4px 10px',
                fontWeight: 800,
                fontSize: '12px',
                transition: 'background 0.2s ease',
              }}
            >
              {nextStatus === 'done' ? 'done' : 'start'} ›
            </button>
          )}
        </div>
      </div>
  );
}
