import axios from "axios";
import { AuthFormDataFields } from "../types/authForms";
import { useFetch } from "./useFetch";

export function useAuth() {
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const { apiAuthGet } = useFetch();

    async function signup({ username, email, password }: AuthFormDataFields) {
        try {
            const result = await axios.post(
                `${APP_URL}/api/auth/signup`,
                { username, email, password },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            return result.data;
        } catch (error: any) {
            console.error("POST request failed:", error);
            if (error.response) {
                throw new Error(
                    `POST ${APP_URL}/register failed with status ${error.response.status}`
                );
            }
            throw error;
        }
    }

    async function login({ username, email, password }: AuthFormDataFields) {
        try {
            const result = await axios.post(
                `${APP_URL}/api/auth/login`,
                { username, email, password },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            return result.data;
        } catch (error: any) {
            console.error("POST request failed:", error);
            if (error.response) {
                throw new Error(
                    `POST ${APP_URL}/api/auth/login failed with status ${error.response.status}`
                );
            }
            throw error;
        }
    }

    async function logout() {
        try {
            const result = await axios.get(`${APP_URL}/api/auth/logout`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            return result.data;
        } catch (error: any) {
            console.error("GET request failed:", error);
            if (error.response) {
                throw new Error(
                    `GET ${APP_URL}/api/auth/logout failed with status ${error.response.status}`
                );
            }
            throw error;
        }
    }

    async function user() {
        try {
            const result = await apiAuthGet("api/auth/me");
            return result;
        } catch (error) {
            console.error("GET request failed:", error);
            // Optionally redirect to login or handle auth failure
            return null;
        }
    }

    return {
        signup,
        login,
        logout,
        user,
    };
}
