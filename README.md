# setup-rhino3d

Github Action to install Rhino3d

This action supports installing Rhino from version 8.8.

## Inputs

### `api-key`

**Required** The apikey you create when setting up core-hour billing. Please see
[this article](https://developer.rhino3d.com/guides/compute/core-hour-billing/#setting-up-core-hour-billing)
for instructions on setting up core-hour billing.

This api key should be stored as a repository secret. For more information on
setting up repository secrets, see
[this article](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions?tool=webui#creating-secrets-for-a-repository).
See below for an example on how to use this api key, stored as a repository
secret, in your workflow.

### email-address

**Required** The email of the associated user.

### `rhino-version`

**Optional** The version of Rhino to install in `majorRelease.serviceRelease`
format, for example 8.8. If no `rhino-version` is specified, this action will
install the latest service release of Rhino.

## Outputs

### `time`

The time we greeted you.

## Example usage

```yaml
uses: mcneel/setup-rhino3dm@0.0.1
with:
  api-key: ${{ secrets.RhinoApiKey }} #required. You can name your secret whatever you like when you set it up.
  rhino-version: 8.9 #optional. if this is not set, this action will default to the latest service release
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

1. 🏗️ Package the JavaScript for distribution

   ```bash
   npm run bundle
   ```

1. ✅ Run the tests

   ```bash
   $ npm test

   PASS  ./index.test.js
     ✓ throws invalid number (3ms)
     ✓ wait 500 ms (504ms)
     ✓ test runs (95ms)

   ...
   ```
