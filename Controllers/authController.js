//#region  Dependencys
const Ecommerceuser=require('../models/UserModel')
require("dotenv").config(); //accessing the environment variables
const {v4:uuid}=require('uuid');
const {BadRequest,UnAuthenticatedError,NotFound}=require('../errors');
const bycrypt=require('bcryptjs');
const {StatusCodes}=require('http-status-codes');
const jwt = require("jsonwebtoken");
const date = require("date-and-time");
const now  =date.addHours(new Date(),1);
const audEvents = require("../middleware/auditLogs");
const serialize = require("serialize-javascript");
//#endregion

//#region ActionMethod
const register=async(req,res)=>{
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Username /email and password ae required." });

   const newUser = new Ecommerceuser({
     username: req.body.username,
     email: req.body.email,
     password: req.body.password,
   });
   const guid = uuid();
   try{
      
      audEvents(
        `Request:${req.method}\t${serialize(req.body)}\t /api/v1/auth/${
          req.url
        })}`,
        "Log",
        guid
      );
     const users = await Ecommerceuser.create(newUser);
    const newFT={id:users.getId(),name:users.getName(),token:users.creatJWT()};
    audEvents(
      `Response:${req.method}\t${serialize(users)}\t /api/v1/auth/${
        req.url
      })}`,
      "Log",
      guid
    );
    return res
      .status(StatusCodes.CREATED) // this is seen by the client tool
      .json({
        data: newFT,
        code: StatusCodes.CREATED,
        success: true,
        ref: guid,
      });
   }catch(err){
audEvents(
      `Respose:${req.method}\t${serialize(err.message)}\t /api/v1/auth/${
        req.url
      })}`,
      "Log",
      guid
    );
return res
  .status(StatusCodes.INTERNAL_SERVER_ERROR) // this is seen by the client tool
  .json({
    data: err.message, //newFT,
    code: StatusCodes.INTERNAL_SERVER_ERROR,
    success: false,
    ref: uuid(),
  });
   }
   
}
const login = async (req, res) => {
  const { username, password } = req.body;
  //console.log({'username':username,'password':password});
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password ae required." });

  const guid = uuid();
  try {
    audEvents(
      `Request:${req.method}\t${serialize(req.body)}\t /api/v1/auth/${
        req.url
      })}`,
      "Log",
      guid
    );
    const user = await Ecommerceuser.findOne({ username });
    // console.log(user);
    // const { ...others } = user;
    // console.log(others);
    if (user) {
      const isPasswordCorrect = user.comparePasswordWithAES(password);
      console.log(isPasswordCorrect);
      if (isPasswordCorrect) {
        const newFT = {
          id: user._id,
          name: user.username,
          token: user.creatJWT(),
        };
        //#region saving refereshToken with current user MongoDB
        user.refreshToken = jwt.sign(
          { userId: user._id },
          process.env.REFRESH_TOKEN_SECRET,
          {
            expiresIn: process.env.REFRESH_TOKEN_LIFETIME, //time to expire (5min to 15min on prod)
            audience: process.env.AUDIENCE,
            issuer: process.env.ISSUER,
          }
        );
        await user.save();
        //console.log(user.refreshToken); //dont forget to delete this on PROD
        //#endregion
        audEvents(
          `Response:${req.method}\t${serialize(newFT)}\t /api/v1/auth/${
            req.url
          })}`,
          "Log",
          guid
        );
        //#region Sending RefereshToken
        //ensure u store d referesh token in memory dont store in local storage is not save...u can as well send it as  cookie (set it http-Only) with this is not vulnerable is not assceeble by javascript
        res.cookie("jwt", user.refreshToken, {
          httpOnly: true,
          sameSite: "None",
          maxAge: 24 * 60 * 60 * 1000,
        });
        //res.cookie('jwt',refreshToken,{httpOnly:true,sameSite:'None',secure:true,maxAge:24*60*60*1000}); // on PROD
        //secure:true -only serves on https not in development please add this when creatingcookies as well in prod

        //pls dont send the refershToke in json to the client only the accessToken is most preferd, send the refersh token as a cookie
        //#endregion
        return res.status(StatusCodes.OK).json({
          data: newFT,
          code: StatusCodes.OK,
          success: true,
          expires: date.addSeconds(now, 300),
          ref: uuid(),
        });
      }
      audEvents(
        `Reqsponse:${req.method}\t access denied for ${username}\t url:/api/v1/auth/${req.url})}`,
        "Log",
        guid
      );
      throw new UnAuthenticatedError(`access denied`);
    }
    audEvents(
      `Reqsponse:${req.method}\t invalid username ${username}\t /api/v1/auth/${req.url})}`,
      "Log",
      guid
    );
    throw new NotFound(`invalid username ${username} `);
  } catch (err) {
    audEvents(
      `Response:${req.method}\t error:${serialize(
        err.message
      )}\t /api/v1/auth/${req.url})}`,
      "Log",
      guid
    );
  }
  //  }
  // throw new BadRequest(`username/password required`);
};
//#endregion

module.exports={register,login}