
import { useAppState, useAppActions } from '../../context/AppContext';

const COLS = {
  backlog: { emoji: '📝', title: 'backlog' },
  progress: { emoji: '⚡', title: 'in progress' },
  done: { emoji: '✓', title: 'done' },
};

export function AddTaskModal() {
  const { state } = useAppState();
  const { closeAddTask, updateNewTask, addTask } = useAppActions();

  if (!state.showAddTask) return null;

  const col = COLS[state.addTarget];
  const nextId = Math.max(0, ...state.tasks.map(t => t.id)) + 1;

  const handleSubmit = () => {
    const title = state.newTaskTitle.trim();
    if (!title) return;
    addTask({
      id: nextId,
      title,
      desc: state.newTaskDesc.trim(),
      status: state.addTarget,
    });
    closeAddTask();
  };

  return (
    <div
      onClick={closeAddTask}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 70,
        background: 'rgba(74, 59, 82, 0.32)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'ffFade 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '30px',
          padding: '32px 34px',
          width: '440px',
          maxWidth: '100%',
          boxShadow: '0 30px 70px rgba(74, 59, 82, 0.28)',
          animation: 'ffModalIn 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.2)',
        }}
      >
        <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: '24px' }}>
          a new little task {col.emoji}
        </div>
        <div style={{ fontSize: '13px', color: '#A695AE', fontWeight: 700, marginTop: '2px' }}>
          adding to {col.title}
        </div>

        <input
          type="text"
          value={state.newTaskTitle}
          onChange={(e) => updateNewTask(e.target.value, undefined)}
          placeholder="what needs doing?"
          style={{
            width: '100%',
            marginTop: '18px',
            border: '2px solid #EEE4F2',
            borderRadius: '16px',
            padding: '13px 15px',
            fontSize: '15px',
            fontWeight: 700,
            color: '#4A3B52',
            outline: 'none',
            background: '#FCFAFE',
            transition: 'all 0.2s ease',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#D3B6F0'; e.currentTarget.style.background = '#fff'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = '#EEE4F2'; e.currentTarget.style.background = '#FCFAFE'; }}
        />

        <textarea
          value={state.newTaskDesc}
          onChange={(e) => updateNewTask(undefined, e.target.value)}
          placeholder="a note or two (optional)"
          rows={3}
          style={{
            width: '100%',
            marginTop: '12px',
            border: '2px solid #EEE4F2',
            borderRadius: '16px',
            padding: '13px 15px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#4A3B52',
            outline: 'none',
            resize: 'none',
            background: '#FCFAFE',
            transition: 'all 0.2s ease',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#D3B6F0'; e.currentTarget.style.background = '#fff'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = '#EEE4F2'; e.currentTarget.style.background = '#FCFAFE'; }}
        />

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button
            onClick={closeAddTask}
            style={{
              flex: 1,
              border: 'none',
              cursor: 'pointer',
              background: '#F4EEF8',
              color: '#9B84A6',
              borderRadius: '16px',
              padding: '14px',
              fontWeight: 900,
              fontSize: '15px',
              transition: 'background 0.2s ease',
            }}
          >
            cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              flex: 2,
              border: 'none',
              cursor: 'pointer',
              background: '#F5A0C4',
              color: '#fff',
              borderRadius: '16px',
              padding: '14px',
              fontWeight: 900,
              fontSize: '15px',
              boxShadow: '0 6px 0 #E27FAB',
              transition: 'all 0.12s ease',
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(3px)'; e.currentTarget.style.boxShadow = '0 3px 0 #E27FAB'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 6px 0 #E27FAB'; }}
          >
            add it
          </button>
        </div>
      </div>
    </div>
  );
}
