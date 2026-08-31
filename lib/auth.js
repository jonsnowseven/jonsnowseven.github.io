const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function requireAllowedUser(req) {
  const header = req.headers["authorization"] || "";
  const idToken = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!idToken) {
    const err = new Error("Missing bearer token");
    err.status = 401;
    throw err;
  }

  let payload;
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (e) {
    const err = new Error("Invalid Google ID token");
    err.status = 401;
    throw err;
  }

  if (!payload || !payload.email_verified || payload.email !== process.env.ALLOWED_EMAIL) {
    const err = new Error("Not authorized");
    err.status = 403;
    throw err;
  }

  return payload.email;
}

module.exports = { requireAllowedUser };
