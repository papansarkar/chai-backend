import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"




// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// upload
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        // upload the file
        const response = await cloudinary.uploader
       .upload(
           localFilePath, {
               resource_type: "auto",
           }
       )
       // file has been uploaded successfully
       console.log("File is uploaded on cloudinary.", response.url)
    } catch (error) {
        // remove the locally saved (server) file as the cloudinary uplaod failed
        fs.unlinkSync(localFilePath)
        return null
    }
}

export {uploadOnCloudinary}