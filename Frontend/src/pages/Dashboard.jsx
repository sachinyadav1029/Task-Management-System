import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Bars3Icon, 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  ChartBarIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { format, isToday, isTomorrow, differenceInHours } from 'date-fns';

const Dashboard = ({ user, tasks, onToggleSidebar }) => {
  // Ensure tasks is always an array
  const tasksArray = Array.isArray(tasks) ? tasks : [];
  
  // Debug: Log when tasks change
  useEffect(() => {
    console.log('Dashboard received updated tasks:', tasksArray.length);
    if (tasksArray.length > 0) {
      console.log('Sample task:', tasksArray[0]);
      // Log task structure for debugging
      console.log('Task deadline type:', typeof tasksArray[0].deadline);
      console.log('Task deadline value:', tasksArray[0].deadline);
      // Log the parsed date
      const parsedDate = new Date(tasksArray[0].deadline);
      console.log('Parsed date:', parsedDate);
      console.log('Parsed date components - Year:', parsedDate.getFullYear(), 'Month:', parsedDate.getMonth(), 'Date:', parsedDate.getDate());
      const today = new Date();
      console.log('Today components - Year:', today.getFullYear(), 'Month:', today.getMonth(), 'Date:', today.getDate());
    }
  }, [tasksArray]);

  const completedTasks = useMemo(() => tasksArray.filter(task => task.completed), [tasksArray]);
  const pendingTasks = useMemo(() => tasksArray.filter(task => !task.completed), [tasksArray]);
  const urgentTasks = useMemo(() => pendingTasks.filter(task => {
    const deadline = new Date(task.deadline);
    return differenceInHours(deadline, new Date()) <= 24 && deadline > new Date();
  }), [pendingTasks]);
  
  // Enhanced today's tasks filtering with better date handling
  const todayTasks = useMemo(() => tasksArray.filter(task => {
    // Handle different date formats
    let taskDeadline;
    if (typeof task.deadline === 'string') {
      // Try to parse the date string
      taskDeadline = new Date(task.deadline);
      // If parsing failed, try with ISO format
      if (isNaN(taskDeadline.getTime())) {
        taskDeadline = new Date(task.deadline.replace(' ', 'T'));
      }
    } else if (task.deadline instanceof Date) {
      taskDeadline = task.deadline;
    } else {
      // If it's a timestamp or other format
      taskDeadline = new Date(task.deadline);
    }
    
    // Check if the date is valid
    if (isNaN(taskDeadline.getTime())) {
      console.log('Invalid date for task:', task.title, task.deadline);
      return false;
    }
    
    // Compare dates by year, month, and day to ignore time and timezone differences
    const today = new Date();
    const isTaskToday = taskDeadline.getFullYear() === today.getFullYear() &&
                       taskDeadline.getMonth() === today.getMonth() &&
                       taskDeadline.getDate() === today.getDate();
    
    console.log('Task deadline check:', task.title, taskDeadline, 'isToday:', isTaskToday);
    return isTaskToday;
  }), [tasksArray]);

  // Debug: Log today's tasks
  useEffect(() => {
    console.log('Today\'s tasks updated:', todayTasks.length);
    if (todayTasks.length > 0) {
      console.log('Today\'s tasks:', todayTasks);
    }
  }, [todayTasks]);

  const completionRate = useMemo(() => tasksArray.length > 0
    ? Math.round((completedTasks.length / tasksArray.length) * 100)
    : 0, [tasksArray, completedTasks]);

  const stats = useMemo(() => [
    {
      title: 'Tasks Completed',
      value: completedTasks.length,
      icon: CheckCircleIcon,
      color: 'blue',
      description: `Out of ${tasksArray.length} total tasks`
    },
    {
      title: 'Pending Tasks',
      value: pendingTasks.length,
      icon: ClockIcon,
      color: 'yellow',
      description: 'Tasks remaining to complete'
    },
    {
      title: 'Urgent Tasks',
      value: urgentTasks.length,
      icon: ExclamationTriangleIcon,
      color: 'red',
      description: 'Due within 24 hours'
    },
  ], [completedTasks, pendingTasks, urgentTasks, tasksArray]);

  const getTaskPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTaskDeadlineText = (deadline) => {
    if (isToday(deadline)) return 'Due today';
    if (isTomorrow(deadline)) return 'Due tomorrow';
    return `Due ${format(deadline, 'MMM dd')}`;
  };

  // Create a key based on task IDs and completion status
  const dashboardKey = useMemo(() => {
    return tasksArray.map(task => `${task.id || task._id}-${task.completed}`).join('-');
  }, [tasksArray]);

  return (
    <div className="min-h-screen bg-gray-50" key={`dashboard-${dashboardKey}`}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
        <div className="px-4 py-4 flex items-center justify-between">
          <button
            onClick={onToggleSidebar}
            className="text-gray-600 hover:text-gray-900"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          <div></div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 lg:mb-8"
        >
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Here's what's happening with your tasks today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 lg:mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5 lg:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">{stat.description}</p>
                </div>
                <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ml-3 ${
                  stat.color === 'blue' ? 'bg-blue-100' :
                  stat.color === 'yellow' ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                  }`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8 mb-6 lg:mb-8">
          {/* Progress Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5 lg:p-6"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Progress Overview</h2>
              <ChartBarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            
            {tasksArray.length === 0 ? (
              <p className="text-gray-500 text-xs sm:text-sm">No progress to show yet. Add some tasks to get started!</p>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Overall Completion</span>
                    <span className="text-xs sm:text-sm text-gray-500">{completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                    <div 
                      className="bg-blue-600 h-2 sm:h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                  <div className="text-center p-2 sm:p-3 lg:p-4 bg-green-50 rounded-lg">
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{completedTasks.length}</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Completed</p>
                  </div>
                  <div className="text-center p-2 sm:p-3 lg:p-4 bg-yellow-50 rounded-lg">
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600">{pendingTasks.length}</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">In Progress</p>
                  </div>
                  <div className="text-center p-2 sm:p-3 lg:p-4 bg-red-50 rounded-lg">
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">{urgentTasks.length}</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Urgent</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Today's Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5 lg:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Today's Tasks</h2>
              <CalendarDaysIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            
            <div className="space-y-2 sm:space-y-3">
              {todayTasks.length === 0 ? (
                <p className="text-gray-500 text-xs sm:text-sm">No tasks due today</p>
              ) : (
                todayTasks.slice(0, 4).map(task => (
                  <div
                    key={task.id}
                    className="flex items-center space-x-2 sm:space-x-3 p-2 rounded-lg hover:bg-gray-50"
                  >
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0 ${
                      task.completed ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs sm:text-sm font-medium truncate ${
                        task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </p>
                      <div className="flex items-center space-x-1 sm:space-x-2 mt-1">
                        <span className={`inline-block px-1.5 py-0.5 text-xs font-medium rounded ${getTaskPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-gray-500 truncate">{getTaskDeadlineText(new Date(task.deadline))}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;