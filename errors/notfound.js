const CustomAPIError=require('./custom-error')
const {StatusCodes}=require('http-status-codes')


class NotFound extends CustomAPIError{
    constructor(message){
        super(message),
        this.reasonCode="request doesn't exist",
        this.statusCode=StatusCodes.NOT_FOUND
    }
}
/*
const createCustomError=(msg,statuscode)=>{
  return  new CustomAPIError(msg,statuscode);
}
*/
module.exports=NotFound