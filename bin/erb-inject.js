import * as fs from 'fs';
import * as path from 'path';

const target = "build/index.html";

// Generate tags to inject
if (process.argv.length < 3) {
    console.log(`Usage: yarn rails-build:inject [path to injectable file]`);
}

const injectionContent = fs.readFileSync(process.argv[2], 'utf8');

let fileContents = fs.readFileSync(target, 'utf8');

// strip out existing csrf testing token
// and inject the new tags
fileContents = fileContents.replace(/<!-- replace_csrf\/ -->.*<!-- \/replace_csrf -->/gs, injectionContent);

fs.writeFileSync(target,fileContents, 'utf8');
fs.rename(target, `${target}.erb`,()=>{});