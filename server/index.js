import mongoose from "mongoose"
import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.use(cors({
    origin: "*",
}))


const CONNECTION_URL = process.env.CONNECTION_URL
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => app.listen(PORT, () => console.log(`Server running on port : ${PORT}`)))
  .catch((error) => console.log(error.message))

