/**
 * MoodTrack Chart Initialization
 * Creates and configures the mood tracking chart
 */
function initMoodChart(dates, ratings) {
  // Default sample data if none provided
  const chartDates = dates || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const chartRatings = ratings || [7, 5, 8, 6, 9, 7, 8];
  
  const ctx = document.getElementById('moodChart').getContext('2d');
  
  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(91, 142, 125, 0.5)');
  gradient.addColorStop(1, 'rgba(91, 142, 125, 0)');
  
  // Create chart
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartDates,
      datasets: [{
        label: 'Mood Intensity',
        data: chartRatings,
        borderColor: 'rgba(91, 142, 125, 1)',
        backgroundColor: gradient,
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgba(91, 142, 125, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
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
            color: '#737373'
          },
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              family: "'Nunito', sans-serif",
              size: 12
            },
            color: '#737373'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#333',
          bodyColor: '#666',
          borderColor: 'rgba(91, 142, 125, 0.5)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 6,
          displayColors: false,
          titleFont: {
            family: "'Nunito', sans-serif",
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            family: "'Nunito', sans-serif",
            size: 14
          },
          callbacks: {
            title: function(context) {
              return context[0].label;
            },
            label: function(context) {
              const value = context.raw;
              let status = '';
              
              if (value >= 8) status = 'Great';
              else if (value >= 6) status = 'Good';
              else if (value >= 4) status = 'Neutral';
              else if (value >= 2) status = 'Low';
              else status = 'Very Low';
              
              return [`Mood Intensity: ${value}/10`, `Status: ${status}`];
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      }
    }
  });
  
  return chart;
}

// If called directly
if (typeof document !== 'undefined' && document.readyState === 'complete') {
  initMoodChart();
}