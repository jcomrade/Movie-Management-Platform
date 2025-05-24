import { refreshAccessToken } from "../utils/refreshAccessToken";
import axios from "axios";

let accessToken = "";

export function useFetch() {
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    async function apiGet(route: string, headers?: Record<string, string>) {
        try {
            const response = await axios.get(`${APP_URL}/${route}`, {
                headers: {
                    "Content-Type": "application/json",
                    ...headers,
                },
                withCredentials: true,
            });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                console.error(`GET ${route} failed with status ${error.response.status}`);
                throw new Error(`GET ${route} failed with status ${error.response.status}`);
            } else {
                console.error("GET request failed:", error);
                throw error;
            }
        }
    }

    async function apiAuthGet(route: string, headers?: Record<string, string>) {
        try {
            let response;
            try {
                response = await axios.get(`${APP_URL}/${route}`, {
                    headers: {
                        "Content-Type": "application/json",
                        ...headers,
                    },
                    withCredentials: true,
                });
            } catch (error: any) {
                if (error.response && error.response.status === 401) {
                    const newAccessToken = await refreshAccessToken();

                    if (newAccessToken) {
                        accessToken = newAccessToken;
                        // Retry original request
                        response = await axios.get(`${APP_URL}/${route}`, {
                            headers: {
                                "Content-Type": "application/json",
                                ...headers,
                            },
                            withCredentials: true,
                        });
                        return response.data;
                    } else {
                        const path = window.location.pathname;
                        if (path === "/login" || path === "/signup") {
                            throw new Error("Session expired. Please log in again.");
                        } else {
                            window.location.href = `${APP_URL}/login`;
                            return; // Stop execution
                        }
                    }
                } else {
                    throw new Error(`GET ${route} failed with status ${error.response?.status}`);
                }
            }
            return response.data;
        } catch (error) {
            console.error("GET request failed:", error);
            throw error;
        }
    }

    async function apiPost(route: string, body: Record<string, unknown>, headers?: Record<string, string>) {
        try {
            const response = await axios.post(`${APP_URL}/${route}`, body, {
                headers: {
                    "Content-Type": "application/json",
                    ...headers,
                },
                withCredentials: true,
            });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                console.error(`POST ${route} failed with status ${error.response.status}`);
                throw new Error(`POST ${route} failed with status ${error.response.status}`);
            } else {
                console.error("POST request failed:", error);
                throw error;
            }
        }
    }

    async function apiAuthPost(route: string, body: Record<string, unknown> | FormData) {
        const isFormData = body instanceof FormData;

        try {
            let response;
            try {
                response = await axios.post(`${APP_URL}/${route}`, body, {
                    headers: isFormData ? undefined : { "Content-Type": "application/json" },
                    withCredentials: true,
                });
            } catch (error: any) {
                if (error.response?.status === 401) {
                    const newAccessToken = await refreshAccessToken();

                    if (newAccessToken) {
                        accessToken = newAccessToken;
                        // Retry original request
                        response = await axios.post(`${APP_URL}/${route}`, body, {
                            headers: isFormData ? undefined : { "Content-Type": "application/json" },
                            withCredentials: true,
                        });
                        return response.data;
                    } else {
                        const path = window.location.pathname;
                        if (path === "/login" || path === "/signup") {
                            throw new Error("Session expired. Please log in again.");
                        } else {
                            window.location.href = `${APP_URL}/login`;
                            return;
                        }
                    }
                } else {
                    throw new Error(`POST ${route} failed with status ${error.response?.status}`);
                }
            }
            return response.data;
        } catch (error) {
            console.error("POST request failed:", error);
            throw error;
        }
    }

    async function apiAuthPut(route: string, body: Record<string, unknown> | FormData) {
        const isFormData = body instanceof FormData;

        try {
            let response;
            try {
                response = await axios.put(`${APP_URL}/${route}`, body, {
                    headers: isFormData ? undefined : { "Content-Type": "application/json" },
                    withCredentials: true,
                });
            } catch (error: any) {
                if (error.response?.status === 401) {
                    const newAccessToken = await refreshAccessToken();

                    if (newAccessToken) {
                        accessToken = newAccessToken;
                        // Retry original request
                        response = await axios.put(`${APP_URL}/${route}`, body, {
                            headers: isFormData ? undefined : { "Content-Type": "application/json" },
                            withCredentials: true,
                        });
                        return response.data;
                    } else {
                        const path = window.location.pathname;
                        if (path === "/login" || path === "/signup") {
                            throw new Error("Session expired. Please log in again.");
                        } else {
                            window.location.href = `${APP_URL}/login`;
                            return;
                        }
                    }
                } else {
                    throw new Error(`PUT ${APP_URL}/${route} failed with status ${error.response?.status}`);
                }
            }
            return response.data;
        } catch (error) {
            console.error("PUT request failed:", error);
            throw error;
        }
    }

    async function apiAuthDelete(route: string) {
        try {
            let response;
            try {
                response = await axios.delete(`${APP_URL}/${route}`, {
                    withCredentials: true,
                });
            } catch (error: any) {
                if (error.response?.status === 401) {
                    const newAccessToken = await refreshAccessToken();

                    if (newAccessToken) {
                        accessToken = newAccessToken;
                        // Retry original request
                        response = await axios.delete(`${APP_URL}/${route}`, {
                            withCredentials: true,
                        });
                        return response.data;
                    } else {
                        const path = window.location.pathname;
                        if (path === "/login" || path === "/signup") {
                            throw new Error("Session expired. Please log in again.");
                        } else {
                            window.location.href = `${APP_URL}/login`;
                            return;
                        }
                    }
                } else {
                    throw new Error(`DELETE ${APP_URL}/${route} failed with status ${error.response?.status}`);
                }
            }
            return response.data;
        } catch (error) {
            console.error("DELETE request failed:", error);
            throw error;
        }
    }

    const user = async () => {
        if (accessToken) return true;

        const newAccessToken = await refreshAccessToken();

        if (newAccessToken) {
            accessToken = newAccessToken;
            return true;
        } else {
            return false;
        }
    };

    return {
        apiGet,
        apiAuthGet,
        apiAuthPost,
        apiPost,
        apiAuthPut,
        apiAuthDelete,
        user,
    };
}
