//src/api/services/auth.js
import api from "../../lib/api"

//Public endpoints
export const signupUser =(payload) => api.post("/api/auth/register",payload);
export const verifyEmail =(payload)=>api.post("/api/auth/verify-email",payload);
export const resendOtp = (payload) => api.post("/api/auth/resend-otp", payload);
export const loginUser =(payload) => api.post("/api/auth/login", payload);
export const googleLogin = (credential) =>api.post("/api/auth/google", { credential });

//Protected endpoint 
export const getMe = () => api.get("/api/auth/me",{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});