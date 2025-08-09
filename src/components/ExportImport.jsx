import React, { useState } from 'react';
import {
  getAllTransactions,
  clearTransactions,
  bulkAddTransactions,
} from '../db/indexedDb';

export default function ExportImport() {
  const [importError, setImportError] = useState('');

  async function exportJSON() {
    const txns = await getAllTransactions();
    const dataStr = JSON.stringify(txns, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-data-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function exportCSV() {
    const txns = await getAllTransactions();
    const header = ['id', 'type', 'amount', 'category', 'date', 'notes'];
    const rows = txns.map(({ id, type, amount, category, date, notes }) =>
      [id, type, amount, category, date, notes ? `"${notes.replace(/"/g, '""')}"` : ''].join(',')
    );
    const csvContent = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-data-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importData(event) {
    const file = event.target.files[0];
    setImportError('');
    if (!file) return;

    try {
      const text = await file.text();
      if (file.type === 'application/json') {
        const data = JSON.parse(text);
        if (!Array.isArray(data)) throw new Error('Invalid JSON format');
        await clearTransactions();
        await bulkAddTransactions(data);
        alert('Data imported successfully!');
      } else if (
        file.type === 'text/csv' ||
        file.name.endsWith('.csv')
      ) {
        // Basic CSV parsing
        const lines = text.trim().split('\n');
        const header = lines.shift().split(',');
        if (
          !header.includes('id') ||
          !header.includes('type') ||
          !header.includes('amount') ||
          !header.includes('category') ||
          !header.includes('date')
        ) {
          throw new Error('CSV missing required columns');
        }
        const data = lines.map((line) => {
          const parts = line.split(',');
          const record = {};
          header.forEach((h, i) => {
            record[h] = parts[i];
          });
          record.amount = parseFloat(record.amount);
          return record;
        });
        await clearTransactions();
        await bulkAddTransactions(data);
        alert('Data imported successfully!');
      } else {
        alert('Unsupported file type');
      }
    } catch (err) {
      setImportError(err.message || 'Import failed');
    }
  }

  return (
    <section className="glass-card p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold mb-4">Export / Import Data</h2>

      <div className="space-x-4 mb-6">
        <button
          onClick={exportJSON}
          className="px-4 py-3 bg-green-600 rounded hover:bg-green-700 font-semibold"
        >
          Export JSON
        </button>
        <button
          onClick={exportCSV}
          className="px-4 py-3 bg-green-600 rounded hover:bg-green-700 font-semibold"
        >
          Export CSV
        </button>
      </div>

      <div>
        <label
          htmlFor="importFile"
          className="cursor-pointer px-4 py-3 bg-yellow-600 rounded hover:bg-yellow-700 font-semibold"
        >
          Import Data (JSON or CSV)
        </label>
        <input
          id="importFile"
          type="file"
          accept=".json,.csv,application/json,text/csv"
          onChange={importData}
          className="hidden"
        />
        {importError && (
          <p className="text-red-500 mt-2" role="alert">
            {importError}
          </p>
        )}
      </div>
    </section>
  );
}
