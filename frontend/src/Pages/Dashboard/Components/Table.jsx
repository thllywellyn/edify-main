import React from 'react';

const Table = ({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No data available',
  className = ''
}) => {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="h-16 bg-gray-100 dark:bg-gray-800 rounded mb-2"
          />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-[#042439]">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-[#0a3553] divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-50 dark:hover:bg-[#042439]/50 transition-colors"
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                >
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

// Example usage:
// const columns = [
//   {
//     header: 'Name',
//     key: 'name',
//     width: '30%'
//   },
//   {
//     header: 'Status',
//     key: 'status',
//     render: (row) => (
//       <span className={`px-2 py-1 rounded-full text-xs ${
//         row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//       }`}>
//         {row.status}
//       </span>
//     )
//   },
//   {
//     header: 'Actions',
//     key: 'actions',
//     render: (row) => (
//       <Button
//         variant="outline"
//         size="sm"
//         onClick={() => handleEdit(row)}
//       >
//         Edit
//       </Button>
//     )
//   }
// ];
//
// <Table
//   columns={columns}
//   data={students}
//   isLoading={isLoading}
//   emptyMessage="No students found"
// />