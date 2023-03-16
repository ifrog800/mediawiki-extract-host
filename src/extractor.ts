import Path from "path";
import {mkdir, writeFile} from "fs";
import {Database} from "sqlite3";

interface WikiExtractResult {
    page_touched: string,
    page_title: string,
    old_text: string
}

interface Metadata {
    name: string,
    date: string,
    file: string
}

/**
 * Parses "yyyyMMddHHmmss" format into "MM dd, YYYY HH:mm:ss"
 * @param date string in the format yyyyMMddHHmmss
 * @return string in the format "MM dd, YYYY HH:mm:ss"
 */
function parseDate(date: string): string {
    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);
    const hour = date.substring(8, 10);
    const minute = date.substring(10, 12);
    const second = date.substring(12);

    return `${month} ${day}, ${year} ${hour}:${minute}:${second}`;
}


/**
 * Parses the SQL query by creating a file to store the wiki content.
 * @param result a WikiExtract formatted object
 * @return Metadata metadata associated with the entry | -1 for error
 */
function processWikiResult(result: WikiExtractResult): Promise<Metadata> {
    return new Promise((resolve, error) => {
        const baseDir = Path.resolve(`${__dirname}/../.data/www/latest/`);
        const safeText = result.page_title.replace(/ +/g, "_").match(/[a-z]|[A-Z]|[0-9]|-|_/g);
        let fileName: string;
        if (safeText)
            fileName = `${safeText.join("")}.txt`;
        else
            fileName = result.page_touched;

        mkdir(baseDir, {recursive: true}, (err) => {
            if (err) {
                console.error(`${new Date()} | Failed to create directory "${baseDir}"`);
                console.error(err);
                error(null);
            }

            writeFile(Path.resolve(`${baseDir}/${fileName}`), result.old_text, (err) => {
                if (err) {
                    console.error(`${new Date()} | Failed to write file "${fileName}"`);
                    console.error(err);
                    error(null);
                }

                console.info(`${new Date()} | Saved "${result.page_title}" to "${fileName}"`);
                resolve({
                    name: result.page_title,
                    date: parseDate(result.page_touched),
                    file: fileName
                })
            });
        });
    });
}

/**
 * Main entrypoint for dumping the mediawiki sqlite database.
 * @param path String of PathLike pointing to the sqlite database file.
 */
function main(path: string) {
    console.info(`${new Date()} | Start of extractor.ts`);
    // from https://superuser.com/a/827230
    const SQL = `
    SELECT page_touched, page_title, old_text
    FROM page
    JOIN revision ON page_latest = rev_id
    JOIN text ON rev_text_id = old_id`

    const resultingMetadata: Metadata[] = [];
    const db = new Database(path);

    db.all(SQL, async (err: Error, rows: WikiExtractResult[]) => {
        if (err)
            throw err;
        for (let i = 0; i < rows.length; i++) {
            const tmp = await processWikiResult(rows[i])
                .then((res) => {
                    resultingMetadata.push(res);
                })
                .catch(console.error);
        }

        const metadataFileLocation = Path.resolve(`${__dirname}/../.data/www/data.json`)
        writeFile(metadataFileLocation, JSON.stringify(resultingMetadata), (err) => {
            if (err) {
                console.error(`${new Date()} | ERROR saving metadata to ${metadataFileLocation}`);
                console.error(err);
            }
        });
    });

    db.close();
    console.info(`${new Date()} | End of extractor.ts`);
}


main(`${__dirname}/../.data/wiki.sqlite`);
