# Isfahan

Isfahan is a javascript library, based on d3.js, for creating tiling window environments within webpages.

## Who uses Isfahan

* https://github.com/IIIF/mirador
* https://github.com/mekarpeles/browser

## Installation

* Install node.js: see https://nodejs.org/download/
* Clone the repository: `git clone https://github.com/aeschylus/Isfahan.git`
* Install project dependencies: `npm install`
* Add gulp to your path, if needed: `sudo npm install -g gulp`

## Developer's Guide
The best way to contribute to Isfahan is by starting with the example project provided by the library. The following assumes you have completed the installation instructions above:

* Change into the examples directory: `cd Isfahan/examples`
* Run `gulp watch &` to reload build as files are modified (& runs in background)
* Run SimpleHTTPServer within the examples directory: `python -m SimpleHTTPServer`
* Point your browser to: `<your-browser> localhost:8000`


