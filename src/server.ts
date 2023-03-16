import express from "express";
import Path from "path";

const app = express();
const port = 42321;


app.use(express.static(Path.resolve(`${__dirname}/www/`)));
app.use(express.static(Path.resolve(`${__dirname}/../.data/www/`)));
app.get("/*", (req, res) => {
    res.sendFile(Path.resolve(`${__dirname}/www/index.html`));
});

app.listen(port, () => {
    console.log(`${new Date()} | Listening @ http://localhost:${port}`);
});