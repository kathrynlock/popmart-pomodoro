import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { TaskStatus } from '../types';
import { TaskCard } from './TaskCard';
import { useAppState, useAppActions } from '../context/AppContext';

interface TaskColumnProps {
  status: TaskStatus;
  columnIndex: number;
  draggedTaskId: number | null;
  onDragStart: (id: number) => void;
  onDragEnd: () => void;
}

const COLS = {
  backlog: { title: 'backlog', icon: '🎯', tint: '#F1F8FE', dot: '#A4D1F2', emptyMsg: 'nothing here yet -- jot down what\'s on your mind.' },
  progress: { title: 'in progress', icon: '⚡', tint: '#FFF8F0', dot: '#FFC58A', emptyMsg: 'pick something and give it a go!' },
  done: { title: 'done', icon: '✓', tint: '#F6FCEC', dot: '#B7DE7F', emptyMsg: 'finished tasks land here. you\'ve got this!' },
};

export function TaskColumn({
  status,
  columnIndex,
  onDragStart,
  onDragEnd,
}: TaskColumnProps) {
  const { state } = useAppState();
  const { openAddTask } = useAppActions();
  const col = COLS[status];
  const tasks = state.tasks.filter(t => t.status === status);

  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <section
      ref={setNodeRef}
      style={{
        background: col.tint,
        borderRadius: '26px',
        padding: '14px',
        border: '2px solid #fff',
        boxShadow: isOver ? '0 14px 34px rgba(74, 59, 82, 0.2)' : '0 14px 34px rgba(74, 59, 82, 0.07)',
        minHeight: '220px',
        transition: 'box-shadow 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="18" height="18" viewBox="0 0 32 32" style={{ flex: 'none' }}>
            <path
              d="M16 27.5 C 16 27.5 2.5 18.7 2.5 10.2 C 2.5 5.2 6.3 1.8 10.8 1.8 C 13.8 1.8 15.6 3.6 16 4.9 C 16.4 3.6 18.2 1.8 21.2 1.8 C 25.7 1.8 29.5 5.2 29.5 10.2 C 29.5 18.7 16 27.5 16 27.5 Z"
              fill={col.dot}
            />
          </svg>
          <span style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: '19px', color: '#4A3B52' }}>
            {col.title}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ minWidth: '26px', height: '26px', padding: '0 8px', borderRadius: '13px', background: '#fff', color: '#9B84A6', fontWeight: 900, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {tasks.length}
          </span>
          {status === 'backlog' && (
            <button
              onClick={() => openAddTask(status)}
              title="add a task"
              style={{
                border: 'none',
                cursor: 'pointer',
                width: '28px',
                height: '28px',
                borderRadius: '10px',
                background: '#fff',
                color: '#B29BB8',
                fontSize: '19px',
                fontWeight: 900,
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 3px 8px rgba(74, 59, 82, 0.08)',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#F5A0C4')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#B29BB8')}
            >
              +
            </button>
          )}
        </div>
      </div>

      <SortableContext items={tasks.map(t => `task-${t.id}`)} strategy={verticalListSortingStrategy}>
        <div className="ff-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'scroll', scrollbarGutter: 'stable' }}>
          {tasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '22px 12px 26px', color: '#B7A6BE', fontSize: '13px', fontWeight: 700, lineHeight: '1.4' }}>
              {col.emptyMsg}
            </div>
          ) : (
            tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                columnIndex={columnIndex}
                onDragStart={() => onDragStart(task.id)}
                onDragEnd={onDragEnd}
              />
            ))
          )}
        </div>
      </SortableContext>
    </section>
  );
}
