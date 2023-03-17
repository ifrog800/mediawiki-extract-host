"use strict";
const table = document.getElementById("articleList");
let DATA = null;

async function main() {
    await fetch("/data.json")
        .then(data => {
            return data.json();
        })
        .then(data => {
            DATA = data;
        })
        .catch(console.error)

    const table = document.createElement("table");
    table.id = "articleSelectionTable";

    const th_td_modified = document.createElement("td");
    th_td_modified.textContent = "Last Modified";

    const th_td_title = document.createElement("td");
    th_td_title.textContent = "Article Title";

    const th = document.createElement("tr");
    th.appendChild(th_td_modified);
    th.appendChild(th_td_title);
    table.appendChild(th);

    for (let i = 0; i < DATA.length; i++) {
        const td_modified = document.createElement("td");
        const date = new Date(DATA[i].date)
        td_modified.textContent = `${date.toDateString()} ${date.toLocaleTimeString()}`;

        const td_name = document.createElement("td");
        td_name.classList.add("article-link");
        td_name.textContent = DATA[i].name;
        
        const tr = document.createElement("tr");
        tr.appendChild(td_modified);
        tr.appendChild(td_name);
        tr.onclick = () => { changeArticle(DATA[i].file); }
        table.appendChild(tr);
    }
    document.querySelector("#left > .container").appendChild(table)
}

async function changeArticle(title) {
    const target = document.getElementById("wikiContent");

    fetch(`/latest/${title}`)
        .then((res) => {
            return res.text();
        })
        .then(data => {
            target.innerText = data;
        })
        .catch(console.error)
    
    const header = document.getElementById("wikiContentHeader");
    DATA.forEach(page => {
        if (page.file === title)
            header.textContent = page.name;
    });
}


main()
