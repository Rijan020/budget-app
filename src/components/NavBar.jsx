import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

const currencies = ['NPR', 'USD', 'EUR', 'GBP', 'AUD'];

export default function NavBar() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('budgetAppTheme') === 'dark'
  );
  const [currency, setCurrency] = useState(
    localStorage.getItem('budgetAppCurrency') || 'NPR'
  );
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('budgetAppTheme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('budgetAppCurrency', currency);
  }, [currency]);

  return (
    <nav className="bg-gray-800 dark:bg-gray-900 text-gray-200 p-3 flex flex-wrap items-center justify-between sticky top-0 z-50 shadow-md">
      <div className="text-xl font-bold">Budget Manager</div>

      <button
        className="md:hidden p-2 focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          {menuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      <div
        className={`w-full md:w-auto md:flex md:items-center transition-max-height duration-300 ease-in-out overflow-hidden ${
          menuOpen ? 'max-h-96' : 'max-h-0 md:max-h-full'
        }`}
      >
        <NavLink
          to="/"
          className={({ isActive }) =>
            `block px-4 py-2 rounded md:inline-block ${
              isActive
                ? 'bg-green-600 text-white font-semibold'
                : 'hover:bg-green-600 hover:text-white'
            }`
          }
          onClick={() => setMenuOpen(false)}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `block px-4 py-2 rounded md:inline-block ${
              isActive
                ? 'bg-green-600 text-white font-semibold'
                : 'hover:bg-green-600 hover:text-white'
            }`
          }
          onClick={() => setMenuOpen(false)}
        >
          Reports
        </NavLink>
        <NavLink
          to="/export-import"
          className={({ isActive }) =>
            `block px-4 py-2 rounded md:inline-block ${
              isActive
                ? 'bg-green-600 text-white font-semibold'
                : 'hover:bg-green-600 hover:text-white'
            }`
          }
          onClick={() => setMenuOpen(false)}
        >
          Export/Import
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `block px-4 py-2 rounded md:inline-block ${
              isActive
                ? 'bg-green-600 text-white font-semibold'
                : 'hover:bg-green-600 hover:text-white'
            }`
          }
          onClick={() => setMenuOpen(false)}
        >
          Settings
        </NavLink>

        {/* Currency selector */}
        <select
          aria-label="Select currency"
          className="ml-4 mt-2 md:mt-0 bg-gray-700 text-gray-200 rounded px-2 py-1 focus:outline-none"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          {currencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>

        {/* Dark mode toggle */}
        <button
          aria-label="Toggle dark mode"
          onClick={() => setDarkMode(!darkMode)}
          className="ml-4 p-1 rounded hover:bg-green-600 transition-colors"
        >
          {darkMode ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v1m0 16v1m8.66-9h1m-16 0h1m12.07 6.07l.71.71m-12.02-12l.7.7m12.02 0l-.7.7m-12.02 12l-.7.7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
              />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
}
