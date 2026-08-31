const { requireAllowedUser } = require("../lib/auth");
const { saveCvFile } = require("../lib/github");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const email = await requireAllowedUser(req);
    const { content, sha } = req.body || {};
    if (typeof content !== "string" || typeof sha !== "string") {
      res.status(400).json({ error: "Request must include content and sha" });
      return;
    }

    const result = await saveCvFile({ content, sha, committerEmail: email });
    res.status(200).json({ sha: result.sha });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
};
