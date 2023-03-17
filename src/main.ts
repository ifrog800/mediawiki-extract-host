import {stat} from "fs";
import Path from "path";
import {extractorMain} from "./extractor";
import {serverMain} from "./server";

stat(Path.resolve(`${__dirname}/../.data/www/data.json`), (err, stats) => {
    if (err) {
        extractorMain(`${__dirname}/../.data/wiki.sqlite`)
            .then(r => serverMain())
            .catch(console.error);
    } else {
        serverMain();
    }
});
