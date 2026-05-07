// // import axios from "axios";

// // const API = axios.create({
// //   baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
// //   timeout: 10000,
// // });

// // // Attach JWT token to every request automatically
// // API.interceptors.request.use((config) => {
// //   const token = localStorage.getItem("token");
// //   if (token) {
// //     config.headers.Authorization = `Bearer ${token}`;
// //   }
// //   return config;
// // });

// // // Redirect to login on 401
// // API.interceptors.response.use(
// //   (res) => res,
// //   (err) => {
// //     if (err.response?.status === 401) {
// //       localStorage.clear();
// //       window.location.href = "/";
// //     }
// //     return Promise.reject(err);
// //   }
// // );

// // export default API;
// // // src/services/api.js
// // // src/services/api.js
// // // src/services/api.js
// // // src/services/api.js
// // // src/services/api.js
// // // import axios from 'axios';

// // // const API = axios.create({
// // //     baseURL: 'http://localhost:5000',
// // //     timeout: 30000,
// // //     headers: {
// // //         'Content-Type': 'application/json',
// // //     },
// // // });

// // // // Request interceptor
// // // API.interceptors.request.use(
// // //     (config) => {
// // //         const token = localStorage.getItem('token');
// // //         if (token) {
// // //             config.headers.Authorization = `Bearer ${token}`;
// // //             console.log(`🔐 Request with token: ${config.method?.toUpperCase()} ${config.url}`);
// // //         } else {
// // //             console.log(`🔓 Request without token: ${config.method?.toUpperCase()} ${config.url}`);
// // //         }
// // //         return config;
// // //     },
// // //     (error) => Promise.reject(error)
// // // );

// // // // Response interceptor
// // // API.interceptors.response.use(
// // //     (response) => response,
// // //     (error) => {
// // //         // Handle 422 specifically for JWT issues
// // //         if (error.response?.status === 422) {
// // //             console.error('❌ Invalid token detected');
// // //             const errorMsg = error.response?.data?.msg || '';
            
// // //             if (errorMsg.includes('signature') || errorMsg.includes('token')) {
// // //                 console.log('Clearing invalid token');
// // //                 localStorage.clear();
// // //                 // Redirect to login if not already there
// // //                 if (!window.location.pathname.includes('/login')) {
// // //                     window.location.href = '/login';
// // //                 }
// // //             }
// // //         }
        
// // //         if (error.response?.status === 401) {
// // //             console.error('❌ Unauthorized');
// // //             localStorage.clear();
// // //             if (!window.location.pathname.includes('/login')) {
// // //                 window.location.href = '/login';
// // //             }
// // //         }
        
// // //         return Promise.reject(error);
// // //     }
// // // );

// // // export default API;
// // src/services/api.js
// import axios from 'axios';

// const API = axios.create({
//     baseURL: 'http://localhost:5000',
//     timeout: 30000,
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// // Track if we're refreshing
// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//     failedQueue.forEach(prom => {
//         if (error) {
//             prom.reject(error);
//         } else {
//             prom.resolve(token);
//         }
//     });
//     failedQueue = [];
// };

// // Request interceptor
// API.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// // Response interceptor to handle expired tokens
// API.interceptors.response.use(
//     (response) => {
//         console.log(`✅ API Response: ${response.config.url} - Status: ${response.status}`);
//         return response;
//     },
    
//     async (error) => {
//         const originalRequest = error.config;
//         console.error(`❌ API Error: ${originalRequest?.url} - Status: ${error.response?.status}`, error.response?.data);
        
//         // If error is 401 (Unauthorized) and not already retrying
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             console.log('🔐 401 detected, attempting token refresh...');
            
//             // Don't try to refresh if we're already on login page
//             if (window.location.pathname === '/login') {
//                 return Promise.reject(error);
//             }
//             if (isRefreshing) {
//                 // Queue the request while token is being refreshed
//                 return new Promise((resolve, reject) => {
//                     failedQueue.push({ resolve, reject });
//                 }).then(token => {
//                     originalRequest.headers.Authorization = `Bearer ${token}`;
//                     return API(originalRequest);
//                 }).catch(err => Promise.reject(err));
//             }
            
//             originalRequest._retry = true;
//             isRefreshing = true;
            
//             const refreshToken = localStorage.getItem('refresh_token');
            
//             if (!refreshToken) {
//                 // No refresh token, redirect to login
//                 localStorage.clear();
//                 window.location.href = '/login';
//                 return Promise.reject(error);
//             }
            
//             try {
//                 const response = await axios.post('http://localhost:5000/refresh', {}, {
//                     headers: {
//                         'Authorization': `Bearer ${refreshToken}`
//                     }
//                 });
                
//                 const { token } = response.data;
//                 localStorage.setItem('token', token);
                
//                 processQueue(null, token);
//                 originalRequest.headers.Authorization = `Bearer ${token}`;
//                 return API(originalRequest);
                
//             } catch (refreshError) {
//                 console.error('❌ Token refresh failed:', refreshError.response?.data);
//                 processQueue(refreshError, null);
//                 localStorage.clear();
//                 window.location.href = '/login';
//                 return Promise.reject(refreshError);
//             } finally {
//                 isRefreshing = false;
//             }
//         }
//         if (error.response?.status === 422) {
//             console.error('❌ Validation error (possibly invalid token):', error.response?.data);
//             // Clear token if it's a token-related validation error
//             if (error.response?.data?.msg?.includes('token') || error.response?.data?.msg?.includes('signature')) {
//                 localStorage.clear();
//                 if (window.location.pathname !== '/login') {
//                     window.location.href = '/login';
//                 }
//             }
//         }
//         return Promise.reject(error);
//     }
// );

// export default API;
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const API = axios.create({
    baseURL: API_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Track refresh state
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor - Attach access token
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - Handle token refresh
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // If 401 error and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            
            // Don't refresh if on login page
            if (window.location.pathname === '/' || window.location.pathname === '/login') {
                return Promise.reject(error);
            }
            
            // If already refreshing, queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return API(originalRequest);
                }).catch(err => Promise.reject(err));
            }
            
            originalRequest._retry = true;
            isRefreshing = true;
            
            const refreshToken = localStorage.getItem('refresh_token');
            
            if (!refreshToken) {
                localStorage.clear();
                window.location.href = '/';
                isRefreshing = false;
                return Promise.reject(error);
            }
            
            try {
                // FIXED: Correct refresh endpoint
                const response = await axios.post(
                    `${API_URL}/auth/refresh`,
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${refreshToken}`
                        }
                    }
                );
                
                const { access_token } = response.data;
                localStorage.setItem('access_token', access_token);
                
                processQueue(null, access_token);
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return API(originalRequest);
                
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.clear();
                window.location.href = '/';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        
        // Handle 422 - Invalid token
        if (error.response?.status === 422) {
            const msg = error.response?.data?.msg || '';
            if (msg.includes('token') || msg.includes('signature')) {
                localStorage.clear();
                window.location.href = '/';
            }
        }
        
        return Promise.reject(error);
    }
);

export default API;