import axios from "axios";

function getBaseURL() {
    console.log('BASE URL::', process.env.EXPO_PUBLIC_API_URL)
    const servidor = process.env.EXPO_PUBLIC_API_URL

    return servidor || 'https://192.168.18.134:4000'
}


export const api = axios.create({
    baseURL: getBaseURL(),
    timeout: 5000
})