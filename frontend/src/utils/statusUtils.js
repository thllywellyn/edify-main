export const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'upcoming':
      return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20';
    case 'completed':
      return 'text-green-500 bg-green-100 dark:bg-green-900/20';
    default:
      return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
  }
};

export const daysOfWeek = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", 
  "Friday", "Saturday"
];