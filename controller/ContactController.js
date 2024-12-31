import User from "../models/UserModel.js"
import createError from "../utils/createError.js"

export const searchContact = async(req,res,next)=>{
    try {
        const {searchTerm} = req.body
        console.log(searchTerm ,"serach")
        if(searchTerm === undefined || searchTerm === null){
            return createError(400,"Search text is required")
        }

        const sanitizedSearchTerm = searchTerm.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        )

        const regex = new RegExp(sanitizedSearchTerm,"i")

        const contacts = await User.find({
            $and:[
                {_id:{$ne: req.userId}},
                {
                 $or:[{firstName:regex},{lastName:regex},{email:regex}]
                }
            ]
        })

        return res.status(200).json({contacts})
    } catch (error) {
        next(error)    
    }
}