# CLDF Explorer
## Background
As part of a recent deep dive into data accessibility practices in Bayesian phylolinguistics, I found that while data was often shared in the [CLDF format](https://cldf.clld.org/), I was unable to find a simple tool to explore large CLDF datasets to aid in the review of language data and cognate judgements. To rectify this and make large CLDF datasets easier to read for a human, CLDF Explorer allows users to open full datasets, browse, filter, and search individual tables, and view links between tables.

## Installation
Installation files for Windows, Mac, and Linux (Debian (.deb), Red Hat (.rpm), Arch (.pacman)) are available in the [releases section](https://github.com/cbodnaruk/cldf-explorer/releases/latest) of this repository. 

Alternatively, the software can be compiled from source by running the following commands in the repo locally, with npm and Node.js (v23 or later) installed:


```
$ npm install

$ npm run compile
```

The binaries compiled for your OS will be available in the `/dist` directory.

## Planned Features
- Data analysis, statistical measurement tools etc
- Add/Remove columns in the style of SQL joins
  - At the moment when you open, for instance, a cognate table, you can see the form it is linked to via a foreign key, but not the language it is from, which is a further table away referenced by the form.

## Citation
I don't particularly see this being necessary, but in case you wish to cite this software, the following is suggested:

Bodnaruk, Carl. (2025). CLDF Explorer [*\<version used\>*]. https://github.com/cbodnaruk/cldf-explorer

```
@Software{cldf-explorer,
  author  = {Bodnaruk, Carl},
  title   = {CLDF Explorer},
  url     = {https://github.com/cbodnaruk/cldf-explorer},
  version = {0.1.0},
  year    = {2025},
}
```