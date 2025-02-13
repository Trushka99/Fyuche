import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: `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`,
});

async function fetchAllRepos(userName, page) {
  try {
    const res = await octokit.request(`GET /users/${userName}/repos`, {
      type: "public",
      per_page: 20,
      page: page,
    });
    return res.data;
  } catch (err) {
    console.error(err);
  }
}

export default fetchAllRepos;
