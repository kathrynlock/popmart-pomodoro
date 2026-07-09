import { useState } from 'react';
import type { TaskStatus } from '../types';
import { TaskColumn } from './TaskColumn';

export function TaskBoard() {
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
  const statuses: TaskStatus[] = ['backlog', 'progress', 'done'];

  return (
    <main style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '22px', padding: '22px 40px 60px', maxWidth: '1320px', margin: '0 auto', alignItems: 'start', flex: '1 1 auto', minHeight: 0, overflowY: 'auto', width: '100%' }}>
      {statuses.map((status, idx) => (
        <TaskColumn
          key={status}
          status={status}
          columnIndex={idx}
          draggedTaskId={draggedTaskId}
          onDragStart={setDraggedTaskId}
          onDragEnd={() => setDraggedTaskId(null)}
        />
      ))}
    </main>
  );
}
