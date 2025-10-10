export default function handler(req, res) {
  return res.status(200).json({
    message: 'Simple API test working!',
    method: req.method,
    timestamp: new Date().toISOString()
  });
}
