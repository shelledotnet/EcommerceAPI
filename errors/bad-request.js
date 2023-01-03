const CustomAPIError=require('./custom-error')
const {StatusCodes}=require('http-status-codes')


class BadRequest extends CustomAPIError{
    constructor(message){
        super(message),
        this.reasonCode='invalid request supplied',
        this.statusCode=StatusCodes.BAD_REQUEST
    }
}
/*
const createCustomError=(msg,statuscode)=>{
  return  new CustomAPIError(msg,statuscode);
}
*/
module.exports=BadRequest