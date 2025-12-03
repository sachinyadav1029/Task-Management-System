import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bars3Icon, 
  PlusIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  PencilIcon, 
  TrashIcon,
  XMarkIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { format, isToday, isTomorrow } from 'date-fns';

const TasksPage = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleSidebar,
}) => {
  // Ensure tasks is always an array
  const tasksArray = Array.isArray(tasks) ? tasks : [];

  // Debug: Log when tasks change
  useEffect(() => {
    console.log('TasksPage received updated tasks:', tasksArray.length);
  }, [tasksArray]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    deadline: '',
    reminderMinutes: 10,
    priority: 'medium',
    setTime: 10,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      startDate: '',
      startTime: '',
      deadline: '',
      reminderMinutes: 10,
      priority: 'medium',
      setTime: 10,
    });
    setShowAddForm(false);
    setEditingTask(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.startDate || !formData.startTime || !formData.deadline) {
      setError('Title, start date, start time, and deadline are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const deadlineDate = new Date(formData.deadline);
      if (isNaN(deadlineDate.getTime())) {
        setError('Invalid deadline date format');
        setLoading(false);
        return;
      }

      const taskData = {
        title: formData.title,
        description: formData.description || '',
        startDate: formData.startDate,
        startTime: formData.startTime,
        deadline: deadlineDate.toISOString(),
      reminderMinutes: parseInt(formData.reminderMinutes) || 10,
      priority: formData.priority,
      setTime: parseInt(formData.setTime),
      completed: false,
      };

      if (editingTask) {
        await onUpdateTask(editingTask.id, taskData);
      } else {
        await onAddTask(taskData);
      }

      resetForm();
    } catch (err) {
      // Handle different error response formats
      const errorMessage = err.response?.data?.error ||
                          err.response?.data?.message ||
                          'Failed to save task';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeadlineChange = (e) => {
    setFormData(prev => ({ ...prev, deadline: e.target.value }));
    // Automatically close the modal when deadline is set
    if (e.target.value) {
      setTimeout(() => {
        setShowAddForm(false);
      }, 100);
    }
  };

  const getRemainingTime = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    
    if (diff <= 0) return 'Overdue';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    // Format the deadline for datetime-local input
    const deadlineDate = new Date(task.deadline);
    const formattedDeadline = deadlineDate.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM

    setFormData({
      title: task.title,
      description: task.description || '',
      startDate: task.startDate || '',
      startTime: task.startTime || '',
      deadline: formattedDeadline,
      reminderMinutes: task.reminderMinutes || 10,
      priority: task.priority,
      setTime: task.setTime || 10,
    });
    setShowAddForm(true);
  };

  const filteredTasks = tasksArray.filter(task => {
    switch (filter) {
      case 'completed': return task.completed;
      case 'pending': return !task.completed;
      case 'urgent': 
        return !task.completed && new Date(task.deadline) <= new Date(Date.now() + 24 * 60 * 60 * 1000);
      default: return true;
    }
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'deadline':
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const getTaskPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getTaskDeadlineText = (deadline) => {
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) return 'Invalid date';
    if (isToday(deadlineDate)) return 'Today';
    if (isTomorrow(deadlineDate)) return 'Tomorrow';
    return format(deadlineDate, 'MMM dd, yyyy');
  };

  const getTaskUrgencyColor = (task) => {
    if (task.completed) return 'border-green-200 bg-green-50';
    const now = new Date();
    const deadline = new Date(task.deadline);
    
    if (isNaN(deadline.getTime())) return 'border-gray-200 bg-white';
    
    const hoursUntilDeadline = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilDeadline < 0) return 'border-red-300 bg-red-50';
    if (hoursUntilDeadline < 24) return 'border-orange-300 bg-orange-50';
    if (hoursUntilDeadline < 72) return 'border-yellow-300 bg-yellow-50';
    return 'border-gray-200 bg-white';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onToggleSidebar}
              className="text-gray-600 hover:text-gray-900 lg:hidden mr-4"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="text-lg lg:text-xl font-semibold text-gray-900">Task Management</h1>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Task
          </button>
        </div>
      </div>

      <div className="p-4 lg:p-8">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Filters and Sorting */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="urgent">Urgent</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="deadline">Sort by Deadline</option>
                <option value="priority">Sort by Priority</option>
                <option value="created">Sort by Created</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              Showing {sortedTasks.length} of {tasksArray.length} tasks
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {sortedTasks.map((task, index) => (
              <motion.div
                key={task.id || task._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-lg border-2 p-6 hover:shadow-md transition-all duration-200 ${getTaskUrgencyColor(task)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        console.log('Marking task as completed:', task.id || task._id, { completed: !task.completed });
                        onUpdateTask(task.id || task._id, { completed: !task.completed });
                      }}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        task.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-blue-500'
                      }`}
                    >
                      {task.completed && <CheckCircleIcon className="w-4 h-4" />}
                    </button>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded border ${getTaskPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id || task._id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className={`font-semibold text-lg mb-2 ${
                    task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {getTaskDeadlineText(task.deadline)}
                    </div>
                    <div className="text-sm font-medium text-blue-600">
                      {getRemainingTime(task.deadline)}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    Created {task.createdAt ? format(new Date(task.createdAt), 'MMM dd, yyyy') : 'N/A'}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {sortedTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <ClockIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all' ? 'Get started by creating your first task!' : `No ${filter} tasks at the moment.`}
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Task
            </button>
          </motion.div>
        )}
      </div>

      {/* Add/Edit Task Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                  <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Task Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter task title"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter task description"
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time (HH:MM) *
                    </label>
                    <input
                      id="startTime"
                      type="time"
                      required
                      value={formData.startTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                      Deadline *
                    </label>
                    <input
                      id="deadline"
                      type="datetime-local"
                      required
                      value={formData.deadline}
                      onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label htmlFor="reminderMinutes" className="block text-sm font-medium text-gray-700 mb-1">
                      Reminder (minutes before)
                    </label>
                    <input
                      id="reminderMinutes"
                      type="number"
                      min="0"
                      value={formData.reminderMinutes}
                      onChange={(e) => setFormData(prev => ({ ...prev, reminderMinutes: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="10"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      id="priority"
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="setTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Set Time (minutes)
                    </label>
                    <input
                      id="setTime"
                      type="number"
                      min="1"
                      value={formData.setTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, setTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="10"
                      disabled={loading}
                    />
                  </div>
                </div>





                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mx-2" />
                    ) : editingTask ? (
                      'Update Task'
                    ) : (
                      'Create Task'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TasksPage;