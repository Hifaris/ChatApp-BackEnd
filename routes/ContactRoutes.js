import { Router } from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js"
import { searchContact } from "../controller/ContactController.js";
const contactRoute = Router()


contactRoute.post("/search",verifyToken,searchContact)


export default contactRoute