const { requireAllowedUser } = require("../lib/auth");
const { getCvFile } = require("../lib/github");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    await requireAllowedUser(req);
    const { content, sha } = await getCvFile();
    res.status(200).json({ content, sha });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
};
