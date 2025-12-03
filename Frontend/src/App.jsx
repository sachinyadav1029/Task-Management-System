import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import axios from "axios";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import TasksPage from "./pages/TasksPage";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Bars3Icon } from '@heroicons/react/24/outline';

const API = import.meta.env.VITE_API_URL;

function AppContent() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);

  // Debug: Monitor tasks state changes
  useEffect(() => {
    console.log('Tasks state changed:', tasks.length, 'tasks');
    if (tasks.length > 0) {
      console.log('First task sample:', tasks[0]);
    }
  }, [tasks]);

  // Update user task counts when tasks change
  useEffect(() => {
    if (user) {
      const completedTasks = Array.isArray(tasks) ? tasks.filter(task => task.completed).length : 0;
      const totalTasks = Array.isArray(tasks) ? tasks.length : 0;
      
      // Only update if counts actually changed to prevent infinite loops
      if (user.tasksCompleted !== completedTasks || user.tasksTotal !== totalTasks) {
        console.log('Updating user task counts:', { completedTasks, totalTasks });
        setUser(prev => ({
          ...prev,
          tasksCompleted: completedTasks,
          tasksTotal: totalTasks,
        }));
      }
    }
  }, [tasks, user]); // Include user in dependencies but with conditional update

  // Fetch tasks when user becomes authenticated (handles page refresh)
  useEffect(() => {
    if (user && user.id) {
      console.log('User authenticated, fetching tasks...');
      fetchTasks();
    }
  }, [user]);

  // Periodically refresh tasks every 30 seconds to ensure dashboard stays updated
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      console.log('Periodically refreshing tasks...');
      fetchTasks();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  const fetchUserData = async (token) => {
    if (!token || typeof token !== 'string' || token.length < 10) {
      console.log('Invalid token found, clearing localStorage');
      localStorage.removeItem('token');
      setLoading(false);
      return;
    }

    try {
      console.log('Validating token:', token.substring(0, 20) + '...');
      const response = await axios.get(`${API}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const userData = response.data;
      
      // Only update user if it's different from current user
      if (!user || user.id !== userData.id || user.email !== userData.email) {
        console.log('User data received:', userData);
        setUser({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          tasksCompleted: 0,
          tasksTotal: 0,
        });
        console.log('User set from token validation:', userData);
      } else {
        console.log('User data unchanged, skipping update');
      }

      // Fetch user's tasks
      await fetchTasks(token);
    } catch (error) {
      console.error('Token validation failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (token = localStorage.getItem('token')) => {
    if (!token) {
      console.log('No token available for fetching tasks');
      return;
    }

    try {
      console.log('Fetching tasks with token:', token.substring(0, 20) + '...');
      const response = await axios.get(`${API}/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Tasks API response:', response.data);

      // Handle paginated response from backend
      const tasksData = response.data.tasks || response.data || [];
      console.log('Setting tasks:', tasksData.length, 'tasks');
      
      // Log task structure for debugging
      if (tasksData.length > 0) {
        console.log('Task structure sample:', tasksData[0]);
        // Log the deadline format specifically
        console.log('Task deadline format:', tasksData[0].deadline, typeof tasksData[0].deadline);
      }
      
      // Always update tasks state to trigger re-renders
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      console.error('Error response:', error.response?.data);
      // Set empty array on error to maintain consistent state
      setTasks([]);
    }
  };

  // Login function
  const login = async (userData, token) => {
    console.log('Login function called with:', { userData, tokenLength: token?.length });

    // Store token in localStorage
    if (token && typeof token === 'string' && token.length > 10) {
      localStorage.setItem('token', token);
      console.log('Token stored:', token.substring(0, 20) + '...');
    } else {
      console.error('Invalid token received:', token);
      return;
    }

    // Only update user if it's different from current user
    if (!user || user.id !== userData.id || user.email !== userData.email) {
      const newUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        tasksCompleted: 0,
        tasksTotal: 0,
      };
      setUser(newUser);
      console.log('User set after login:', newUser);
    } else {
      console.log('User already set, skipping update');
    }

    // Fetch user's tasks after login
    console.log('About to fetch tasks after login...');
    await fetchTasks(token);
    console.log('Tasks fetch completed after login');
  };

  const logout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    setUser(null);
    setTasks([]);
  };

  const onAddTask = async (taskData) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Adding task with data:', taskData);
      console.log('Using token:', token?.substring(0, 20) + '...');
      console.log('Task deadline being sent:', taskData.deadline, typeof taskData.deadline);

      const response = await axios.post(`${API}/tasks`, taskData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Task creation response:', response.data);
      console.log('Task deadline received from backend:', response.data.deadline, typeof response.data.deadline);

      // Update local state with the new task only if it doesn't already exist
      setTasks(prev => {
        const prevArray = Array.isArray(prev) ? prev : [];
        // Check if task already exists
        const taskExists = prevArray.some(task => task._id === response.data._id);
        if (taskExists) {
          console.log('Task already exists in state, skipping update');
          return prevArray;
        }
        const newTasks = [...prevArray, response.data];
        console.log('Updated tasks state with new task:', newTasks.length, 'total tasks');
        return newTasks;
      });
    } catch (error) {
      console.error('Failed to add task:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Updating task:', id, 'with updates:', updates);

      const response = await axios.put(`${API}/tasks/${id}`, updates, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Task update response:', response.data);

      // Update local state with the updated task
      setTasks((prev) => {
        const prevArray = Array.isArray(prev) ? prev : [];
        const taskIndex = prevArray.findIndex((task) => task._id === id || task.id === id);
        
        if (taskIndex === -1) {
          console.log('Task not found in state, returning previous state');
          return prevArray;
        }
        
        // Create a new array with the updated task
        const updatedTasks = [...prevArray];
        updatedTasks[taskIndex] = response.data;
        console.log('Updated tasks state after update:', updatedTasks.length, 'tasks');
        console.log('Updated task:', response.data);
        
        // Log the before and after of the updated task
        console.log('Before update:', prevArray[taskIndex]);
        console.log('After update:', response.data);
        
        // Log all tasks to see the complete state
        console.log('All tasks after update:', updatedTasks);
        
        return updatedTasks;
      });
    } catch (error) {
      console.error('Failed to update task:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Deleting task:', id);

      await axios.delete(`${API}/tasks/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Task deleted successfully from API');

      // Update local state
      setTasks((prev) => {
        const prevArray = Array.isArray(prev) ? prev : [];
        const updatedTasks = prevArray.filter((task) => task._id !== id && task.id !== id);
        console.log('Updated tasks state after delete:', updatedTasks.length, 'tasks');
        return updatedTasks;
      });
    } catch (error) {
      console.error('Failed to delete task:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Check if this is a delete account request
      if (profileData.deleteAccount) {
        return await deleteUser();
      }

      const response = await axios.put(`${API}/auth/profile`, profileData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Update user state with new profile data
      if (user) {
        setUser({
          ...user,
          ...response.data
        });
      }

      return response.data;
    } catch (error) {
      console.error('Failed to update profile:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  };

  // Add delete user function
  const deleteUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.delete(`${API}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('User deleted successfully:', response.data);
      
      // Log out the user after deletion
      logout();
      
      return response.data;
    } catch (error) {
      console.error('Failed to delete user:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  };

  const isAuthenticated = !!user;
  const showSidebar = isAuthenticated && location.pathname !== "/";

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!showSidebar && <Navbar user={user} onLogout={logout} />}

      <div className="flex">
        {isAuthenticated && location.pathname !== "/" && (
          <>
            <Sidebar
              user={user}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              onLogout={logout}
            />

            {/* Hamburger button (mobile only) */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="absolute top-4 left-4 z-50 p-2 rounded-md bg-white shadow lg:hidden"
            >
              <Bars3Icon className="h-6 w-6 text-gray-700" />
            </button>
          </>
        )}

        <main className={`flex-1 ${isAuthenticated && location.pathname !== "/" ? "lg:ml-0" : ""}`}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* ✅ Landing Page is the first page */}
              <Route path="/" element={<LandingPage />} />

              <Route
                path="/login"
                element={
                  !isAuthenticated ? (
                    <LoginPage onLogin={login} />
                  ) : (
                    <Navigate to="/dashboard" replace />
                  )
                }
              />
              <Route
                path="/signup"
                element={
                  !isAuthenticated ? (
                    <SignupPage onSignup={login} />
                  ) : (
                    <Navigate to="/dashboard" replace />
                  )
                }
              />
              <Route
                path="/dashboard"
                element={
                  isAuthenticated ? (
                    <Dashboard
                      user={user}
                      tasks={tasks}
                      onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/tasks"
                element={
                  isAuthenticated ? (
                    <TasksPage
                      tasks={tasks}
                      onAddTask={onAddTask} // Fixed: changed addTask to onAddTask
                      onUpdateTask={updateTask}
                      onDeleteTask={deleteTask}
                      onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/profile"
                element={
                  isAuthenticated ? (
                    <ProfilePage
                      user={user}
                      tasks={tasks}
                      onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                      onUpdateProfile={updateProfile} // Add this prop
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}