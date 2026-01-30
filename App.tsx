import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Toast, { ToastMessage } from './components/Toast';
import QuickScan from './pages/QuickScan';
import SystemGuard from './pages/SystemGuard';
import BrowserSentinel from './pages/BrowserSentinel';

function App() {
  const [currentPage, setCurrentPage] = useState('quick-scan');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      const id = Date.now().toString();
      setToasts((prev) => [
        ...prev,
        { id, message, type, duration: 4000 },
      ]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'quick-scan':
        return <QuickScan addToast={addToast} />;
      case 'system-guard':
        return <SystemGuard addToast={addToast} />;
      case 'browser-sentinel':
        return <BrowserSentinel addToast={addToast} />;
      default:
        return <QuickScan addToast={addToast} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-cyber-navy">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1">{renderPage()}</main>
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;
