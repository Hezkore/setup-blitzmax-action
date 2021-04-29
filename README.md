[![logo](https://github.com/Hezkore/setup-blitzmax-action/blob/master/icons/extension-icon.png?raw=true)](https://blitzmax.org/)
# Setup BlitzMax NG Action
[GitHub Action](https://github.com/features/actions) that allows you to setup a specific [BlitzMax NG](https://blitzmax.org/) [version](https://github.com/bmx-ng/bmx-ng/tags) for later use.

## How does this work?
This action will run a job JavaScript that performs the following steps:
  * Fetch release info from [bmx-ng/releases](https://github.com/bmx-ng/bmx-ng/releases)
  * Figure out BlitzMax NG equivalent platform name
  * Find and download matching release for the specified BlitzMax NG version and platform
  * Decompress downloaded archive\
    _(.zip on MacOS, .7z on Windows and .tar.xz for every other OS)_
  * Build BlitzMax NG on platforms that provide a **'run_me_first.command'** file
  * Cache the BlitzMax NG root folder for future jobs
  * Add BlitzMax NG **'bin'** folder to **PATH**
  * Add **'BMX_BIN'** env variable
  * Set action output **'bmx-root'**\
    _(for easy access if modules need to be added)_

You can then use the BlitzMax NG compiler via the normal bmk commands.\
[Read more about bmk.](https://blitzmax.org/docs/en/tools/bmk/)

## Usage
Make sure you read the BlitzMax NG bmk docs:\
[blitzmax.org/docs/en/tools/bmk](https://blitzmax.org/docs/en/tools/bmk/)\
\
Example workflow:
```yml
# file: .github/workflows/blitzmax-pipeline.yml
name: blitzmax-pipeline

on:
  workflow_dispatch:

jobs:
  my-linux-job:
    name: Setup BlitzMax NG for Linux
    runs-on: ubuntu-latest
    steps:
    - name: Checkout repository
      uses: actions/checkout@v2

    - name: Setup latest BlitzMax NG version
      uses: hezkore/setup-blitzmax-action@v1
      with:
        bmx-version: latest
        # latest (default)
        # or version (e.g. 0.128.3.45)

    - name: Build repository app
      run: bmk makeapp -r main.bmx
```

## Inputs

* `bmx-version`: BlitzMax NG version.\
  Can be either exact version _(e.g. 0.128.3.45)_ or `latest` _(default)_.

## Output

* `bmx-root`: BlitzMax NG root directory.\
  Useful if modules needs to be added.

## More examples
```yml
# file: .github/workflows/blitzmax-pipeline.yml
name: blitzmax-pipeline

on:
  workflow_dispatch:
    inputs:
      bmx-ver:
        description: BlitzMax Version
        default: latest
        required: false

jobs:
  my-windows-job:
    name: Setup BlitzMax NG for Windows
    runs-on: windows-latest
    steps:
    - name: Checkout repository
      uses: actions/checkout@v2

    - name: Setup latest BlitzMax NG version
      uses: hezkore/setup-blitzmax-action@v1
      with:
        bmx-version: ${{ github.event.inputs.bmx-ver }}

    - name: Build repository app
      run: bmk makeapp -r main.bmx

  my-macos-job:
    name: Setup BlitzMax NG for MacOS
    runs-on: macos-latest
    steps:
    - name: Checkout repository
      uses: actions/checkout@v2

    - name: Setup latest BlitzMax NG version
      uses: hezkore/setup-blitzmax-action@v1
      with:
        bmx-version: ${{ github.event.inputs.bmx-ver }}

    - name: Build repository app
      run: bmk makeapp -r main.bmx

    # - name: Your custom step
    #  run: echo 'Hello World'

  my-linux-job:
    name: Setup BlitzMax NG for Linux
    runs-on: ubuntu-latest
    steps:
    - name: Checkout repository
      uses: actions/checkout@v2

    - name: Setup latest BlitzMax NG version
      uses: hezkore/setup-blitzmax-action@v1
      id: bmx # Set step reference ID
      with:
        bmx-version: ${{ github.event.inputs.bmx-ver }}

    - name: Echo BlitzMax NG root example
      run: echo '${{ steps.bmx.outputs.bmx-root }}' # Use step reference ID
```