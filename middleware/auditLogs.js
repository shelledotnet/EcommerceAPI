const {format}=require('date-fns');
const {v4:uuid}=require('uuid');

const fs=require('fs');
const fsPromises=require('fs').promises;
const path=require('path');

const fcreateLogDir=(a)=>{
    if(!fs.existsSync(path.join(__dirname,'..',`${a}`))){
        fsPromises.mkdir(path.join(__dirname,'..',`${a}`));
    }
}


const audEvents=async(message,dir,uuid)=>{
    fcreateLogDir(dir)
    const file = `${format(new Date(), "yyyyMMdd")}.txt`;
    const dateTime=`${format(new Date(),'yyyyMMdd:HH:mm:ss')}`;
    const logItem=`${dateTime}\t correlationId:${uuid}\t${message}\n`;
    try{
        
        await fsPromises.appendFile(
          path.join(__dirname, "..",dir,file),
          logItem
        );

    }catch(err){
        
        await fsPromises.appendFile(
          path.join(__dirname, "..", dir, file),
          `${err.message}\t${logItem}`
        );
    }
}






module.exports=audEvents;

