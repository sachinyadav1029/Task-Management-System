import React, { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ChartBarIcon,
  BellIcon,
  UserGroupIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const features = [
    { icon: CheckCircleIcon, title: 'Smart Task Management', description: 'Create, organize, and track your tasks with intelligent deadline management and priority settings.', gradient: 'from-blue-100 to-blue-50' },
    { icon: BellIcon, title: 'Task Optimizer', description: 'Streamline your tasks with intelligent tools that improve efficiency and reduce effort Achieve more in less time by optimizing your workflow for maximum productivity.', gradient: 'from-green-100 to-green-50' },
    { icon: ChartBarIcon, title: 'Progress Analytics', description: 'Visualize your productivity with detailed charts and completion statistics.', gradient: 'from-purple-100 to-purple-50' },
    { icon: ClockIcon, title: 'Deadline Tracking', description: 'Stay on top of your schedule with visual deadline indicators and priority sorting.', gradient: 'from-yellow-100 to-yellow-50' },
    { icon: UserGroupIcon, title: 'User-Friendly Interface', description: 'Enjoy a clean, intuitive design that makes task management effortless and enjoyable.', gradient: 'from-pink-100 to-pink-50' },
    { icon: RocketLaunchIcon, title: 'Boost Productivity', description: 'Leverage smart tools to optimize your workflow and achieve more in less time.', gradient: 'from-red-200 to-red-100' },
  ];

  const [activeUsers, setActiveUsers] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);  
  const [tasksCompleted, setTasksCompleted] = useState(0);

  const { ref: statsRef, inView: statsInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  useEffect(() => {
    if (!statsInView) return;

    let startUsers = 0;
    let startTasks = 0;
    let completion = 0;

    const endUsers = 10000;
    const endTasks = 1000000;
    const intervalTime = 20;

    const userCounter = setInterval(() => {
      startUsers += Math.ceil(endUsers / 100);
      if (startUsers >= endUsers) {
        startUsers = endUsers;
        clearInterval(userCounter);
      }
      setActiveUsers(startUsers);
    }, intervalTime);

    const completionCounter = setInterval(() => {
      completion += 1;
      if (completion >= 95) {
        completion = 95;
        clearInterval(completionCounter);
      }
      setCompletionRate(completion);
    }, 30);

    const tasksCounter = setInterval(() => {
      startTasks += Math.ceil(endTasks / 100);
      if (startTasks >= endTasks) {
        startTasks = endTasks;
        clearInterval(tasksCounter);
      }
      setTasksCompleted(startTasks);
    }, 10);

    return () => {
      clearInterval(userCounter);
      clearInterval(completionCounter);
      clearInterval(tasksCounter);
    };
  }, [statsInView]);

  const formatNumber = (num) => {
    if (num >= 1000000) return `${Math.floor(num / 1000000)}M+`;
    if (num >= 10000) return `${Math.floor(num / 1000)}K+`;
    return num;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 sm:py-16 lg:py-20">
        <div className="max-w-3xl sm:max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex justify-center mb-6">
              <CheckCircleIcon className="h-16 w-16 sm:h-20 sm:w-20 text-blue-600" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Stay on Track, <span className="text-green-600">Boost Productivity</span>, <span className="text-blue-600">Manage Smarter</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8">
              Transform your productivity with TaskFlow - the intelligent task management system that helps you stay organized and meet deadlines.
            </p>
            {/* <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link to="/signup" className="bg-blue-600 text-white px-5 py-3 sm:px-8 sm:py-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
                Get Started Free
              </Link>
              <Link to="/login" className="border-2 border-blue-600 text-blue-600 px-5 py-3 sm:px-8 sm:py-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-50 transform hover:scale-105 transition-all duration-200">
                Login
              </Link>
            </div> */}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              Powerful Features for Maximum Productivity
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl sm:max-w-2xl mx-auto">
              Everything you need to stay organized, motivated, and productive in one beautiful package.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative p-4 sm:p-6 md:p-8 rounded-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-start bg-gradient-to-br ${feature.gradient}`}
              >
                {feature.title === 'Boost Productivity' && (
                  <motion.span 
                    className="absolute top-3 right-3 bg-red-600 text-white text-xs sm:text-sm px-2 py-1 rounded-full font-semibold shadow-lg"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                  >
                    Featured
                  </motion.span>
                )}

                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg flex items-center justify-center mb-3 sm:mb-4 bg-white/30">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-blue-600" />
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-700">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-10 sm:py-16 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">Trusted by Productive People</h2>
          <p className="text-sm sm:text-base md:text-lg text-blue-100 mb-6 sm:mb-10">Join thousands who have transformed their productivity</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-white">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">{formatNumber(activeUsers)}</div>
              <div className="text-blue-100 text-xs sm:text-sm md:text-base">Active Users</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-white">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">{completionRate}%</div>
              <div className="text-blue-100 text-xs sm:text-sm md:text-base">Task Completion Rate</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-white">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">{formatNumber(tasksCompleted)}</div>
              <div className="text-blue-100 text-xs sm:text-sm md:text-base">Tasks Completed</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-16 bg-gray-50">
        <div className="max-w-3xl sm:max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Ready to Transform Your Productivity?</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6">
              Start your journey to better task management and stay motivated every day.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link to="/signup" className="bg-blue-600 text-white px-5 py-3 sm:px-8 sm:py-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
                Start Free Today
              </Link>
              <Link to="/about" className="text-blue-600 px-5 py-3 sm:px-8 sm:py-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-50 transition-all duration-200">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
