// api/health.js
module.exports = (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'Serverless function is working correctly',
    currentTime: '2025-06-07 12:01:48'
  });
};