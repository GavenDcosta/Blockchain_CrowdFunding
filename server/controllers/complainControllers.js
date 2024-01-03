import mongoose from "mongoose"
import Complain from '../models/complainsModel.js'

export const getComplains = async (req, res) => {
   try {

    const complains = await Complain.find()
    res.status(200).json(complains)

   } catch (error) {
    console.error(error);
    res.status(404).json({message : error})
   }
 
}

export const addComplain = async (req, res) => {
   const { srno, userid, reason } = req.body

   if (!srno || !userid || !reason) {
    return res.status(400).json({ message: "Missing required fields" });
   }

   const newComplain = new Complain({srno, userid, reason})  

   try{
    await newComplain.save()

    res.status(200).json(newComplain)

    }catch(error){
        console.error(error);
        res.status(500).json({message: error})
    }
}


export const removeComplain = async (req, res) => {
    try {
        const {id} = req.params

        const deletedComplain = await Complain.findByIdAndDelete(id)

        res.status(200).json(deletedComplain)

    } catch (error) {
        console.error(error);
        res.status(500).json({message: error})
    }
}