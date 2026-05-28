import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
        key: (req, file, cb) => {
            const fileName = `books/${Date.now()}-${file.originalname}`;
            cb(null, fileName);
        },
    }),
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/webp"];
        allowed.includes(file.mimetype)
            ? cb(null, true)
            : cb(new Error("Only JPEG, PNG, and WEBP allowed"));
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

export const uploadProfile = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
        key: (req, file, cb) => {
            const fileName = `profiles/${Date.now()}-${file.originalname}`;
            cb(null, fileName);
        },
    }),
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/webp"];
        allowed.includes(file.mimetype)
            ? cb(null, true)
            : cb(new Error("Only JPEG, PNG, and WEBP allowed"));
    },
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max for profile pics
});

