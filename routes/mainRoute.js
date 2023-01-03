const express=require('express')
const router=express.Router();
const authenticaionMiddleware=require('../middlewear/authMiddlewear')
const {login,dashboard}=require('../Controllers/mainController')


//dashboard will  be protected by the authenticaionMiddleware means anytime anyone  
//want to reach the dasahboard will have to pass throuhg authentication
router.route('/dashboard').get(authenticaionMiddleware,dashboard);
router.route('/login').post(login);

module.exports=router;