import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bars3Icon, 
  UserCircleIcon,
  CameraIcon,
  TrophyIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isYesterday, subDays } from 'date-fns';

const ProfilePage = ({ user, tasks, onToggleSidebar, onUpdateProfile }) => {
  const [profileImage, setProfileImage] = useState(user?.profilePicture || null);
  const [isUploading, setIsUploading] = useState(false);
  
  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  
  // Calculate actual streak based on task completion dates
  const calculateStreak = () => {
    if (tasks.length === 0) return 0;
    
    // Get all unique dates when tasks were completed
    const completedDates = [...new Set(
      completedTasks
        .filter(task => task.completedAt || task.updatedAt)
        .map(task => {
          const date = new Date(task.completedAt || task.updatedAt);
          return date.toDateString();
        })
    )];
    
    if (completedDates.length === 0) return 0;
    
    // Sort dates and count consecutive days
    const sortedDates = completedDates
      .map(dateStr => new Date(dateStr))
      .sort((a, b) => b - a); // Sort descending (newest first)
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    // Check if user completed tasks today or yesterday to start streak
    const hasToday = completedDates.includes(currentDate.toDateString());
    const hasYesterday = completedDates.includes(new Date(subDays(currentDate, 1)).toDateString());
    
    if (!hasToday && !hasYesterday) return 0;
    
    // Count consecutive days
    while (true) {
      const currentDateString = currentDate.toDateString();
      if (completedDates.includes(currentDateString)) {
        streak++;
        currentDate = subDays(currentDate, 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Monthly stats (safe for empty tasks)
  const getMonthlyData = () => {
    const currentMonth = new Date();
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    return daysInMonth.map(day => {
      const tasksOnDay = tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate.toDateString() === day.toDateString();
      });
      
      return {
        date: day,
        tasks: tasksOnDay.length,
        completed: tasksOnDay.filter(t => t.completed).length
      };
    });
  };

  const monthlyData = getMonthlyData();
  const streak = calculateStreak();
  const averageTasksPerWeek = tasks.length > 0 ? Math.round(tasks.length / 4) : 0;

  const achievements = [
    {
      title: 'Task Master',
      description: 'Completed 10 tasks',
      earned: completedTasks.length >= 10,
      icon: TrophyIcon,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      title: 'Consistent',
      description: `${streak}-day streak`,
      earned: streak >= 3,
      icon: CalendarDaysIcon,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Efficient',
      description: '90% completion rate',
      earned: tasks.length > 0 && (completedTasks.length / tasks.length) >= 0.9,
      icon: ChartBarIcon,
      color: 'text-purple-600 bg-purple-100'
    },
  ];

  const stats = [
    {
      label: 'Total Tasks',
      value: tasks.length,
      icon: CheckCircleIcon,
      color: 'text-blue-600'
    },
    {
      label: 'Completed',
      value: completedTasks.length,
      icon: CheckCircleIcon,
      color: 'text-green-600'
    },
    {
      label: 'In Progress',
      value: pendingTasks.length,
      icon: ClockIcon,
      color: 'text-yellow-600'
    },
  ];

  // Handle profile image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target.result;
        setProfileImage(imageData);
        
        // Update profile on backend
        try {
          await onUpdateProfile({ profilePicture: imageData });
        } catch (error) {
          console.error('Failed to update profile picture:', error);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
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
            <h1 className="text-lg lg:text-xl font-semibold text-gray-900">Profile</h1>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="h-12 w-12 text-blue-600" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow cursor-pointer hover:bg-gray-50">
                <CameraIcon className="h-4 w-4 text-gray-600" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </label>
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                </div>
              )}
            </div>
            
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600 mb-4">{user.email}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {stats.map(stat => (
                  <div key={stat.label} className="text-center">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 mb-2`}>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center mb-6">
              <TrophyIcon className="h-6 w-6 text-yellow-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
            </div>
            
            <div className="space-y-4">
              {achievements.map(achievement => (
                <div
                  key={achievement.title}
                  className={`flex items-center p-4 rounded-lg border-2 transition-all ${
                    achievement.earned
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    achievement.earned ? achievement.color : 'text-gray-400 bg-gray-100'
                  }`}>
                    <achievement.icon className="h-6 w-6" />
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <div className="flex items-center">
                      <h4 className={`font-medium ${
                        achievement.earned ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {achievement.title}
                      </h4>
                      {achievement.earned && (
                        <CheckCircleIcon className="h-5 w-5 text-green-500 ml-2" />
                      )}
                    </div>
                    <p className={`text-sm ${
                      achievement.earned ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Activity Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center mb-6">
              <ChartBarIcon className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Activity Stats</h3>
            </div>
            
            <div className="space-y-6">
              {/* Completion Rate */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Completion Rate</span>
                  <span className="text-sm text-gray-500">
                    {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>

              {/* Weekly Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{streak}</p>
                  <p className="text-sm text-gray-600">Day Streak</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{averageTasksPerWeek}</p>
                  <p className="text-sm text-gray-600">Avg/Week</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h4>
                <div className="space-y-2">
                  {tasks.length > 0 ? (
                    tasks.slice(0, 3).map(task => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-3 ${
                            task.completed ? 'bg-green-500' : 'bg-yellow-500'
                          }`}></div>
                          <span className={`text-sm ${
                            task.completed ? 'line-through text-gray-500' : 'text-gray-700'
                          }`}>
                            {task.title}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {task.createdAt ? format(new Date(task.createdAt), 'MMM dd') : 'N/A'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No recent activity</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Delete Account */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-lg shadow-sm border border-red-200 p-6 mt-8"
        >
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
              <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
          </div>
          
          <p className="text-gray-600 text-sm mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
            All your tasks will also be deleted.
          </p>
          
          <button
            onClick={async () => {
              if (window.confirm('Are you sure you want to delete your account? This action cannot be undone and all your tasks will be permanently deleted.')) {
                try {
                  await onUpdateProfile({ deleteAccount: true }); // This will trigger the delete in App.jsx
                } catch (error) {
                  console.error('Failed to delete account:', error);
                  alert('Failed to delete account. Please try again.');
                }
              }
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Delete Account
          </button>
        </motion.div>

        {/* Task History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Task History</h3>
            <span className="text-sm text-gray-500">{tasks.length} total tasks</span>
          </div>
          
          {tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.slice(0, 8).map(task => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      task.completed ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                    <div>
                      <p className={`font-medium ${
                        task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {task.createdAt ? `Created ${format(new Date(task.createdAt), 'MMM dd, yyyy')}` : 'Created N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircleIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No tasks created yet</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;