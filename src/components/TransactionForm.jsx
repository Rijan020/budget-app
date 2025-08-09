import React, { useState, useEffect } from 'react';
import {
  addTransaction,
  getAllTransactions,
  updateTransaction,
} from '../db/indexedDb';
import { format } from 'date-fns';

const categories = [
  'Salary',
  'Food',
  'Transport',
  'Entertainment',
  'Education',
  'Health',
  'Bills',
  'Others',
];

const splitFrequencies = ['None', 'Daily', 'Monthly', 'Semester', 'Custom'];

export default function TransactionForm({ onTransactionAdded }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Others');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [notes, setNotes] = useState('');
  const [split, setSplit] = useState('None');
  const [installments, setInstallments] = useState(1);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  function resetForm() {
    setType('expense');
    setAmount('');
    setCategory('Others');
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setNotes('');
    setSplit('None');
    setInstallments(1);
    setCustomStart('');
    setCustomEnd('');
  }

  function parseDate(d) {
    return d ? new Date(d) : null;
  }

  // Helper to add installments if split requested
  async function handleSplitAndAdd() {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      alert('Enter valid amount');
      return;
    }
    const baseDate = parseDate(date);
    if (!baseDate) {
      alert('Enter valid date');
      return;
    }

    // No split
    if (split === 'None') {
      await addTransaction({
        type,
        amount: amt,
        category,
        date: baseDate.toISOString(),
        notes,
      });
      return;
    }

    // Calculate installments count & date intervals
    let periods = [];
    if (split === 'Daily') {
      for (let i = 0; i < installments; i++) {
        let d = new Date(baseDate);
        d.setDate(d.getDate() + i);
        periods.push(d);
      }
    } else if (split === 'Monthly') {
      for (let i = 0; i < installments; i++) {
        let d = new Date(baseDate);
        d.setMonth(d.getMonth() + i);
        periods.push(d);
      }
    } else if (split === 'Semester') {
      // Semesters are 6 months
      for (let i = 0; i < installments; i++) {
        let d = new Date(baseDate);
        d.setMonth(d.getMonth() + i * 6);
        periods.push(d);
      }
    } else if (split === 'Custom') {
      // Custom date range: split evenly between start and end
      const start = parseDate(customStart);
      const end = parseDate(customEnd);
      if (!start || !end || end <= start) {
        alert('Invalid custom date range');
        return;
      }
      const msInterval = (end - start) / (installments - 1);
      for (let i = 0; i < installments; i++) {
        periods.push(new Date(start.getTime() + msInterval * i));
      }
    }

    // Add transactions with split amounts and installment note
    const splitAmt = amt / installments;
    for (let i = 0; i < installments; i++) {
      await addTransaction({
        type,
        amount: splitAmt,
        category,
        date: periods[i].toISOString(),
        notes: notes ? `${notes} (Installment ${i + 1}/${installments})` : `Installment ${i + 1}/${installments}`,
      });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await handleSplitAndAdd();
    resetForm();
    onTransactionAdded();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card p-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      <div className="col-span-1 flex flex-col space-y-2">
        <label htmlFor="type" className="font-semibold">
          Type
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-2 rounded bg-gray-800 text-gray-100"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div className="col-span-1 flex flex-col space-y-2">
        <label htmlFor="amount" className="font-semibold">
          Amount
        </label>
        <input
          id="amount"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-2 rounded bg-gray-800 text-gray-100"
          required
        />
      </div>

      <div className="col-span-1 flex flex-col space-y-2">
        <label htmlFor="category" className="font-semibold">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 rounded bg-gray-800 text-gray-100"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="col-span-1 flex flex-col space-y-2">
        <label htmlFor="date" className="font-semibold">
          Date
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 rounded bg-gray-800 text-gray-100"
          required
        />
      </div>

      <div className="col-span-1 flex flex-col space-y-2">
        <label htmlFor="notes" className="font-semibold">
          Notes
        </label>
        <input
          id="notes"
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional"
          className="p-2 rounded bg-gray-800 text-gray-100"
        />
      </div>

      <div className="col-span-1 flex flex-col space-y-2">
        <label htmlFor="split" className="font-semibold">
          Split Expense
        </label>
        <select
          id="split"
          value={split}
          onChange={(e) => setSplit(e.target.value)}
          className="p-2 rounded bg-gray-800 text-gray-100"
        >
          {splitFrequencies.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {(split !== 'None' && (
        <>
          <div className="col-span-1 flex flex-col space-y-2">
            <label htmlFor="installments" className="font-semibold">
              Number of Installments
            </label>
            <input
              id="installments"
              type="number"
              min="1"
              max="100"
              value={installments}
              onChange={(e) => setInstallments(parseInt(e.target.value, 10))}
              className="p-2 rounded bg-gray-800 text-gray-100"
              required
            />
          </div>

          {split === 'Custom' && (
            <>
              <div className="col-span-1 flex flex-col space-y-2">
                <label htmlFor="customStart" className="font-semibold">
                  Custom Start Date
                </label>
                <input
                  id="customStart"
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="p-2 rounded bg-gray-800 text-gray-100"
                  required
                />
              </div>

              <div className="col-span-1 flex flex-col space-y-2">
                <label htmlFor="customEnd" className="font-semibold">
                  Custom End Date
                </label>
                <input
                  id="customEnd"
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="p-2 rounded bg-gray-800 text-gray-100"
                  required
                />
              </div>
            </>
          )}
        </>
      )) || <div className="col-span-2"></div>}
      
      <div className="col-span-1 flex items-end">
        <button
          type="submit"
          className="btn-animated w-full px-4 py-3 rounded bg-green-600 hover:bg-green-700 font-semibold"
        >
          Add Transaction
        </button>
      </div>
    </form>
  );
}
