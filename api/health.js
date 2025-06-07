// api/health.js
module.exports = (req, res) => {
  const currentTime = '2025-06-07 16:49:54';
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'MoodTrack API is working correctly',
    currentTime: currentTime,
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
};