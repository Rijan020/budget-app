// Export transactions to CSV
export const exportToCSV = (transactions, filename = 'transactions.csv') => {
  if (!transactions.length) return;

  const header = Object.keys(transactions[0]).join(',');
  const rows = transactions.map(t =>
    Object.values(t)
      .map(v => `"${String(v).replace(/"/g, '""')}"`)
      .join(',')
  );
  const csvContent = [header, ...rows].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export transactions to JSON
export const exportToJSON = (transactions, filename = 'transactions.json') => {
  const blob = new Blob([JSON.stringify(transactions, null, 2)], {
    type: 'application/json'
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Import JSON file and return parsed data
export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
};
