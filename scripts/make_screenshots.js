const puppeteer = require('puppeteer');
const path = require('path');
(async ()=>{
  const browser = await puppeteer.launch({args:['--no-sandbox','--disable-setuid-sandbox']});
  const page = await browser.newPage();
  const repo = 'C:/Users/User/desafiobaas';
  const items = [
    'bug01-before.html','bug01-after.html','bug02-before.html','bug02-after.html',
    'bug03-before.html','bug03-after.html','bug04-before.html','bug04-after.html',
    'bug05-before.html','bug05-after.html','bug06-before.html','bug06-after.html',
    'bug07-before.html','bug07-after.html','bug08-before.html','bug08-after.html'
  ];
  const outDir = path.join(repo,'session-files','screenshots');
  const fs = require('fs');
  if(!fs.existsSync(outDir)) fs.mkdirSync(outDir,{recursive:true});
  for(const item of items){
    const fileUrl = 'file:///' + path.join(repo,'session-files',item).replace(/\\/g,'/');
    console.log('Capturing', item, 'from', fileUrl);
    await page.setViewport({width:1400,height:800});
    await page.goto(fileUrl, {waitUntil:'networkidle2'});
    // small pause to allow rendering
    await new Promise(r=>setTimeout(r,250));
    const outPath = path.join(outDir, item.replace('.html','.png'));
    await page.screenshot({path: outPath, fullPage:true});
    console.log('Saved', outPath);
  }
  await browser.close();
})();

