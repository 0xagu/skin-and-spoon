import CryptoJS from 'crypto-js';

const secretKey = process.env.JWT_SECRET_KEY;

export const encryptAES = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};