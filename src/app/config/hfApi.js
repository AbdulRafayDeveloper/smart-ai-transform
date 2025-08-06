// config/hfApi.js
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const hfApi = axios.create({
    baseURL: 'https://api-inference.huggingface.co/models/',
    headers: {
        Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
    },
});

export default hfApi;
