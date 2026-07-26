const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) {
      reject(new Error("No image buffer was provided"));
      return;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "sprint-11-posts",
        resource_type: "image",
        transformation: [
          {
            width: 1200,
            height: 675,
            crop: "limit",
          },
          {
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

module.exports = uploadToCloudinary;
