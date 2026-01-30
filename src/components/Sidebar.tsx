import { motion } from 'framer-motion';
import { Scan, Shield, Globe } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'quick-scan', label: 'Quick Scan', icon: Scan },
    { id: 'system-guard', label: 'System Guard', icon: Shield },
    { id: 'browser-sentinel', label: 'Browser Sentinel', icon: Globe },
  ];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-cyber-navy border-r border-neon-green/30 min-h-screen p-6"
    >
      <div className="mb-12">
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-cyber font-bold text-neon-green mb-2 tracking-wider"
        >
          DEEDE
        </motion.h1>
        <p className="text-cyan-400 text-xs font-cyber">Deepfake Defense</p>
      </div>

      <nav className="space-y-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <motion.button
              key={item.id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * (index + 1), duration: 0.4 }}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-3 p-4 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'bg-neon-green/20 border-2 border-neon-green shadow-neon-green'
                  : 'bg-gray-900/50 border-2 border-transparent hover:border-neon-green/50 hover:bg-gray-900/80'
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? 'text-neon-green' : 'text-gray-400'
                }`}
              />
              <span
                className={`font-cyber text-sm ${
                  isActive ? 'text-neon-green' : 'text-gray-300'
                }`}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-auto pt-12"
      >
        <div className="p-4 bg-gradient-to-br from-neon-green/10 to-cyber-blue/10 rounded-lg border border-neon-green/30">
          <p className="text-xs text-gray-400 font-cyber">System Status</p>
          <div className="flex items-center space-x-2 mt-2">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
            <span className="text-neon-green text-sm font-cyber">ONLINE</span>
          </div>
        </div>
      </motion.div>
    </motion.aside>
  );
}
