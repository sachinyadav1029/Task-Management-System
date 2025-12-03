import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ user, isOpen, onClose, onLogout }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Tasks', href: '/tasks', icon: ClipboardDocumentListIcon },
    { name: 'Profile', href: '/profile', icon: UserCircleIcon },
    { name: 'About', href: '/about', icon: InformationCircleIcon },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: window.innerWidth >= 1024 ? 0 : isOpen ? 0 : -300,
        }}
        transition={{ duration: 0.3 }}
        className={`
    fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl
    transform transition-transform duration-300 ease-in-out
    lg:static lg:inset-0
  `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link to="/" className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">TaskFlow</span>
            </Link>
            <button onClick={onClose} className="lg:hidden">
              <XMarkIcon className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <UserCircleIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>

            {/* Tasks Info (Coins removed) */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-left">
                <p className="text-xs text-gray-500">Tasks</p>
                <p className="text-sm font-medium text-gray-900">{user.tasksCompleted}/{user.tasksTotal}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={onClose}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
