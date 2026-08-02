import { useState, useEffect } from 'react';
import './Tasks.css';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const API_URL = 'http://localhost:5000/tasks';

  const fetchTasks = () => {
    setLoading(true);
    setError(null);
    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch tasks. Is the backend running?');
        return res.json();
      })
      .then(data => setTasks(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsAdding(true);
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTaskTitle, description: newTaskDesc })
    })
      .then(res => res.json())
      .then(newTask => {
        setTasks([...tasks, newTask]);
        setNewTaskTitle('');
        setNewTaskDesc('');
      })
      .catch(err => setError('Error adding task'))
      .finally(() => setIsAdding(false));
  };

  const handleToggleComplete = (id, currentStatus) => {
    fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !currentStatus })
    })
      .then(res => res.json())
      .then(updatedTask => {
        setTasks(tasks.map(t => t.id === id ? updatedTask : t));
      });
  };

  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(() => {
        setTasks(tasks.filter(t => t.id !== id));
      });
  };

  return (
    <div className="tasks-page glass-panel">
      <div className="tasks-header">
        <h1 className="text-gradient">Task Manager</h1>
        <p>Manage your daily goals seamlessly.</p>
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
    </div>
  );
}

export default Tasks;
