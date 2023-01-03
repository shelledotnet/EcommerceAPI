const CustomAPIError=require('./custom-error')
const {StatusCodes}=require('http-status-codes')

class ForBiddenError extends CustomAPIError{
    constructor(message){
        super(message),
        this.reasonCode='user forbidden to access this resource',
        this.statusCode=StatusCodes.FORBIDDEN
    
    }
}
/*
const createCustomError=(msg,statuscode)=>{
  return  new CustomAPIError(msg,statuscode);
}
*/
module.exports=ForBiddenError