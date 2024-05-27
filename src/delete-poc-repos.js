require('dotenv').config({path: __dirname + '/../.env.local'});
const Octokit = require("@octokit/rest").Octokit;
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// Read the regex from an environment variable or use default to match repos starting with 'poc-'
const repoNameRegexPattern = process.env.REPO_REGEX || '^poc-.*$';
const repoNameRegex = new RegExp(repoNameRegexPattern);

const askQuestion = function (query) {
  return new Promise(function (resolve) {
    rl.question(query, resolve);
  });
};

const deleteReposWithRegex = function () {
  octokit.rest.repos.listForAuthenticatedUser({
    per_page: 100 // Adjust as needed, up to a maximum of 100
  }).then(function (response) {
    const repos = response.data;
    const filteredRepos = repos.filter(function (repo) {
      return repoNameRegex.test(repo.name);
    });

    if (filteredRepos.length === 0) {
      console.log(`No repos that matches the regex ${repoNameRegexPattern} found.`);
      rl.close();
      return;
    }

    console.log('The following repositories match the pattern and will be deleted:');
    filteredRepos.forEach(function (repo) {
      console.log(repo.name);
    });

    askQuestion('Do you want to proceed with deletion? (Y/N): ').then(function (answer) {
      if (answer.toLowerCase() === 'y') {
        filteredRepos.forEach(function (repo) {
          octokit.rest.repos.delete({
            owner: process.env.GITHUB_USERNAME,
            repo: repo.name
          }).then(function () {
            console.log(`Deleted repository: ${repo.name}`);
          }).catch(function (error) {
            console.error(`Error deleting repository ${repo.name}: ${error}`);
          });
        });
      } else {
        console.log('Deletion cancelled by user.');
      }
      rl.close();
    });
  }).catch(function (error) {
    console.error(`Error fetching repositories: ${error}`);
  });
};

deleteReposWithRegex();
