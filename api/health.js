export default function handler(req, res) {
  res.status(200).json({
    status: "healthy",
    service: "CRM TikTok/Instagram",
    timestamp: new Date().toISOString()
  });
}
