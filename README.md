# BlitzMax NG Initialize Action
GitHub Action that allows you to initialize a specific BlitzMax NG version.

## Usage
Example workflow:

```yml
# file: .github/workflows/blitzmax-pipeline.yml
name: blitzmax-pipeline

on:
  workflow_dispatch:

jobs:
  run:
    name: Run
    runs-on: ubuntu-latest
    steps:
    - name: Checkout repository
      uses: actions/checkout@v2

    - name: Initialize latest BlitzMax NG version
      uses: hezkore/blitzmax-init-action@v1
      with:
        bmx-version: latest
      id: bmx

    - name: Build repository app
      run: bmk makeapp -r main.bmx
```

## Inputs

- `bmx-version`: BlitzMax version.\
Can be either exact version number or `latest` _(by default)_.
