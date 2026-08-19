import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../api';
import Auth from './Auth';
import './Tasks.css';

function Tasks() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTasks = () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    getTasks()
      .then(data => setTasks(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const handleAuthError = () => {
      setIsAuthenticated(false);
      showToast('Session expired. Please log in again.', 'error');
    };
    
    window.addEventListener('auth_error', handleAuthError);
    return () => window.removeEventListener('auth_error', handleAuthError);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setTasks([]);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const tempId = Date.now().toString();
    const newTask = {
      id: tempId,
      title: newTaskTitle,
      description: newTaskDesc,
      completed: false
    };

    // Optimistic UI Update
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setIsAdding(true);

    createTask(newTask)
      .then(createdTask => {
        setTasks(prev => prev.map(t => t.id === tempId ? createdTask : t));
        showToast('Task added successfully!');
      })
      .catch(err => {
        // Revert on error
        setTasks(prev => prev.filter(t => t.id !== tempId));
        showToast(err.message || 'Error adding task', 'error');
      })
      .finally(() => setIsAdding(false));
  };

  const handleToggleComplete = (id, currentStatus) => {
    // Optimistic Update
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));
    
    updateTask(id, { completed: !currentStatus })
      .then(updatedTask => {
        setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
        showToast('Task updated!');
      })
      .catch(err => {
        // Revert
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: currentStatus } : t));
        showToast('Error updating task', 'error');
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    // Optimistic Update
    const previousTasks = [...tasks];
    setTasks(tasks.filter(t => t.id !== id));

    deleteTask(id)
      .then(() => {
        showToast('Task deleted!');
      })
      .catch(err => {
        setTasks(previousTasks);
        showToast('Error deleting task', 'error');
      });
  };

  if (!isAuthenticated) {
    return (
      <div className="tasks-page glass-panel">
        <div className="tasks-header">
          <h1 className="text-gradient">Task Manager</h1>
          <p>Please log in to manage your tasks.</p>
        </div>
        <Auth onAuthSuccess={() => setIsAuthenticated(true)} />
      </div>
    );
  }

  return (
    <div className="tasks-page glass-panel">
      <div className="tasks-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-gradient">Task Manager</h1>
          <p>Manage your daily goals seamlessly.</p>
        </div>
        <button onClick={handleLogout} className="logout-btn" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--text-secondary)', color: 'var(--text-secondary)', borderRadius: '6px', cursor: 'pointer' }}>
          Log Out
        </button>
      </div>

      <form className="task-form" onSubmit={handleAddTask}>
        <div className="input-group">
          <input 
            type="text" 
            placeholder="What needs to be done?" 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            disabled={isAdding}
            required
          />
          <input 
            type="text" 
            placeholder="Details (Optional)" 
            value={newTaskDesc}
            onChange={(e) => setNewTaskDesc(e.target.value)}
            disabled={isAdding}
          />
        </div>
        <button type="submit" className="add-btn" disabled={isAdding || !newTaskTitle.trim()}>
          {isAdding ? 'Adding...' : 'Add Task'}
        </button>
      </form>

      {loading ? (
        <div className="loading-state">Loading tasks...</div>
      ) : error ? (
        <div className="error-state">
          ⚠️ {error}
          <button onClick={fetchTasks} className="retry-btn">Retry</button>
        </div>
      ) : (
        <div className="tasks-list">
          {tasks.length === 0 ? (
            <div className="empty-state">No tasks yet. Enjoy your day! 🎉</div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <div className="task-checkbox" onClick={() => handleToggleComplete(task.id, task.completed)}>
                  {task.completed && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                </div>
                <div className="task-content">
                  <h3 className="task-title">{task.title}</h3>
                  {task.description && <p className="task-desc">{task.description}</p>}
                </div>
                <button className="delete-btn" onClick={() => handleDelete(task.id)} aria-label="Delete task">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                </button>
              </div>
            ))
          )}
        </div>
      )}
      
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            {toast.type === 'success' ? '✅' : '❌'} {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
