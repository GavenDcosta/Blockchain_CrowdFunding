import mongoose from "mongoose"
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import complainRoutes from './routes/complainRoutes.js'

dotenv.config()

const app = express()

app.use(express.json());

app.use(cors({
    origin: "*",
}))


app.use('/complains', complainRoutes)

const CONNECTION_URL = process.env.CONNECTION_URL
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => app.listen(PORT, () => console.log(`Server running on port : ${PORT}`)))
  .catch((error) => console.log(error.message))



