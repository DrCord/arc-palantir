# Palantir

Arcimoto dashboard, provides an internal and a public version that display relevant info to the user.

## Contributors

Repo Man (Project Lead, Authorizes changes to master branch): Cord Slatton

## Contributing

### Git commit formatting

We use the `Angular git commit` style

Full (long) version:

```git commit template
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Short version

```git commit template
<type>(<scope>): <subject>
```

See https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-format more details

VS Code extension that helps you to make the commit msg, no need to remember your scope, etc.:
https://marketplace.visualstudio.com/items?itemName=Jhecht.git-angular

We use the allowed `types` from https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-format

We use custom `scopes` per repository, see `scopes` below. You may add scopes if needed.

#### Scopes

- abilities
- access
- api
- authorities
- component
- fleets
- managed sessions
- menu
- models
- recalls
- store
- requests
- root
- user
- vehicles
- views

### Pull Request (PR) Review

When creating a Pull Request for this repositiory the creator must make sure that what needs review in the built app is clear. For example, ping the reviewers on the ticket with a note about where to look in the UI for the changes under review.

Before approval of a pull request for this repository the reviewing developer is required to:

1. Do a code review of the changes
2. Checkout the feature branch locally, build the app and review the changes.

### Commitizen

[commitizen](https://github.com/commitizen/cz-cli) is a git commit tool. It allows you to use a prompt that will end up writing your commit message and description for you. This helps you make commit messages that will work with automatic versioning.

`cz-conventional-changelog`, is a template of the questions you’ll be asked when you make a commit. You can install other available templates. This is set in the `config`:`commitizen`:`path` property of the `package.json` file.

[VSCode support via extension](https://marketplace.visualstudio.com/items?itemName=KnisterPeter.vscode-commitizen)

#### Setup

To get started install commitizen globally on your computer:

`npm install -g commitizen`

git cz and git commit will now both do the same thing, the only difference is that if you have a project with a commitizen compatable changelog npm package, it will go through the changelog prompt.

## Automatic Versioning

This package automatically updates it's version in `package.json` using [semantic versioning](https://semver.org/) via the [semantic-release](https://github.com/semantic-release/semantic-release) package. It runs on a merge to the `master` branch via bitbucket Continous Integration (CI) (see `bitbucket-pipelines.yml`, `update-version`). After updating the version in `package.json` it commits to `master` and then rebases `master` onto `dev` and `staging` so they get the version number.

### Semantic Version Schema

`MAJOR.MINOR.PATCH`

### Initial Setup

- Require `Commitizen` for all contributors (see above)
- set config for `Commitizen` in `package.json`

```cli
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

- Install `semantic release` package and plugins

```cli
npm install --save-dev semantic-release
```

```cli
npm install --save-dev @semantic-release/commit-analyzer @semantic-release/release-notes-generator @semantic-release/npm @semantic-release/changelog @semantic-release/git @saithodev/semantic-release-backmerge
```

- Update `package.json`

``` json
"release": {
  "repositoryUrl": "git@bitbucket.org:arcimotocode1/palantir.git",
  "branches": [
    "master"
  ],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/npm",
    "@semantic-release/changelog",
    [
      "@semantic-release/git",
      {
        "assets": [
          "package.json"
        ],
        "message": "chore(release): ${nextRelease.version} auto-versioning [skip ci]"
      }
    ],
    [
      "@saithodev/semantic-release-backmerge",
      {
        "branchName": "dev",
        "clearWorkspace": true
      }
    ],
    [
      "@saithodev/semantic-release-backmerge",
      {
        "branchName": "staging",
        "clearWorkspace": true
      }
    ]
  ]
}
```

- Set up a programmatic user in BitBucket for committing in the pipeline.
- Setup the repository SSH authentication key and assign it to the programmatic user.
  - In Bitbucket, from your repository click Settings
  - Under Pipelines, click SSH Keys > Generate keys
  - Copy the public key to your clipboard
  - from your avatar in the bottom left click Bitbucket Settings > SSH Keys
  - Click Add Key, and paste the public key, providing a useful name and description
