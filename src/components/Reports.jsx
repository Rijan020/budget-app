import React, { useState, useEffect } from 'react';
import { getAllTransactions } from '../db/indexedDb';
import { Bar } from 'react-chartjs-2';
import { format, parseISO } from 'date-fns';
import { formatAmount } from '../utils/currency';

export default function Reports() {
  const [transactions, setTransactions] = useState([]);
  const [filterPeriod, setFilterPeriod] = useState('Monthly');
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    net: 0,
  });

  useEffect(() => {
    async function load() {
      const data = await getAllTransactions();
      setTransactions(data);
    }
    load();
  }, []);

  useEffect(() => {
    // Calculate summary on filtered transactions
    let incomeSum = 0;
    let expenseSum = 0;

    transactions.forEach((t) => {
      if (t.type === 'income') incomeSum += t.amount;
      else expenseSum += t.amount;
    });

    setSummary({
      income: incomeSum,
      expense: expenseSum,
      net: incomeSum - expenseSum,
    });
  }, [transactions]);

  // Aggregate data for chart by period
  function aggregateData() {
    const dataMap = {};
    transactions.forEach((t) => {
      let label;
      const d = parseISO(t.date);
      if (filterPeriod === 'Monthly') {
        label = format(d, 'MMM yyyy');
      } else if (filterPeriod === 'Daily') {
        label = format(d, 'dd MMM yyyy');
      } else if (filterPeriod === 'Semester') {
        // Simple semester: Jan-Jun or Jul-Dec
        const month = d.getMonth();
        const year = d.getFullYear();
        label = month < 6 ? `Jan-Jun ${year}` : `Jul-Dec ${year}`;
      } else {
        label = format(d, 'MMM yyyy');
      }
      if (!dataMap[label]) dataMap[label] = { income: 0, expense: 0 };
      if (t.type === 'income') dataMap[label].income += t.amount;
      else dataMap[label].expense += t.amount;
    });
    return dataMap;
  }

  const chartDataMap = aggregateData();
  const labels = Object.keys(chartDataMap).sort((a, b) => new Date(a) - new Date(b));
  const incomeData = labels.map((l) => chartDataMap[l].income);
  const expenseData = labels.map((l) => chartDataMap[l].expense);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: 'rgba(34,197,94,0.7)', // green
      },
      {
        label: 'Expense',
        data: expenseData,
        backgroundColor: 'rgba(239,68,68,0.7)', // red
      },
    ],
  };

  return (
    <section className="glass-card p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold mb-4">Reports & Summary</h2>
      <div className="flex items-center space-x-4 mb-4">
        <label htmlFor="filterPeriod" className="font-semibold">
          Filter Period:
        </label>
        <select
          id="filterPeriod"
          value={filterPeriod}
          onChange={(e) => setFilterPeriod(e.target.value)}
          className="p-2 rounded bg-gray-800 text-gray-100"
        >
          <option>Daily</option>
          <option>Monthly</option>
          <option>Semester</option>
          <option>Custom</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-green-700 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Income</h3>
          <p className="text-2xl">{formatAmount(summary.income)}</p>
        </div>
        <div className="bg-red-700 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Expense</h3>
          <p className="text-2xl">{formatAmount(summary.expense)}</p>
        </div>
        <div
          className={`p-4 rounded shadow ${
            summary.net >= 0 ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          <h3 className="text-lg font-semibold">Net</h3>
          <p className="text-2xl">{formatAmount(summary.net)}</p>
        </div>
      </div>

      <div className="mt-6">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  color: '#d1d5db',
                },
              },
            },
            scales: {
              x: {
                ticks: { color: '#d1d5db' },
              },
              y: {
                ticks: { color: '#d1d5db' },
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
    </section>
  );
}
