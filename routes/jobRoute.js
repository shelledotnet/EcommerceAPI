const express=require('express')
const router=express.Router();
const {getAllJob,getJobById,createJob,updateJob,patchJob,deleteJob}=require('../Controllers/jobController')


router.route('/').get(getAllJob)
                 .post(createJob);

router.route('/:id').get(getJobById)
                    .put(updateJob)
                    .patch(patchJob)
                    .delete(deleteJob);

module.exports=router;