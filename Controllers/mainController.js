const {v4:uuid}=require('uuid');
const jwt=require('jsonwebtoken');
const {BadRequest}=require('../errors');

const login=async(req,res,next)=>{
    const {username,password}=req.body;
    console.log({'username':username,'password':password});
    if(username && password){
      
      //just for Demo normally provided by the DB..
      const id=new Date().getDate()
       //below are the jwt payloads signature
      //1..try to keep payload small a better experinece for user.. pls avoid your password/confindential info and let it be an object
      //2..just for demo in production use long complex and ungessable string value!!!!!
      
      const token=jwt.sign(
                     {id,username},
                     process.env.JWT_SECRET,
                     {expiresIn:'300s'}   //time to expire (5min to 15min on prod)
                     )

      return res.status(200).json({data:'Hello, John Doe',token:`${token}`,success:true,ref:uuid()});
    }
    throw new BadRequest(`invalid username/password provided`)


}
const dashboard=async(req,res)=>{
  console.log(req.user);
  const luckyNumber=Math.floor(Math.random()*100)
  return res.status(200).json({data:`Hello, ${req.user.username}`,secret:`Here is your authorized data, your lucky number is ${luckyNumber}`,success:true,ref:uuid()});
}
module.exports={login,dashboard}