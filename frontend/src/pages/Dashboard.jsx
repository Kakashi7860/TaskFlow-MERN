import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { tasksAPI } from '../utils/api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await tasksAPI.getTasks();
      setTasks(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await tasksAPI.createTask(taskData);
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await tasksAPI.updateTask(editingTask._id, taskData);
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.deleteTask(taskId);
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await tasksAPI.updateTask(taskId, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Tasks</h3>
            <p className="text-3xl font-bold text-gray-800">{taskStats.total}</p>
          </div>
          <div className="bg-blue-50 rounded-lg shadow p-6">
            <h3 className="text-blue-600 text-sm font-medium">To Do</h3>
            <p className="text-3xl font-bold text-blue-800">{taskStats.todo}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-6">
            <h3 className="text-yellow-600 text-sm font-medium">In Progress</h3>
            <p className="text-3xl font-bold text-yellow-800">{taskStats.inProgress}</p>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-6">
            <h3 className="text-green-600 text-sm font-medium">Completed</h3>
            <p className="text-3xl font-bold text-green-800">{taskStats.completed}</p>
          </div>
        </div>

        {/* Task Form */}
        <TaskForm
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          initialData={editingTask}
          onCancel={() => setEditingTask(null)}
        />

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Tasks
          </button>
          <button
            onClick={() => setFilter('todo')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'todo'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            To Do
          </button>
          <button
            onClick={() => setFilter('in-progress')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'in-progress'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'completed'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Tasks Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No tasks found. Create your first task above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;