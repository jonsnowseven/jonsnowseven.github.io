module.exports = (req, res) => {
  res.status(200).json({ googleClientId: process.env.GOOGLE_CLIENT_ID || null });
};
