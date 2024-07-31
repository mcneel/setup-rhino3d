# setup-rhino3d

![Linter](https://github.com/mcneel/etup-rhino3d/actions/workflows/linter.yml/badge.svg)
![CI](https://github.com/mcneel/setup-rhino3d/actions/workflows/ci.yml/badge.svg)
![Coverage](./badges/coverage.svg)

This action supports automating the download and installation of the latest
published Rhino3d service release onto Windows runners. The objective is to
facilitate the setup of Rhino for automated workflows such as CI and automated
testing.

## What this action does

- Downloads the latest Rhino for Windows (8 at the time of writing) service
  release installer.
- Installs the downloaded Rhino installer.

## What this action does not do

- This action does not do anything related to licensing Rhino, either with a
  Core-Hour Billing Token or Rhino Account.
- This action does not do anything related to automatically running Rhino.
- This action does not do anything related to automated testing.
- This action does not allow you to specify a Rhino version.

## Example usage

```yaml
# ...

jobs:
  build:
    - name: Install Rhino
      uses: mcneel/setup-rhino3d@v1.0.0
      with:
        email-address: ${{ secrets.EMAIL_ADDRESS }}
# ...
```

## Inputs

### email-address

**Required** The email of the associated user.

> [!NOTE]
>
> It is recommended that you save this email address as a repository secret. For
> more information on setting up repository secrets, see
> [this article](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions?tool=webui#creating-secrets-for-a-repository).

### A note about the Rhino Token

The workflow using this action should set an env variable with the Rhino Token
you create when setting up core-hour billing. Please see
[this article](https://developer.rhino3d.com/guides/compute/core-hour-billing/#setting-up-core-hour-billing)
for instructions on setting up core-hour billing.

This Rhino Token should be stored as a repository secret. For more information
on setting up repository secrets, see
[this article](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions?tool=webui#creating-secrets-for-a-repository).

```yaml
# ...

env:
  RHINO_TOKEN: ${{ secrets.RHINO_TOKEN }}

jobs:
  build:
    - name: Install Rhino
      uses: mcneel/setup-rhino3d@v1.0.0
      with:
        email-address: ${{ secrets.EMAIL_ADDRESS }}
# ...
```

## Related Projects

### SimpleRhinoTests

Demonstration of using setup-rhino3d in an automated testing scenario. Uses the
Rhino.Testing nuget package (see below) to start Rhino and run tests.

- [repository](https://github.com/mcneel/SimpleRhinoTests)
- [workflow](https://github.com/mcneel/SimpleRhinoTests/actions/runs/10159446794/workflow#L25)
- [successful run of the setup-rhino3d action](https://github.com/mcneel/SimpleRhinoTests/actions/runs/10159446794/job/28093702909#step:4:1)

```bash
Run mcneel/setup-rhino3d@v1.0.0
Downloading and installing the latest Rhino 3d...

===>  Successfully installed Rhino 8.9.24194.18121
```

### Rhino.Testing

NUnit dotnet unit testing for Rhino3D.

- [repository](https://github.com/mcneel/Rhino.Testing)
- [nuget package](https://www.nuget.org/packages/Rhino.Testing/)

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

    > [!NOTE]
    >
    > At the time of writing, this will not copy `script/setup-rhino.ps1` to
    > `dist/setup-rhino.ps1`. If you change this script, you should move over the
    > changes manually

3. ✅ Run the tests

   ```bash
   $ npm test

   PASS  ./index.test.js
    ✓ calls run when imported (9 ms)

   PASS  ./main.test.js
     ✓ sets the input values (84 ms)
     ✓ fails on Linux (17 ms)
     ✓ fails on macOS (22 ms)
     ✓ output script name on Windows (4 ms)
     ✓ runScript returns
   ```

### Committing Changes and tags

If you have modified any of the js code, do not forget to run `npm run bundle`
prior to committing changes. Also, if you have modified the
`script/setup-rhino.ps1`, please manually copy the changes to
`dist/setup-rhino.ps1`.

Users expect to consume this action via a version number associated with a tag.
Do not forget to add a tag to any commit you wish to use or have users be able
to use.
