import mongoose from "mongoose"
import { config } from "./index.ts"

export const connectDB = async (uri: string = config.MONGO_URI) => {
    await mongoose.connect(uri)
}

export const disconnectDB = async () => {
    await mongoose.disconnect()
}
