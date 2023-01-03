class CustomAPIError extends Error{
    constructor(message){
        super(message)
    }
}
/*
const createCustomError=(msg,statuscode)=>{
  return  new CustomAPIError(msg,statuscode);
}
*/
module.exports=CustomAPIError