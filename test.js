import { Selector, RequestLogger, ClientFunction, Role } from 'testcafe';

const appendObjecttoFile = async function(obj, name) {
    // name is filename that contains array of obj
    var fs = require('fs');
    var logStream = fs.createWriteStream(name, {flags: 'a'});
    // use {flags: 'a'} to append and {flags: 'w'} to erase and write a new file
    logStream.write(JSON.stringify(obj)+'\n');
    logStream.end();
}

const scrape = async (t) => {
    await t.navigateTo("http://www.paulgraham.com/articles.html");
    let links = Selector("a");
    let linkCount = await links.count;
    for(let i = 0; i < linkCount / 2; i++) {
        await t.navigateTo("http://www.paulgraham.com/articles.html");
        let link = links.nth(i);
        let link_href = await link.getAttribute("href");
        if(link_href == null) {
            continue;
        }
        if(link_href.includes("http") == true) {
            continue;
        }
        console.log("handling link: ", link_href);
        try{
            await t.click(link);
        }catch(err){
            console.log("error: ", err);
            continue;
        }
        let font = Selector("font").nth(0);
        let font_text = "";
        try{
            font_text = await font.innerText;
        }catch(err){
            console.log("error: ", err);
            continue;
        }
        appendObjecttoFile(font_text, "font_text.txt");
    }

}

fixture `Getting Started`
    .page `http://www.paulgraham.com/articles.html`;

test("test", async t => {
    await t.setNativeDialogHandler(() => true);  // handle pop up dialog boxes;
    await t.maximizeWindow();
    await scrape(t);
})