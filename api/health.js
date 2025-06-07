// api/health.js
module.exports = (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
};