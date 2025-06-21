/**
 * MoodTrack - Mood Chart Visualization
 * Created: 2025-06-21
 * Author: 67991023
 * 
 * This file handles the mood trend visualization on the dashboard
 * using Chart.js library.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Get chart canvas element
  const chartElement = document.getElementById('moodChart');
  
  // Only proceed if the chart element exists and Chart.js is loaded
  if (!chartElement || typeof Chart === 'undefined') {
    console.warn('Chart element not found or Chart.js not loaded');
    return;
  }
  
  // Get data from server (passed through window variables) or use defaults
  const moodDates = window.moodDates || [];
  const moodRatings = window.moodRatings || [];
  
  // Default data in case no data is available
  const useDefaultData = moodDates.length === 0 || moodRatings.length === 0;
  
  // Default datasets for demonstration
  const defaultDates = ['Jun 14', 'Jun 15', 'Jun 16', 'Jun 17', 'Jun 18', 'Jun 19', 'Jun 20', 'Jun 21'];
  const defaultRatings = [6, 7, 5, 8, 7, 9, 8, 7];
  
  // Chart configuration
  const chart = new Chart(chartElement.getContext('2d'), {
    type: 'line',
    data: {
      labels: useDefaultData ? defaultDates : moodDates,
      datasets: [{
        label: 'Mood Rating',
        backgroundColor: 'rgba(91, 142, 125, 0.2)',
        borderColor: '#5b8e7d',
        borderWidth: 3,
        pointBackgroundColor: '#5b8e7d',
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: '#3e6b5b',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        data: useDefaultData ? defaultRatings : moodRatings,
        tension: 0.2,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 10,
          ticks: {
            stepSize: 1,
            font: {
              family: "'Nunito', sans-serif",
              size: 12
            },
            color: '#464646'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          ticks: {
            font: {
              family: "'Nunito', sans-serif",
              size: 12
            },
            color: '#464646'
          },
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(91, 142, 125, 0.8)',
          titleFont: {
            family: "'Nunito', sans-serif",
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            family: "'Nunito', sans-serif",
            size: 14
          },
          padding: 12,
          caretSize: 6,
          displayColors: false,
          callbacks: {
            title: function(tooltipItems) {
              return tooltipItems[0].label;
            },
            label: function(context) {
              return `Mood: ${context.raw}/10`;
            },
            afterLabel: function(context) {
              // Add a description based on the mood rating
              const rating = context.raw;
              if (rating >= 8) return 'Great day!';
              if (rating >= 6) return 'Good day';
              if (rating >= 4) return 'Average day';
              return 'Challenging day';
            }
          }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      },
      elements: {
        line: {
          cubicInterpolationMode: 'monotone'
        }
      }
    }
  });
  
  // Add click handler for chart points if needed
  chartElement.onclick = function(evt) {
    const points = chart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, false);
    
    if (points.length) {
      const firstPoint = points[0];
      const date = chart.data.labels[firstPoint.index];
      const rating = chart.data.datasets[0].data[firstPoint.index];
      
      // You could use this to show more details about a specific day
      console.log(`Selected: ${date} - Mood rating: ${rating}`);
      
      // Optionally trigger a modal or update another part of the UI
      // showDayDetails(date, rating);
    }
  };
  
  // Function to update chart data (can be called externally)
  window.updateMoodChart = function(newDates, newRatings) {
    chart.data.labels = newDates;
    chart.data.datasets[0].data = newRatings;
    chart.update();
  };
  
  // Add responsiveness handler
  window.addEventListener('resize', function() {
    chart.resize();
  });
  
  // Add dark mode support if needed
  if (document.body.classList.contains('dark-theme')) {
    chart.options.scales.y.ticks.color = '#e0e0e0';
    chart.options.scales.x.ticks.color = '#e0e0e0';
    chart.update();
  }
  
  // Listen for theme changes
  document.addEventListener('themeChanged', function(e) {
    const isDarkMode = e.detail.isDark;
    
    chart.options.scales.y.ticks.color = isDarkMode ? '#e0e0e0' : '#464646';
    chart.options.scales.x.ticks.color = isDarkMode ? '#e0e0e0' : '#464646';
    chart.update();
  });
  
  // If we're using default data, add a notice below the chart
  if (useDefaultData) {
    const chartContainer = chartElement.parentElement;
    const notice = document.createElement('div');
    notice.className = 'chart-notice';
    notice.textContent = 'Sample data shown. Start tracking your mood to see your own trends.';
    notice.style.textAlign = 'center';
    notice.style.marginTop = '10px';
    notice.style.fontSize = '0.85rem';
    notice.style.color = 'var(--neutral)';
    chartContainer.appendChild(notice);
  }
});