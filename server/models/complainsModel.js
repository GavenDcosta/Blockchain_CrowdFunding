import mongoose from 'mongoose'

const complainSchema = mongoose.Schema({
    srno : {type:String},
    userid : {type:String},
    reason: {type:String}
})

const Complain = mongoose.model("Complain", complainSchema)

export default Complain