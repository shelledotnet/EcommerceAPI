const {v4:uuid}=require('uuid');
const {StatusCodes}=require('http-status-codes')
const Job=require('../model/JobModel');
const {BadRequest,NotFound}=require('../errors');


const getJobById=async(req,res)=>{
    const {user:{userId},params:{id:jobId}}=req
    const findJob=await Job.findOne({_id:jobId,createdBy:userId})
                             .select('-_id createdBy position company status')
    console.log(findJob);
    if(findJob){
        return res.status(StatusCodes.OK).json({data:findJob,code:StatusCodes.OK,success:true,ref:uuid()});
    }
    throw new NotFound(`invalid job id ${jobId}`);


}
const getAllJob=async(req,res)=>{
                            const allJobs=await Job.find({createdBy:req.user.userId})
                                                   .sort('-createdAt')
                                                   .select('-_id createdBy position company status')  
    console.log(allJobs); 
    if(allJobs.length > 0){
        return res.status(StatusCodes.OK).json({data:allJobs,code:StatusCodes.OK,count:allJobs.length,success:true,ref:uuid()});
    } 
    throw new NotFound(`no job for user: ${req.user.userId}`)
                           

}
const createJob=async(req,res)=>{
    req.body.createdBy=req.user.userId
    const {company,position,createdBy}=req.body
    const jobCreate={company,position,createdBy}
    console.log(jobCreate);
    const createdJob=await Job.create(jobCreate);
    const resJob={id:createdJob._id,company:createdJob.company,createdBy:createdJob.createdBy}
    return res.status(StatusCodes.CREATED).json({data:resJob,code:StatusCodes.CREATED,success:true,ref:uuid()});

}
const updateJob=async(req,res)=>{
    //accepting the payload is right to left
    const {
        user:{userId},
        params:{id:jobId},
        body:{
            company,
            position,
            status
        }
        }=req
    //sending request is left to right
    const payload={company:company,position:position,status:status,createdBy:userId};
    console.log(payload);
    const updateModel = await Job.findOneAndUpdate({_id:jobId,createdBy:userId},payload,{
        new:true,
        runValidators:true,//this validate the request
        overwrite:true //this allow for full update
    })
    console.log(updateModel);
    if(updateModel){
        return res.status(StatusCodes.NO_CONTENT).json({data:updateModel,code:StatusCodes.NO_CONTENT,success:true,ref:uuid()});
    }
    throw new NotFound(`invalid job id ${jobId}`)


}
const patchJob=async(req,res)=>{
        //accepting the payload is right to left
        const {
            user:{userId},
            params:{id:jobId},
            body:{
                company,
                position,
                status
            }
            }=req

    //sending request is left to right
    const payload={company:company,position:position,status:status};
    console.log(payload);
    const updateModel = await Job.findOneAndUpdate({_id:jobId,createdBy:userId},payload,{
        new:true,
        runValidators:true//this validate the request
    })
    console.log(updateModel);
    if(updateModel){
        return res.status(StatusCodes.NO_CONTENT).json({data:updateModel,code:StatusCodes.NO_CONTENT,success:true,ref:uuid()});
    }
    throw new NotFound(`invalid job id ${jobId}`)

}
const deleteJob=async(req,res)=>{
    //accepting the payload is right to left
    const {
        user:{userId},
        params:{id:jobId}
        }=req
    const deleteJob=await Job.deleteOne({ _id: jobId,createdBy:userId}); 
    // returns {acknowledged: true,deletedCount: 1}
    console.log(deleteJob);
    if(deleteJob.deletedCount ===1){
      return  res.status(StatusCodes.NO_CONTENT).json({data:`task deleted ${jobId}`,code:StatusCodes.NO_CONTENT,success:true,ref:uuid()});

    }
    throw new NotFound(`invalid job id ${jobId}`)

}

module.exports={getAllJob,getJobById,createJob,updateJob,patchJob,deleteJob}