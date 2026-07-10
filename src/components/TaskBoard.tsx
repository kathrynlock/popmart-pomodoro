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
  const [hoveredColumn, setHoveredColumn] = useState<TaskStatus | null>(null);
  const [dropTarget, setDropTarget] = useState<{ status: TaskStatus; taskId: number | null } | null>(null);
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


  const handleDragMove = ({ active, over }: any) => {
    if (!over) {
      setHoveredColumn(null);
      setDropTarget(null);
      return;
    }

    const overIdStr = over.id as string;
    const taskIdStr = active.id as string;

    if (!taskIdStr.startsWith('task-')) return;

    const taskId = parseInt(taskIdStr.replace('task-', ''));
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    let targetStatus: TaskStatus | null = null;
    let targetTaskId: number | null = null;

    // Check if over a column
    if (['backlog', 'progress', 'done'].includes(overIdStr)) {
      targetStatus = overIdStr as TaskStatus;
      setHoveredColumn(targetStatus);
    }
    // Check if over a task
    else if (overIdStr.startsWith('task-')) {
      targetTaskId = parseInt(overIdStr.replace('task-', ''));
      const overTask = state.tasks.find(t => t.id === targetTaskId);
      if (overTask) {
        targetStatus = overTask.status;
        setHoveredColumn(targetStatus);
      }
    }

    if (targetStatus) {
      setDropTarget({ status: targetStatus, taskId: targetTaskId });
    }
  };

  const handleDragEnd = () => {
    if (draggedTaskId !== null && dropTarget) {
      const task = state.tasks.find(t => t.id === draggedTaskId);
      if (task) {
        const targetStatus = dropTarget.status;

        // Only perform move if target is different from current status
        if (task.status !== targetStatus) {
          if (dropTarget.taskId) {
            // Drop before specific task
            const targetColumnTasks = state.tasks.filter(t => t.status === targetStatus);
            const targetIndex = targetColumnTasks.findIndex(t => t.id === dropTarget.taskId);

            if (targetIndex >= 0) {
              const newTasks = state.tasks.filter(t => t.id !== draggedTaskId);
              const insertIndex = newTasks.findIndex(t => t.id === dropTarget.taskId);
              if (insertIndex >= 0) {
                newTasks.splice(insertIndex, 0, { ...task, status: targetStatus });
                reorderTasks(newTasks);

                // Trigger confetti only on actual drop to done
                if (targetStatus === 'done' && particles) {
                  const cx = window.innerWidth / 2;
                  const cy = window.innerHeight * 0.5;
                  particles.confetti(cx, cy, { count: 60, power: 8 });
                }
              }
            }
          } else {
            // Drop at end of column
            moveTask(draggedTaskId, targetStatus);

            // Trigger confetti only on actual drop to done
            if (targetStatus === 'done' && particles) {
              const cx = window.innerWidth / 2;
              const cy = window.innerHeight * 0.5;
              particles.confetti(cx, cy, { count: 60, power: 8 });
            }
          }
        } else if (dropTarget.taskId && dropTarget.taskId !== draggedTaskId) {
          // Within same column - reorder
          const columnTasks = state.tasks.filter(t => t.status === targetStatus);
          const fromIndex = columnTasks.findIndex(t => t.id === draggedTaskId);
          const toIndex = columnTasks.findIndex(t => t.id === dropTarget.taskId);

          if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
            const reordered = [...columnTasks];
            const [movedTask] = reordered.splice(fromIndex, 1);
            reordered.splice(toIndex, 0, movedTask);

            let reorderedIndex = 0;
            const newTasks = state.tasks.map(t => {
              if (t.status === targetStatus) {
                return reordered[reorderedIndex++];
              }
              return t;
            });

            reorderTasks(newTasks);
          }
        }
      }
    }

    setHoveredColumn(null);
    setDraggedTaskId(null);
    setDraggedTaskData(null);
    setDropTarget(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      <main style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '22px', padding: '22px 40px 60px', maxWidth: '1320px', margin: '0 auto', alignItems: 'stretch', flex: '1 1 auto', minHeight: 0, overflowY: 'auto', width: '100%' }}>
        {statuses.map((status, idx) => (
          <TaskColumn
            key={status}
            status={status}
            columnIndex={idx}
            draggedTaskId={draggedTaskId}
            hoveredColumn={hoveredColumn}
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
