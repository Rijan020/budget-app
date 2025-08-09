import React, { useState, useEffect } from 'react';
import {
  addRecurring,
  getAllRecurring,
  updateRecurring,
  deleteRecurring,
  addTransaction,
} from '../db/indexedDb';
import { format } from 'date-fns';

const frequencies = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

export default function RecurringIncomeSetup() {
  const [incomes, setIncomes] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [frequency, setFrequency] = useState('Monthly');

  useEffect(() => {
    async function load() {
      const data = await getAllRecurring();
      setIncomes(data.filter((i) => i.type === 'income'));
    }
    load();
  }, []);

  async function addIncome() {
    if (!name || !amount || !startDate) return;
    await addRecurring({
      name,
      amount: parseFloat(amount),
      startDate,
      frequency,
      type: 'income',
      lastAdded: null,
    });
    setName('');
    setAmount('');
    setStartDate(format(new Date(), 'yyyy-MM-dd'));
    setFrequency('Monthly');
    refreshList();
  }

  async function refreshList() {
    const data = await getAllRecurring();
    setIncomes(data.filter((i) => i.type === 'income'));
  }

  async function removeIncome(id) {
    if (confirm('Delete this recurring income?')) {
      await deleteRecurring(id);
      refreshList();
    }
  }

  // Auto add recurring incomes if date reached or passed
  useEffect(() => {
    async function checkAndAdd() {
      const today = new Date();
      for (const income of incomes) {
        let last = income.lastAdded ? new Date(income.lastAdded) : null;
        let start = new Date(income.startDate);
        // If lastAdded is null, set to startDate - frequency intervals
        if (!last) last = new Date(start.getTime() - 86400000);

        let nextAdd = new Date(last);
        // Calculate next add date based on frequency
        if (income.frequency === 'Daily') nextAdd.setDate(nextAdd.getDate() + 1);
        else if (income.frequency === 'Weekly') nextAdd.setDate(nextAdd.getDate() + 7);
        else if (income.frequency === 'Monthly') nextAdd.setMonth(nextAdd.getMonth() + 1);
        else if (income.frequency === 'Yearly') nextAdd.setFullYear(nextAdd.getFullYear() + 1);

        // If nextAdd date is <= today, add transaction and update lastAdded
        if (nextAdd <= today) {
          await addTransaction({
            type: 'income',
            amount: income.amount,
            category: income.name,
            date: nextAdd.toISOString(),
            notes: `Recurring ${income.frequency} income`,
          });
          income.lastAdded = nextAdd.toISOString();
          await updateRecurring(income);
        }
      }
      refreshList();
    }
    checkAndAdd();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomes]);

  return (
    <section className="glass-card p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold mb-4">Recurring Income Setup</h2>
      <form
        onSubmit={e => {
          e.preventDefault();
          addIncome();
        }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <input
          type="text"
          placeholder="Name (e.g. Salary)"
          value={name}
          onChange={e => setName(e.target.value)}
          className="p-2 rounded bg-gray-800 text-gray-100"
          required
        />
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="p-2 rounded bg-gray-800 text-gray-100"
          required
        />
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="p-2 rounded bg-gray-800 text-gray-100"
          required
        />
        <select
          value={frequency}
          onChange={e => setFrequency(e.target.value)}
          className="p-2 rounded bg-gray-800 text-gray-100"
        >
          {frequencies.map(freq => (
            <option key={freq} value={freq}>
              {freq}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="col-span-1 md:col-span-4 mt-2 px-4 py-3 bg-green-600 rounded hover:bg-green-700 font-semibold"
        >
          Add Recurring Income
        </button>
      </form>

      <ul className="divide-y divide-gray-700 max-h-64 overflow-y-auto">
        {incomes.length === 0 && (
          <p className="text-gray-400 italic">No recurring incomes found.</p>
        )}
        {incomes.map(({ id, name, amount, frequency }) => (
          <li
            key={id}
            className="flex justify-between items-center py-2"
            aria-label={`Recurring income ${name}`}
          >
            <span>
              {name} - Rs. {amount.toFixed(2)} ({frequency})
            </span>
            <button
              className="text-red-500 hover:text-red-600 font-bold"
              onClick={() => removeIncome(id)}
              aria-label={`Delete recurring income ${name}`}
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