- Add the programmatic user to the allowed to merge list for the `dev`, `staging` and `master` branches in BitBucket repository settings-> branch permissions for the repository.

### Configuration

Uses angular commit style to evaluate commits for automatic semantic versioning. We use the [default rules](https://github.com/semantic-release/commit-analyzer/blob/master/lib/default-release-rules.js) from [semantic-release: commit-analyzer](https://github.com/semantic-release/commit-analyzer).

Scope => Release Type

- feat => minor
- fix => patch
- perf => patch

`breaking` in the commit message will result in a `major` release
`revert` in the commit message results in a `patch` release

## Environments

| Description | Code    |
| ----------- |:-------:|
| Development | dev     |
| Staging     | staging |
| Production  | prod    |

## Getting Started

### Links to deployed versions of the Arcimoto Dashboard

#### Dev

- Internal

#### Staging

#### Production

### Prerequisites

- To use in browser: none
- To run locally: - download and install NodeJS for your OS [https://nodejs.org/en/download/]

### Installation

1. Clone the repo
2. Get the font awesome pro token from AWS secrets manager (font-awesome-pro-token)
3. Add the font awesome pro token to your `.bashrc`
    - `echo 'export FONTAWESOME_NPM_AUTH_TOKEN={{FONT-AWESOME-PRO-TOKEN}}' >> ~/.bashrc`
    - `source ~/.bashrc`
4. Install dependencies - `npm i`
5. Run `FONTAWESOME_NPM_AUTH_TOKEN={{FONT-AWESOME-PRO-TOKEN}} npm install --save @fortawesome/fontawesome-pro` with the token from secrets manager substituted for `{{FONT-AWESOME-PRO_TOKEN}}`

### Usage

To run locally you will need the localhost [proxy-server project](https://bitbucket.org/arcimotocode1/aws_api_proxy/src/master/) running. If you have it setup as another project at the same level as this, then the npm script 'proxy' included with this project via the package.json file can run the proxy-server with the command `npm run proxy` from the root of this project.

To run with the local development version:

```bash
VUE_APP_CONNECTION_TYPE=localhostproxy npm run serve
```

NOTE: When running the local version for development the google maps API key only has `http://localhost:8080` as the allowed referrer, using any other port than `8080` will result in disallowed referrer errors from the `vehicle-locations` component.

To run a *version* for an *environment*:

```bash
VUE_APP_CONNECTION_TYPE=localhostproxy VUE_APP_ENVIRONMENT={{ENVIRONMENT_CODE}} npm run serve
```

To run prodution build locally for E2E testing or preview

```bash
VUE_APP_CONNECTION_TYPE=localhostproxy vue-cli-service serve --mode production
```

### Flags

VUE_APP_ENVIRONMENT - allows `dev`, `staging`, `prod` (default: `dev`) - configures which *environment* of the app to run/build

VUE_APP_CONNECTION_TYPE - allows `localhostproxy` or `regular` - used to force API requests to use the localhost proxy for development.

## Pipelines

Note: You can only have one in-progress deployment in each Bitbucket Deployment Environment. In progress Bitbucket pipelines will cause any later started pipeline(s) using the shared Deployment Environment to be put into a paused state. The pipeline that is paused will not automatically resume, but rather must be manually re-run once the running pipeline that caused the pause finishes. See [https://jira.atlassian.com/browse/BCLOUD-16304] for more information about the possibility of this becoming configurable.

### PR to dev branch from feature branch

Note: Branch name must be prefixed with `TEL-` to run this pipeline.

Tests app code by creating development and production builds then emails the git commit creator upon completion of the tests.

### Merge to dev branch

Builds the `development` version and deploys to the `dev` endpoint then emails the git commit creator upon completion of deployment.

### Merge to staging branch

Builds the `production` version and deploys to the `staging` endpoint then emails the git commit creator upon completion of deployment.

### Merge to master branch

Builds the `production` version and deploys to the `production` endpoint then emails the git commit creator upon completion of deployment. Also emails a release notification to `palantir-pilot@arcimoto.com`.
