import express from "express"

import { getComplains, addComplain, removeComplain } from "../controllers/complainControllers.js"

const router = express.Router()

router.get('/', getComplains)
router.post('/givecomplain', addComplain)
router.delete('/deletecomplain/:id', removeComplain)


export default router