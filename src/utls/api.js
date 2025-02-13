import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.STATUS,
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
