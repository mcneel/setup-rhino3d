# setup-rhino3d
Github Action to install Rhino3d

This action supports installing Rhino from version 8.8.

## Inputs

### `api-key`

**Required** The apikey you create when setting up core-hour billing. Please see [this article](https://developer.rhino3d.com/guides/compute/core-hour-billing/#setting-up-core-hour-billing) for instructions on setting up core-hour billing. 

This api key should be stored as a repository secret. For more information on setting up repository secrets, see [this article](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions?tool=webui#creating-secrets-for-a-repository).
See below for an example on how to use this api key, stored as a repository secret, in your workflow. 

### `rhino-version`

**Optional** The version of Rhino to install in `majorRelease.serviceRelease` format, for example 8.8. If no `rhino-version` is specified, this action will install the latest service release of Rhino.

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

This action uses vercel/ncc to compile the source and dependencies into one file. These practices are inherited from [this tutorial](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action#commit-tag-and-push-your-action-to-github) on setting up a GitHub Action. 

1. Install vercell/ncc: `npm i -g @vercel/ncc` - note, perhaps this should be dev-dependency in the future
2. From the `setup-rhino3d` directory, run `npm run build`
3. Commit the changes in `dist/*`

