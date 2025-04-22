import dotenv from 'dotenv';
import { loadJsonFromGithub, saveJsonToGithub } from 'jnu-cloud';

// dotenv.config({ path: '../.env' });

const { ENV_GITHUB_OWNER, ENV_GITHUB_REPO, ENV_GITHUB_TOKEN } = process.env;
const ENV_GITHUB_API_URL = 'https://api.github.com';

const githubConfig = {
  owner: ENV_GITHUB_OWNER,
  repo: ENV_GITHUB_REPO,
  token: ENV_GITHUB_TOKEN,
};

console.log(`githubConfig: ${JSON.stringify(githubConfig)}`);

// const json = await loadJsonFromGithub('Apis/google/token_moondevgoog_0.json', githubConfig);
// await saveJsonToGithub('Apis/google/token_bigwhitekmc_9.json', json, githubConfig);

// import dotenv from 'dotenv';
// import { readJsonFromGithub, uploadJsonToGithub } from 'jnu-cloud';

// dotenv.config({ path: '../.env' });

// const { ENV_GITHUB_OWNER, ENV_GITHUB_REPO, ENV_GITHUB_TOKEN } = process.env;
// const ENV_GITHUB_API_URL = 'https://api.github.com';

// const githubConfig = {
//   owner: ENV_GITHUB_OWNER,
//   repo: ENV_GITHUB_REPO,
//   token: ENV_GITHUB_TOKEN,
// };

// console.log(`githubConfig: ${JSON.stringify(githubConfig)}`);

// const json = await readJsonFromGithub('Apis/google/token_bigwhitekmc_0.json', githubConfig);
// await uploadJsonToGithub('Apis/google/token_bigwhitekmc_9.json', json, githubConfig);

// console.log(`githubConfig: ${JSON.stringify(json)}`);
