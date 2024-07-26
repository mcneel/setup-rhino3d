# setup-rhino3d

Github Action to install Rhino3d

This action supports installing Rhino from version 8.8.

## Inputs

### email-address

**Required** The email of the associated user.

### `rhino-version`

**Optional** The version of Rhino to install in `majorRelease.serviceRelease`
format, for example 8.8. If no `rhino-version` is specified, this action will
install the latest service release of Rhino.

NOTE: Currently only using whaever the latest version of Rhino that is published. See #2

### A note about the Rhino Token

The workflow using this action should set an env variable with the Rhino Token you create when setting up core-hour billing. Please see
[this article](https://developer.rhino3d.com/guides/compute/core-hour-billing/#setting-up-core-hour-billing)
for instructions on setting up core-hour billing.

This Rhino Token should be stored as a repository secret. For more information on
setting up repository secrets, see
[this article](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions?tool=webui#creating-secrets-for-a-repository).
See below for an example on how to use this api key, stored as a repository
secret, in your workflow.

## Example usage

```yaml

env:
  RHINO_TOKEN: ${{ secrets.RHINO_TOKEN }}

jobs:
    build:
      - name: Install Rhino
        uses: mcneel/setup-rhino3d@v0.0.3-beta
        id: setup_rhino
        with:
          rhino-version: 8.9
          email-address: ${{ secrets.EMAIL_ADDRESS }}
```

## Development

After you've cloned the repository to your local machine or codespace, you'll
need to perform some initial setup steps before you can develop your action.

> [!NOTE]
>
> You'll need to have a reasonably modern version of
> [Node.js](https://nodejs.org) handy. If you are using a version manager like
> [`nodenv`](https://github.com/nodenv/nodenv) or
> [`nvm`](https://github.com/nvm-sh/nvm), you can run `nodenv install` in the
> root of your repository to install the version specified in
> [`package.json`](./package.json). Otherwise, 20.x or later should work!

1. 🛠️ Install the dependencies

   ```bash
   npm install
   ```

2. 🏗️ Package the JavaScript for distribution

   ```bash
   npm run bundle
   ```

NOTE: At the time of writing, this will not copy script/setup-rhino.ps1 to dist/setup-rhino.ps1. If you change this script, you should move over the changes manually

3. ✅ Run the tests

   ```bash
   $ npm test

   PASS  ./index.test.js
     ✓ throws invalid number (3ms)
     ✓ wait 500 ms (504ms)
     ✓ test runs (95ms)

   ...
   ```

### Committing Changes and tags

Users expect to consume this action via a version number associated with a tag. Do not forget to add a tag to any commit you wish to use or have users be able to use.