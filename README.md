# My Github utils
A small set of commands to ease the work with Github, uses [@octokit](https://github.com/octokit).

## Installation
1. run `npm i`
2. Copy `.env.template` to `.env.local` (ignored in Git)
3. Issue an [access token](https://github.com/settings/tokens?type=beta) in Github
4. Update your access token and username in `.env.local`

## Commands
# Delete
Run `npm run delete` in order to delete all repos in your Github account who's name matches the regular expression defined in `REPO_REGEX` environment variable.

You can either define the environment variable in the command line - i.e. run `REPO_REGEX="^poc-.*$" npm run delete` or define it in `.env.local`
