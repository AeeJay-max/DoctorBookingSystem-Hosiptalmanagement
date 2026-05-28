import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config();

const connectCloudinary = async () => {
  global.cloudinary = new ImageKit({
    publicKey: process.env.CLOUDINARY_API_KEY,
    privateKey: process.env.CLOUDINARY_SECRET_KEY,
    urlEndpoint: process.env.CLOUDINARY_NAME,
  });
  console.log("✅ ImageKit Connected");
};

export default connectCloudinary;