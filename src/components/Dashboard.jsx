import React, { useState, useEffect } from 'react';
import TransactionForm from './TransactionForm';
import { getAllTransactions, deleteTransaction } from '../db/indexedDb';
import { format } from 'date-fns';
import { formatAmount } from '../utils/currency';

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function fetchTransactions() {
      const txns = await getAllTransactions();
      // Sort descending by date
      txns.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(txns);
    }
    fetchTransactions();
  }, [refresh]);

  async function handleDelete(id) {
    if (confirm('Delete this transaction?')) {
      await deleteTransaction(id);
      setRefresh(!refresh);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <TransactionForm onTransactionAdded={() => setRefresh(!refresh)} />
      <section className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        {transactions.length === 0 && (
          <p className="text-gray-400">No transactions recorded yet.</p>
        )}
        <ul className="divide-y divide-gray-700 max-h-96 overflow-y-auto">
          {transactions.map(({ id, type, amount, category, date, notes }) => (
            <li key={id} className="flex justify-between items-center py-2">
              <div>
                <div className="font-semibold">
                  {type === 'income' ? '+' : '-'} {formatAmount(amount)}
                </div>
                <div className="text-sm text-gray-400">
                  {category} &middot; {format(new Date(date), 'PP')}
                </div>
                {notes && (
                  <div className="text-xs italic text-gray-500 truncate max-w-xs">
                    {notes}
                  </div>
                )}
              </div>
              <button
                onClick={() => handleDelete(id)}
                aria-label="Delete transaction"
                className="text-red-500 hover:text-red-600 font-bold"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
