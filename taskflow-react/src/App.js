import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [draggedTask, setDraggedTask] = useState(null);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const data = JSON.parse(savedTasks);
      // Convert the stored data back to task objects
      const allTasks = [];
      Object.keys(data).forEach(column => {
        data[column].forEach(task => {
          allTasks.push({
            ...task,
            status: column
          });
        });
      });
      setTasks(allTasks);
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      const tasksByColumn = {
        todo: tasks.filter(task => task.status === 'todo'),
        progress: tasks.filter(task => task.status === 'progress'),
        done: tasks.filter(task => task.status === 'done')
      };
      localStorage.setItem('tasks', JSON.stringify(tasksByColumn));
    }
  }, [tasks]);

  const addTask = () => {
    if (title.trim()) {
      const newTask = {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        status: 'todo'
      };
      setTasks([...tasks, newTask]);
      setTitle('');
      setDescription('');
      setShowModal(false);
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedTask) {
      setTasks(tasks.map(task => 
        task.id === draggedTask.id 
          ? { ...task, status: newStatus }
          : task
      ));
      setDraggedTask(null);
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="App">
      <main>
        <nav>
          <div className="Left">TaskFlow</div>
          <div className="Right">
            <button onClick={() => setShowModal(true)}>Add Task</button>
          </div>
        </nav>
        
        <section className="board">
          <div 
            className="task-column" 
            id="todo"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'todo')}
          >
            <div className="heading">
              <div className="left">To Do</div>
              <div className="right">{getTasksByStatus('todo').length}</div>
            </div>
            {getTasksByStatus('todo').map(task => (
              <Task 
                key={task.id} 
                task={task} 
                onDelete={deleteTask}
                onDragStart={handleDragStart}
              />
            ))}
          </div>

          <div 
            className="task-column" 
            id="progress"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'progress')}
          >
            <div className="heading">
              <div className="left">In Progress</div>
              <div className="right">{getTasksByStatus('progress').length}</div>
            </div>
            {getTasksByStatus('progress').map(task => (
              <Task 
                key={task.id} 
                task={task} 
                onDelete={deleteTask}
                onDragStart={handleDragStart}
              />
            ))}
          </div>

          <div 
            className="task-column" 
            id="done"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'done')}
          >
            <div className="heading">
              <div className="left">Done</div>
              <div className="right">{getTasksByStatus('done').length}</div>
            </div>
            {getTasksByStatus('done').map(task => (
              <Task 
                key={task.id} 
                task={task} 
                onDelete={deleteTask}
                onDragStart={handleDragStart}
              />
            ))}
          </div>
        </section>
      </main>

      {showModal && (
        <div className="modal active">
          <div className="bg" onClick={() => setShowModal(false)}></div>
          <div className="center">
            <input 
              type="text" 
              placeholder="Task Title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea 
              placeholder="Task Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              cols="30" 
              rows="10"
            />
            <button onClick={addTask}>Add Task</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Task({ task, onDelete, onDragStart }) {
  return (
    <div 
      className="task" 
      draggable
      onDragStart={() => onDragStart(task)}
    >
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </div>
  );
}

export default App;
