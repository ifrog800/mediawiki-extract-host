# mediawiki-extract-host
The goal of this repo is to export a MediaWiki sqlte3 database into text files.
Then be able to view said wiki pages a browser view.

<hr>

# Setup
This is setup to be run in a Docker environment. Although, it is possible to run it
as is on a host OS. Instructions for both will be provided.


## Docker
For a Docker environment run the following commands:
```sh
git clone https://github.com/ifrog800/mediawiki-extract-host.git
cd mediawiki-extract-host
docker-compose build
docker-compose up -d
```


## Running on a host OS
For running this on a host OS run the following commands:
```shell
git clone https://github.com/ifrog800/mediawiki-extract-host.git
cd mediawiki-extract-host
npm i
```

If you are on Windows run `npm run build-win`.

Otherwise, if you are on Unix/Linux run `npm run build-unix`.

Then to run the program run `npm run main`.

<hr>

## Notes
- On first run the program will crash since there is no sqlite file in the newly created
`.data` folder. To fix this copy the existing MediaWiki sqlite database into the `.data`
folder. Then name the file exactly `wiki.sqlite` for this program to recognize it.


- To rebuild the wiki text files, delete `data.json` within the `.data` directory,


- By default, the site will be running on port `42321` at [http://localhost:42321](http://localhost:42321).
  - For Docker installations, this can be changed in `docker-compose.yml` by changing `"42321:42321"` to `"8080:42321"`.
  - Alternatively, if running on a host OS then go in `src/server.ts`. Then change the `port` variable from 
`const port = 42321;` to `const port = 8080;`.
  - With the changed port, the app is now accessed on port `8080` at [http://localhost:8080](http://localhost:8080).


- On Windows if an error similar to the following appears, then run `npm rebuild`.
```shell
Error: Cannot find module 'C:\...\mediawiki-extract-host\node_modules\sqlite3\lib\binding\napi-v6-win32-unknown-x64\node_sqlite3.node'
Require stack:
- C:\...\mediawiki-extract-host\node_modules\sqlite3\lib\sqlite3-binding.js
- C:\...\mediawiki-extract-host\node_modules\sqlite3\lib\sqlite3.js
- C:\...\mediawiki-extract-host\dist\extractor.js
- C:\...\mediawiki-extract-host\dist\main.js
```
