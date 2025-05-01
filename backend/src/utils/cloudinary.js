import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"



cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  secure: true // Force HTTPS URLs
});


const uploadOnCloudinary = async (localFilePath) => {
    
    try{
        if(!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            secure: true // Force HTTPS URLs
        })
        fs.unlinkSync(localFilePath)
        
        // Ensure URL uses HTTPS
        if (response.url && response.url.startsWith('http:')) {
            response.url = response.url.replace('http:', 'https:');
        }
        
        return response;
    } catch(err){
        fs.unlinkSync(localFilePath)
        console.log("cloudinary upload error ", err)
        return null;
    }
}


export {uploadOnCloudinary}
