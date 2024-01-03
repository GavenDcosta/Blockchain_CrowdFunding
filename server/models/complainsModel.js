import mongoose from 'mongoose'

const complainSchema = mongoose.Schema({
    srno : {type:Number},
    userid : {type:String},
    campaignuserid: {type: String},
    reason: {type:String}
})

const Complain = mongoose.model("Complain", complainSchema)

export default Complain