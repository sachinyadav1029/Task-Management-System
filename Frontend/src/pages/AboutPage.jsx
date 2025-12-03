import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon,
  CurrencyDollarIcon,
  BellIcon,
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  HeartIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

const AboutPage = () => {
  const features = [
    {
      icon: CheckCircleIcon,
      title: 'Smart Task Management',
      description: 'Create, organize, and track your tasks with intelligent deadline management and priority settings.',
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Gamified Rewards',
      description: 'Earn coins for completing tasks on time and stay motivated with our reward system.',
    },
    {
      icon: BellIcon,
      title: 'Smart Reminders',
      description: 'Get notified 10 minutes before deadlines to ensure you never miss important tasks.',
    },
    {
      icon: ChartBarIcon,
      title: 'Progress Analytics',
      description: 'Visualize your productivity with detailed charts and completion statistics.',
    },
    {
      icon: ClockIcon,
      title: 'Deadline Tracking',
      description: 'Stay on top of your schedule with visual deadline indicators and priority sorting.',
    },
    {
      icon: UserGroupIcon,
      title: 'User-Friendly Interface',
      description: 'Enjoy a clean, intuitive design that makes task management effortless and enjoyable.',
    },
  ];

  const teamMembers = [
    {
      name: 'Abhishek Rajpurohit',
      role: 'Full Stack Developer',
      description: 'Full-stack developer with expertise in React and modern web technologies.',
    },
    {
      name: 'Sachin Yadav',
      role: 'Software Developer',
      description: 'Building logic for Web tachnologies.',
    },
    {
      name: 'Vivek Kumar',
      role: 'UX Designer',
      description: 'Dedicated to creating intuitive and beautiful user experiences.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <CheckCircleIcon className="h-16 w-16 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About TaskFlow
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              TaskFlow is a modern task management system designed to help you stay organized, 
              motivated, and productive. We believe that productivity should be rewarding and enjoyable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                We're on a mission to transform how people approach task management by making it 
                engaging, rewarding, and effective. Through gamification and intelligent design, 
                we help users build better habits and achieve their goals.
              </p>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <LightBulbIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Innovation First</h3>
                  <p className="text-gray-600">Always improving and innovating our platform</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <HeartIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">User-Centered</h3>
                  <p className="text-gray-600">Every feature is designed with users in mind</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-blue-500 to-green-500 rounded-lg p-8 text-white"
            >
              <h3 className="text-2xl font-bold mb-4">Why TaskFlow?</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 mr-3 text-green-200" />
                  Gamified experience that makes productivity fun
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 mr-3 text-green-200" />
                  Smart reminders and deadline management
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 mr-3 text-green-200" />
                  Beautiful, intuitive interface
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 mr-3 text-green-200" />
                  Detailed analytics and progress tracking
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to stay organized and productive
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              The passionate people behind TaskFlow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-green-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="text-xl mb-8 text-blue-100">
              Have questions or feedback? We'd love to hear from you.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-blue-100">hello@taskflow.com</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Support</h3>
                <p className="text-blue-100">support@taskflow.com</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Partnerships</h3>
                <p className="text-blue-100">partners@taskflow.com</p>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
              <p className="text-lg mb-4">Ready to boost your productivity?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  Start Free Trial
                </button>
                <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-colors">
                  View Demo
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;