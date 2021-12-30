#! /usr/bin/env node
import fs from "fs";
import { JSDOM } from "jsdom";
import { extractOverviewFromHTML } from "./index.mjs";
const fsPromises = fs.promises;
const jsdom = new JSDOM();
const overview = extractOverviewFromHTML({
    DOMParser: jsdom.window.DOMParser,
    HTMLMetaElement: jsdom.window.HTMLMetaElement,
    html: await fsPromises.readFile(process.argv[2], "utf8"),
});
console.log(overview);
