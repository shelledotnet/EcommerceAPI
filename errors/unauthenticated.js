const CustomAPIError=require('./custom-error')
const {StatusCodes}=require('http-status-codes')


class UnAuthenticatedError extends CustomAPIError{
    constructor(message){
        super(message),
        this.reasonCode='user not authorized to access the resource due to invalid request supplied',
        this.statusCode=StatusCodes.UNAUTHORIZED
    }
}
/*
const createCustomError=(msg,statuscode)=>{
  return  new CustomAPIError(msg,statuscode);
}
*/
module.exports=UnAuthenticatedError