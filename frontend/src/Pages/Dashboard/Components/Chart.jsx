import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartComponent = ({
  type = 'line', // 'line' | 'bar' | 'pie' | 'doughnut'
  data,
  options = {},
  height = 300,
  className = ''
}) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    // Default options based on dark mode
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: document.documentElement.classList.contains('dark')
              ? 'rgba(255, 255, 255, 0.8)'
              : 'rgba(0, 0, 0, 0.8)'
          }
        }
      },
      scales: type !== 'pie' && type !== 'doughnut' ? {
        x: {
          grid: {
            color: document.documentElement.classList.contains('dark')
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            color: document.documentElement.classList.contains('dark')
              ? 'rgba(255, 255, 255, 0.8)'
              : 'rgba(0, 0, 0, 0.8)'
          }
        },
        y: {
          grid: {
            color: document.documentElement.classList.contains('dark')
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            color: document.documentElement.classList.contains('dark')
              ? 'rgba(255, 255, 255, 0.8)'
              : 'rgba(0, 0, 0, 0.8)'
          }
        }
      } : undefined
    };

    // Merge default options with provided options
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      plugins: {
        ...defaultOptions.plugins,
        ...(options.plugins || {})
      }
    };

    chartInstance.current = new Chart(ctx, {
      type,
      data,
      options: mergedOptions
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [type, data, options]);

  return (
    <div
      className={`relative bg-white dark:bg-[#0a3553] rounded-lg p-4 ${className}`}
      style={{ height }}
    >
      <canvas ref={chartRef} />
    </div>
  );
};

export default ChartComponent;

// Example usage:
// const lineData = {
//   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
//   datasets: [
//     {
//       label: 'Students',
//       data: [12, 19, 3, 5, 2],
//       borderColor: '#4E84C1',
//       backgroundColor: 'rgba(78, 132, 193, 0.2)'
//     }
//   ]
// };
// 
// <Chart
//   type="line"
//   data={lineData}
//   height={300}
//   options={{
//     plugins: {
//       title: {
//         display: true,
//         text: 'Student Enrollment'
//       }
//     }
//   }}
// />