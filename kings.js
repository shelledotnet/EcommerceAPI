//console.log(global);
const os=require('os');
const path=require('path');
const fs = require("fs");

//console.log(path.parse(__filename).name)

fs.readFile('./files/starts.txt','utf8',(err,data)=>{
    if(err) throw err;
    console.log(data);
})
console.log('Hello...');

//exit on uncaught error
process.on('uncaughtException',err=>{
    console.error(`There was an uncaught error:${err}`)
    process.exit(1);
})