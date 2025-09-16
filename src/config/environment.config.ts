import dotenv from "dotenv"
dotenv.config()
export const environmentConfig = {
    firebase:{
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey:process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail:process.env.FIREBASE_CLIENT_EMAIL,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    },
    nodemailer:{
        email:process.env.NODEMAILER_EMAIL,
        password:process.env.NODEMAILER_PASSWORD
    },
    port: parseInt(process.env.PORT || '3000'),
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || '*',
    resend:{
        apiKey:process.env.RESEND_API_KEY
    }
}
