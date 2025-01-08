import { Router } from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js"
import { getContactsForDMList, searchContact } from "../controller/ContactController.js";
const contactRoute = Router()


contactRoute.post("/search",verifyToken,searchContact)
contactRoute.get("/get-contact-dm",verifyToken,getContactsForDMList)


export default contactRoute