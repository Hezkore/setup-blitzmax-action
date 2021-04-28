# Setup BlitzMax NG Action
GitHub Action that allows you to setup a specific BlitzMax NG version for later use.

## Usage
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
      uses: hezkore/blitzmax-init-action@v1
      with:
        bmx-version: latest

    - name: Build repository app
      run: bmk makeapp -r main.bmx
```

## Inputs

* `bmx-version`: BlitzMax NG version.\
  Can be either exact version number or `latest` _(by default)_.

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
      uses: hezkore/blitzmax-init-action@v1
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
      uses: hezkore/blitzmax-init-action@v1
      with:
        bmx-version: ${{ github.event.inputs.bmx-ver }}

    # - name: Build repository app
    #  run: your command line actions here

  my-linux-job:
    name: Setup BlitzMax NG for Linux
    runs-on: ubuntu-latest
    steps:
    - name: Checkout repository
      uses: actions/checkout@v2

    - name: Setup latest BlitzMax NG version
      uses: hezkore/blitzmax-init-action@v1
      with:
        bmx-version: ${{ github.event.inputs.bmx-ver }}

    # - name: Build repository app
    #  run: bmk makeapp -r main.bmx
```