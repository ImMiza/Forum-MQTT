import axios from "axios";

export interface User {
    username: string
    password: string
}

export interface Result {
    success: boolean
    reason?: string
}

const URL = 'https://heather-cold-join.glitch.me';

/**
 * Register a new username
 * @param user the new user
 */
export async function userRegister(user: User): Promise<Result> {
    const url = `${URL}/register`;

    try {
        const response = await axios.post<Result>(url, user);
        return response.data;
    } catch (error) {
        console.error(error);
        return { success: false, reason: 'request failed' };
    }
}

/**
 * Login an existant user
 * @param user the user to login
 */
export async function userLogin(user: User): Promise<Result> {
    const url = `${URL}/login`;

    try {
        const response = await axios.post<Result>(url, user);
        return response.data;
    } catch (error) {
        console.error(error);
        return { success: false, reason: 'request failed' };
    }
}