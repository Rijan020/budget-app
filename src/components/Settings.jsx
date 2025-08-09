import React, { useState, useEffect } from 'react';

export default function Settings({
  currency,
  setCurrency,
  darkMode,
  setDarkMode,
  pin,
  setPin,
}) {
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');

  function handlePinChange(e) {
    setNewPin(e.target.value);
  }

  function handleConfirmPinChange(e) {
    setConfirmPin(e.target.value);
  }

  function savePin(e) {
    e.preventDefault();
    setPinError('');
    if (newPin.length < 4) {
      setPinError('PIN must be at least 4 digits');
      return;
    }
    if (newPin !== confirmPin) {
      setPinError('PINs do not match');
      return;
    }
    setPin(newPin);
    setNewPin('');
    setConfirmPin('');
    alert('PIN saved');
  }

  return (
    <section className="glass-card p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold mb-4">Settings</h2>

      <form
        onSubmit={savePin}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md"
      >
        <div>
          <label htmlFor="currency" className="font-semibold block mb-1">
            Default Currency
          </label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="p-2 rounded bg-gray-800 text-gray-100 w-full"
          >
            <option value="NPR">NPR</option>
            <option value="USD">USD</option>
            <option value="CAD">CAD</option>
            <option value="GBP">GBP</option>
            <option value="AUD">AUD</option>
          </select>
        </div>

        <div>
          <label htmlFor="darkMode" className="font-semibold block mb-1">
            Dark Mode
          </label>
          <input
            id="darkMode"
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
        </div>

        <div className="col-span-2 mt-4">
          <label htmlFor="pin" className="font-semibold block mb-1">
            Set PIN (4+ digits)
          </label>
          <input
            type="password"
            id="pin"
            value={newPin}
            onChange={handlePinChange}
            className="p-2 rounded bg-gray-800 text-gray-100 w-full"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
          />
          <input
            type="password"
            placeholder="Confirm PIN"
            value={confirmPin}
            onChange={handleConfirmPinChange}
            className="p-2 rounded bg-gray-800 text-gray-100 w-full mt-2"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
          />
          {pinError && <p className="text-red-500 mt-1">{pinError}</p>}
          <button
            type="submit"
            className="mt-3 px-4 py-2 bg-green-600 rounded hover:bg-green-700 font-semibold"
          >
            Save PIN
          </button>
        </div>
      </form>
    </section>
  );
}
