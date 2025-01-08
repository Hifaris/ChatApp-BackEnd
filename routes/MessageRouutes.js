import {Router} from "express"
import { verifyToken } from "../middleware/AuthMiddleware.js"
import { getMessages, uploadFile } from "../controller/MessagesController.js"
import multer from "multer"

const messageRoute = Router()

const upload = multer({dest:"uploads/files"})

messageRoute.post("/get-message",verifyToken,getMessages)
messageRoute.post("/upload-file",verifyToken,upload.single("file"),uploadFile)

export default messageRoute