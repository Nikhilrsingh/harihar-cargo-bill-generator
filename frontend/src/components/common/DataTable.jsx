import React from 'react';

export default function DataTable({ data = [], columns = [] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-slate-850 dark:bg-slate-900 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-800 table-fixed">
       <thead className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-800">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-slate-800 dark:bg-slate-900 text-sm">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-10 text-center text-gray-400 dark:text-gray-500">
                No active records discovered in this collection registry index.
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                    {row[column.key] !== undefined ? String(row[column.key]) : '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}