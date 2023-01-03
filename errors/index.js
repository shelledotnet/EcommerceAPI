const CustomAPIError=require('./custom-error')
const BadRequest=require('./bad-request')
const ForBiddenError=require('./forbidden')
const NotFound=require('./notfound')
const UnAuthenticatedError=require('./unauthenticated')


module.exports={CustomAPIError,BadRequest,NotFound,ForBiddenError,UnAuthenticatedError}