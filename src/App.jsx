import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import AuthPinLock from './components/AuthPinLock';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import ExportImport from './components/ExportImport';
import Settings from './components/Settings';

function App() {
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    // Check PIN set in localStorage
    const pinSet = localStorage.getItem('budgetAppPIN');
    if (!pinSet) {
      setIsLocked(false); // No PIN set, unlock app
    }
  }, []);

  function handleUnlock() {
    setIsLocked(false);
  }

  return (
    <BrowserRouter>
      {isLocked ? (
        <AuthPinLock onUnlock={handleUnlock} />
      ) : (
        <>
          <NavBar />
          <main className="p-4 min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/export-import" element={<ExportImport />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </>
      )}
    </BrowserRouter>
  );
}

export default App;
