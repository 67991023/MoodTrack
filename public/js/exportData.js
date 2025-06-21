/**
 * MoodTrack - Data Export Utilities
 * Version: 1.0.0
 * Last updated: 2025-06-21
 */

/**
 * Export mood data to CSV or JSON file
 * @param {Array} data - Array of mood data objects
 * @param {string} format - 'csv' or 'json'
 */
function exportMoodData(data, format = 'csv') {
  if (!data || !Array.isArray(data) || data.length === 0) {
    alert('No data available to export.');
    return;
  }
  
  try {
    let content, filename, mimetype;
    const dateStr = new Date().toISOString().slice(0, 10);
    
    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      filename = `moodtrack-export-${dateStr}.json`;
      mimetype = 'application/json';
    } else {
      // Convert to CSV
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(row => {
        return Object.values(row).map(value => {
          // Wrap string values in quotes and handle commas
          return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        }).join(',');
      });
      content = [headers, ...rows].join('\n');
      filename = `moodtrack-export-${dateStr}.csv`;
      mimetype = 'text/csv';
    }
    
    // Create download link
    const blob = new Blob([content], { type: mimetype });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Show success message
    showExportSuccess(format.toUpperCase());
  } catch (error) {
    console.error('Error exporting data:', error);
    alert(`Failed to export data: ${error.message}`);
  }
}

/**
 * Add export buttons to the dashboard page
 * @param {Object} moodData - Object containing user's mood data
 */
function addExportButtons(moodData) {
  const dashboardHeader = document.querySelector('.page-header');
  if (!dashboardHeader || dashboardHeader.querySelector('.export-buttons')) {
    return; // Either no header or buttons already added
  }
  
  const exportContainer = document.createElement('div');
  exportContainer.className = 'export-buttons';
  
  const exportCSVBtn = document.createElement('button');
  exportCSVBtn.className = 'btn';
  exportCSVBtn.textContent = 'Export CSV';
  exportCSVBtn.setAttribute('aria-label', 'Export data as CSV file');
  exportCSVBtn.addEventListener('click', () => exportMoodData(moodData, 'csv'));
  
  const exportJSONBtn = document.createElement('button');
  exportJSONBtn.className = 'btn';
  exportJSONBtn.textContent = 'Export JSON';
  exportJSONBtn.setAttribute('aria-label', 'Export data as JSON file');
  exportJSONBtn.addEventListener('click', () => exportMoodData(moodData, 'json'));
  
  exportContainer.appendChild(exportCSVBtn);
  exportContainer.appendChild(exportJSONBtn);
  dashboardHeader.appendChild(exportContainer);
}

/**
 * Format mood data for export
 * @param {Array} dates - Array of date strings
 * @param {Array} moods - Array of mood labels
 * @param {Array} ratings - Array of mood ratings
 * @param {Array} factors - Array of factor objects
 * @returns {Array} - Formatted data for export
 */
function formatMoodDataForExport(dates, moods, ratings, factors) {
  if (!dates || !Array.isArray(dates) || dates.length === 0) {
    return [];
  }
  
  return dates.map((date, index) => {
    const entry = {
      date: new Date(date).toISOString().split('T')[0],
      mood: moods && moods[index] ? moods[index] : 'Unknown',
      rating: ratings && ratings[index] ? ratings[index] : 'N/A'
    };
    
    // Add factors if available
    if (factors && factors[index]) {
      entry.factors = Array.isArray(factors[index]) ? 
        factors[index].join('; ') : 
        factors[index];
    }
    
    return entry;
  });
}

/**
 * Show success message after export
 * @param {string} format - The format of the exported file
 */
function showExportSuccess(format) {
  // Check if a notification container exists
  let notificationContainer = document.querySelector('.notification-container');
  
  // Create if it doesn't exist
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);
  }
  
  // Create notification
  const notification = document.createElement('div');
  notification.className = 'notification notification-success';
  notification.innerHTML = `
    <span class="notification-icon">✓</span>
    <div class="notification-content">
      <p>Data successfully exported as ${format}</p>
    </div>
    <button class="notification-close" aria-label="Dismiss notification">×</button>
  `;
  
  // Add to container
  notificationContainer.appendChild(notification);
  
  // Add event listener to close button
  const closeButton = notification.querySelector('.notification-close');
  closeButton.addEventListener('click', () => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  });
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.classList.add('fade-out');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }, 5000);
}