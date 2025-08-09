import React, { useState } from 'react';

export default function AuthPinLock({ onUnlock }) {
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');
  const storedPin = localStorage.getItem('budgetAppPIN');

  function handleChange(e) {
    const val = e.target.value;
    if (/^\d*$/.test(val) && val.length <= 6) {
      setPinInput(val);
      setError('');
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!storedPin) {
      // First time set PIN
      if (pinInput.length >= 4) {
        localStorage.setItem('budgetAppPIN', pinInput);
        onUnlock();
      } else {
        setError('PIN must be at least 4 digits.');
      }
    } else {
      if (pinInput === storedPin) {
        onUnlock();
      } else {
        setError('Incorrect PIN.');
      }
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-700">
      <form
        onSubmit={handleSubmit}
        className="glass-card p-8 w-80 flex flex-col items-center shadow-lg"
      >
        <h2 className="text-2xl mb-4 font-semibold">Enter your PIN</h2>
        <input
          type="password"
          inputMode="numeric"
          value={pinInput}
          onChange={handleChange}
          className="w-full p-3 rounded text-center text-xl tracking-widest bg-gray-800 text-gray-100 focus:outline-none"
          maxLength={6}
          autoFocus
        />
        {error && (
          <p className="text-red-400 mt-2 text-sm font-semibold">{error}</p>
        )}
        <button
          type="submit"
          className="btn-animated mt-6 px-8 py-3 rounded bg-green-600 hover:bg-green-700 text-white font-semibold"
        >
          {storedPin ? 'Unlock' : 'Set PIN'}
        </button>
      </form>
    </div>
  );
}

