import fs from 'fs'
import ImageKit from "imagekit"
import dotenv from 'dotenv'

dotenv.config()

const imagekit = new ImageKit({
    publicKey: process.env.CLOUDINARY_API_KEY,
    privateKey: process.env.CLOUDINARY_SECRET_KEY,
    urlEndpoint: process.env.CLOUDINARY_NAME,
})

const upload = async (filePath) => {
    try {
        const imageData = fs.readFileSync(filePath, { encoding: 'base64' })
        const result = await imagekit.upload({
            file: imageData,
            fileName: Date.now() + "-image",
            useUniqueFileName: true
        })
        return result.url
    } catch (error) {
        console.log(error)
        throw error
    }
}

export default upload