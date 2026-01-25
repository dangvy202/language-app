import { Authentication, Level } from "@/interfaces/interfaces";

export const fetchLogin = async (email: string, password: string) => {
    const endpoint = "http://127.0.0.1:8888/api/v1/user/login"

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Fail to Login');
        }

        const data = await response.json();

        return data;
    } catch (error: any) {
        throw new Error(error.message || 'Có lỗi xảy ra khi kết nối server');
    }
};

export const fetchLevel = async ({ query }: { query: string }): Promise<Level[]> => {
    const endpoint = "http://127.0.0.1:8000/api/level/"

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
            accept: 'application/json'
        }
    })

    if (!response.ok) {
        throw new Error('Fail to fetch level');
    }
    const data = await response.json();

    return data;
};

export const fetchTopic = async ({ query }: { query: string }): Promise<Level[]> => {
    const endpoint = "http://127.0.0.1:8000/api/topic/"

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
            accept: 'application/json'
        }
    })

    if (!response.ok) {
        throw new Error('Fail to fetch level');
    }
    const data = await response.json();

    return data;
};