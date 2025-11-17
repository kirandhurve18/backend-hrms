const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");

// Create S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ✅ Upload File
async function uploadToS3(file, folder = "upload") {
  try {
    const fileName = `/${folder}/${uuidv4()}_${file.originalname}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    //   ACL: "public-read", // Uncomment if needed
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);
    let BASE_URL_AWS_DOCUMENT = process.env.BASE_URL_AWS_DOCUMENT || `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`;

    // Build file URL manually (since v3 doesn't return Location)
    const fileUrl = `${BASE_URL_AWS_DOCUMENT}${fileName}`;

    // console.log("fileName ---> ", fileName)
    // console.log("fileUrl ---> ", fileUrl)

    return fileName;
  } catch (e) {
    console.error("S3 Upload Error:", e);
    return "";
  }
}

// ✅ Download File (returns stream)
async function getFileFromS3(key) {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    const response = await s3.send(command);
    return response.Body; // ReadableStream
  } catch (e) {
    console.error("S3 Get Error:", e);
    return null;
  }
}

// ✅ Delete File
async function deleteFromS3(key) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    await s3.send(command);
    return true;
  } catch (e) {
    console.error("S3 Delete Error:", e);
    return false;
  }
}

module.exports = {
  uploadToS3,
  getFileFromS3,
  deleteFromS3,
};
