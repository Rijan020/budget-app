import React, { useState } from 'react';
import { formatDate } from '../utils/dateUtils';

// Splits a large expense into equal installments
export default function InstallmentScheduler({ onSchedule }) {
  const [totalAmount, setTotalAmount] = useState('');
  const [installments, setInstallments] = useState(2);
  const [startDate, setStartDate] = useState(formatDate(new Date()));
  const [frequency, setFrequency] = useState('monthly');

  const handleSubmit = (e) => {
    e.preventDefault();
    const amountPerInstallment = parseFloat(totalAmount) / installments;

    const plan = [];
    let date = new Date(startDate);

    for (let i = 0; i < installments; i++) {
      plan.push({
        amount: parseFloat(amountPerInstallment.toFixed(2)),
        dueDate: formatDate(date)
      });

      if (frequency === 'daily') {
        date.setDate(date.getDate() + 1);
      } else if (frequency === 'monthly') {
        date.setMonth(date.getMonth() + 1);
      } else if (frequency === 'semester') {
        date.setMonth(date.getMonth() + 6);
      }
    }

    onSchedule(plan);
  };

  return (
    <div className="glass p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-3">Installment Scheduler</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="number"
          step="0.01"
          placeholder="Total Amount"
          className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Number of Installments"
          className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
          value={installments}
          onChange={(e) => setInstallments(e.target.value)}
          min="1"
          required
        />
        <input
          type="date"
          className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <select
          className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="semester">Semester-wise</option>
        </select>
        <button
          type="submit"
          className="w-full py-2 bg-green-600 hover:bg-green-700 rounded text-white"
        >
          Schedule
        </button>
      </form>
    </div>
  );
}
