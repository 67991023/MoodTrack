/**
 * MoodTrack - Chart Utilities
 * Version: 1.0.0
 * Last updated: 2025-06-21
 */

/**
 * Initialize a mood chart with provided data
 * @param {HTMLElement} chartElement - Canvas element for the chart
 * @param {Array} dates - Array of date strings
 * @param {Array} ratings - Array of mood ratings (1-10)
 * @param {Object} options - Optional configuration options
 * @returns {Chart|null} - Chart instance or null if initialization failed
 */
function initializeMoodChart(chartElement, dates, ratings, options = {}) {
  if (!chartElement || typeof Chart === 'undefined') {
    console.error('Chart initialization failed: Missing element or Chart.js');
    return null;
  }

  // Default configuration
  const defaultConfig = {
    lineColor: '#4285F4',
    fillColor: 'rgba(66, 133, 244, 0.2)',
    pointColor: '#4285F4',
    tension: 0.2,
    minRating: 0,
    maxRating: 10,
    stepSize: 2
  };
  
  // Merge options with defaults
  const config = Object.assign({}, defaultConfig, options);

  return new Chart(chartElement.getContext('2d'), {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Mood Rating',
        backgroundColor: config.fillColor,
        borderColor: config.lineColor,
        borderWidth: 3,
        pointBackgroundColor: config.pointColor,
        pointRadius: 5,
        pointHoverRadius: 7,
        data: ratings,
        tension: config.tension
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          min: config.minRating,
          max: config.maxRating,
          ticks: {
            stepSize: config.stepSize
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            title: function(tooltipItems) {
              return dates[tooltipItems[0].dataIndex];
            },
            label: function(context) {
              return `Mood: ${context.raw}/10`;
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  });
}

/**
 * Initialize a bar chart for factor analysis
 * @param {HTMLElement} chartElement - Canvas element for the chart
 * @param {Array} labels - Array of factor labels
 * @param {Array} values - Array of factor values
 * @param {Object} options - Optional configuration options
 * @returns {Chart|null} - Chart instance or null if initialization failed
 */
function initializeFactorChart(chartElement, labels, values, options = {}) {
  if (!chartElement || typeof Chart === 'undefined') {
    console.error('Chart initialization failed: Missing element or Chart.js');
    return null;
  }

  // Default configuration
  const defaultConfig = {
    positiveColor: 'rgba(91, 142, 125, 0.6)',
    negativeBorder: 'rgba(226, 120, 120, 1)',
    positiveBorder: 'rgba(91, 142, 125, 1)',
    negativeColor: 'rgba(226, 120, 120, 0.6)',
    horizontal: false
  };
  
  // Merge options with defaults
  const config = Object.assign({}, defaultConfig, options);

  return new Chart(chartElement.getContext('2d'), {
    type: config.horizontal ? 'horizontalBar' : 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Impact on Mood',
        backgroundColor: values.map(value => 
          value >= 0 ? config.positiveColor : config.negativeColor
        ),
        borderColor: values.map(value => 
          value >= 0 ? config.positiveBorder : config.negativeBorder
        ),
        borderWidth: 1,
        data: values
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: config.horizontal ? 'y' : 'x',
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 1
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.raw;
              return value >= 0 
                ? `Positive impact: ${Math.abs(value).toFixed(1)}` 
                : `Negative impact: ${Math.abs(value).toFixed(1)}`;
            }
          }
        }
      }
    }
  });
}

/**
 * Format dates for display in chart
 * @param {Array} dateStrings - Array of date strings in ISO format
 * @returns {Array} - Formatted date strings
 */
function formatChartDates(dateStrings) {
  if (!dateStrings || !Array.isArray(dateStrings)) {
    return [];
  }
  
  return dateStrings.map(dateStr => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return dateStr; // Return original if invalid date
      }
      return `${date.toLocaleString('default', {month: 'short'})} ${date.getDate()}`;
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateStr;
    }
  });
}

/**
 * Calculate average mood by weekday
 * @param {Array} moodData - Array of mood objects with date and rating
 * @returns {Object} - Object with labels and data arrays
 */
function calculateWeekdayMoods(moodData) {
  if (!moodData || !Array.isArray(moodData) || moodData.length === 0) {
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [0, 0, 0, 0, 0, 0, 0]
    };
  }
  
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const totals = [0, 0, 0, 0, 0, 0, 0];
  const counts = [0, 0, 0, 0, 0, 0, 0];
  
  // Sum ratings by weekday
  moodData.forEach(mood => {
    if (mood && mood.date && mood.rating) {
      try {
        const date = new Date(mood.date);
        const weekdayIndex = date.getDay();
        totals[weekdayIndex] += parseFloat(mood.rating);
        counts[weekdayIndex]++;
      } catch (e) {
        console.error('Error processing mood data:', e);
      }
    }
  });
  
  // Calculate averages
  const data = totals.map((total, index) => 
    counts[index] > 0 ? +(total / counts[index]).toFixed(1) : 0
  );
  
  // Reorder to start from Monday
  const mondayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const mondayData = [...data.slice(1), data[0]];
  
  return {
    labels: mondayLabels,
    data: mondayData
  };
}