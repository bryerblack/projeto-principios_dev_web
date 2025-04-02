import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "profile-images",
      allowed_formats: ["jpg", "jpeg", "png"],
      transformation: [{ width: 300, height: 300, crop: "limit" }],
    };
  },
});

export const upload = multer({ storage });