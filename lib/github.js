const API = "https://api.github.com";
const FILE_PATH = "content/cv.md";

function repoParts() {
  const [owner, repo] = (process.env.GITHUB_REPO || "").split("/");
  if (!owner || !repo) {
    throw new Error("GITHUB_REPO env var must be set to 'owner/repo'");
  }
  return { owner, repo };
}

function headers() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function getCvFile() {
  const { owner, repo } = repoParts();
  const branch = process.env.GITHUB_BRANCH || "main";
  const url = `${API}/repos/${owner}/${repo}/contents/${FILE_PATH}?ref=${branch}`;

  const res = await fetch(url, { headers: headers() });
  if (!res.ok) {
    throw new Error(`GitHub GET failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return {
    content: Buffer.from(data.content, "base64").toString("utf-8"),
    sha: data.sha,
  };
}

async function saveCvFile({ content, sha, committerEmail }) {
  const { owner, repo } = repoParts();
  const branch = process.env.GITHUB_BRANCH || "main";
  const url = `${API}/repos/${owner}/${repo}/contents/${FILE_PATH}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Update CV via admin panel",
      content: Buffer.from(content, "utf-8").toString("base64"),
      sha,
      branch,
      committer: { name: "CV Admin", email: committerEmail },
    }),
  });

  if (res.status === 409 || res.status === 422) {
    const err = new Error("CV was changed elsewhere since you loaded it — reload and try again");
    err.status = 409;
    throw err;
  }
  if (!res.ok) {
    throw new Error(`GitHub PUT failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return { sha: data.content.sha };
}

module.exports = { getCvFile, saveCvFile };
