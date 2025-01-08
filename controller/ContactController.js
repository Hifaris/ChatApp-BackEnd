import mongoose from "mongoose"
import User from "../models/UserModel.js"
import createError from "../utils/createError.js"
import Message from "../models/MessageModel.js"

export const searchContact = async (req, res, next) => {
    try {
        const { searchTerm } = req.body
        console.log(searchTerm, "serach")
        if (searchTerm === undefined || searchTerm === null) {
            return createError(400, "Search text is required")
        }

        const sanitizedSearchTerm = searchTerm.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        )

        const regex = new RegExp(sanitizedSearchTerm, "i")

        const contacts = await User.find({
            $and: [
                { _id: { $ne: req.userId } },
                {
                    $or: [{ firstName: regex }, { lastName: regex }, { email: regex }]
                }
            ]
        })

        return res.status(200).json({ contacts })
    } catch (error) {
        next(error)
    }
}

export const getContactsForDMList = async (req, res, next) => {
    try {
        let { userId } = req;

        userId = new mongoose.Types.ObjectId(userId);
        console.log(userId,"userrrr")

        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { recipient: userId }]
                }
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    // find id of คู่สนทนา
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$recipient",
                            else: "$sender"
                        }
                    },
                    lastMessageTime: { $first: "$timestamp" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo"
                }
            },
            {
                $unwind: "$contactInfo"
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color",

                }
            },
            {
                $sort: { lastMessageTime: -1 }
            }
        ])
        console.log(contacts)
        return res.status(200).json({contacts})
    } catch (error) {
        next(error)
    }
}