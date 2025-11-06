// src/api/services/auth.js
import api from "../../lib/api";

// Public
export const signupUser   = (payload) => api.post("/api/auth/register", payload);
export const verifyEmail  = (payload) => api.post("/api/auth/verify-email", payload);
export const resendOtp    = (payload) => api.post("/api/auth/resend-otp", payload);
export const loginUser    = (payload) => api.post("/api/auth/login", payload);
export const googleLogin  = (credential) =>
  api.post("/api/auth/google", { credential });


/* -------------------- Protected --------------------- */
// Token is auto-attached by the axios interceptor in lib/api.
export const getMe = () => api.get("/api/auth/me");                                

// Day 11 additions (self-service profile endpoints)
export const updateMyProfile = (payload) =>                                        
  api.patch("/api/auth/me", payload);

export const changeMyPassword = (currentPassword, newPassword) =>                  
  api.patch("/api/auth/me/password", { currentPassword, newPassword });

export const updateMyAvatar = (file) => {                                          
  const form = new FormData();                                                     
  form.append("avatar", file);                                                     
  return api.patch("/api/auth/me/avatar", form, {                                  
    headers: { "Content-Type": "multipart/form-data" },                            
  });
};
