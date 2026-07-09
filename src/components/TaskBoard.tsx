import { useState, useContext } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors, closestCorners, DragOverlay } from '@dnd-kit/core';
import type { TaskStatus } from '../types';
import { useAppState, useAppActions } from '../context/AppContext';
import { ParticleContext } from '../context/ParticleContext';
import { TaskColumn } from './TaskColumn';
import { TaskCard } from './TaskCard';

export function TaskBoard() {
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
  const [draggedTaskData, setDraggedTaskData] = useState<any>(null);
  const { state } = useAppState();
  const { moveTask, reorderTasks } = useAppActions();
  const particles = useContext(ParticleContext);
  const statuses: TaskStatus[] = ['backlog', 'progress', 'done'];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0,
      },
    })
  );

  const handleDragStart = (event: any) => {
    const taskIdStr = event.active.id as string;
    if (taskIdStr.startsWith('task-')) {
      const taskId = parseInt(taskIdStr.replace('task-', ''));
      const task = state.tasks.find(t => t.id === taskId);
      setDraggedTaskId(taskId);
      setDraggedTaskData(task);
    }
  };


  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) {
      setDraggedTaskId(null);
      setDraggedTaskData(null);
      return;
    }

    const taskIdStr = active.id as string;
    const overIdStr = over.id as string;

    if (taskIdStr.startsWith('task-')) {
      const taskId = parseInt(taskIdStr.replace('task-', ''));
      const currentTask = state.tasks.find(t => t.id === taskId);

      if (currentTask) {
        let targetStatus: TaskStatus | null = null;

        // Check if dropped on a column (status)
        if (['backlog', 'progress', 'done'].includes(overIdStr)) {
          targetStatus = overIdStr as TaskStatus;
        }
        // Check if dropped on another task, get its column
        else if (overIdStr.startsWith('task-')) {
          const overTaskId = parseInt(overIdStr.replace('task-', ''));
          const overTask = state.tasks.find(t => t.id === overTaskId);
          if (overTask) {
            targetStatus = overTask.status;
          }
        }

        if (targetStatus) {
          if (currentTask.status !== targetStatus) {
            // Cross-column drag
            if (targetStatus === 'done' && particles) {
              const cx = window.innerWidth / 2;
              const cy = window.innerHeight * 0.5;
              particles.confetti(cx, cy, { count: 60, power: 8 });
            }
            moveTask(taskId, targetStatus);
          } else if (overIdStr.startsWith('task-')) {
            // Within-column reordering
            const overTaskId = parseInt(overIdStr.replace('task-', ''));
            const columnTasksInOrder = state.tasks.filter(t => t.status === currentTask.status);
            const fromIndex = columnTasksInOrder.findIndex(t => t.id === taskId);
            const toIndex = columnTasksInOrder.findIndex(t => t.id === overTaskId);

            if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
              const reordered = [...columnTasksInOrder];
              const [movedTask] = reordered.splice(fromIndex, 1);
              reordered.splice(toIndex, 0, movedTask);

              let reorderedIndex = 0;
              const newTasks = state.tasks.map(t => {
                if (t.status === currentTask.status) {
                  return reordered[reorderedIndex++];
                }
                return t;
              });

              reorderTasks(newTasks);
            }
          }
        }
      }
    }

    setDraggedTaskId(null);
    setDraggedTaskData(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <main style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '22px', padding: '22px 40px 60px', maxWidth: '1320px', margin: '0 auto', alignItems: 'start', flex: '1 1 auto', minHeight: 0, overflowY: 'auto', width: '100%' }}>
        {statuses.map((status, idx) => (
          <TaskColumn
            key={status}
            status={status}
            columnIndex={idx}
            draggedTaskId={draggedTaskId}
            onDragStart={(id) => setDraggedTaskId(id)}
            onDragEnd={() => setDraggedTaskId(null)}
          />
        ))}
      </main>
      <DragOverlay>
        {draggedTaskData ? (
          <div style={{ opacity: 0.95, transform: 'scale(1.05)' }}>
            <TaskCard
              task={draggedTaskData}
              columnIndex={statuses.indexOf(draggedTaskData.status)}
              onDragStart={() => {}}
              onDragEnd={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
