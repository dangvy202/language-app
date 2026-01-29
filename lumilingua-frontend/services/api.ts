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
    const endpoint = "https://faultily-uncanny-cecelia.ngrok-free.dev/api/level/"

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
    const endpoint = "https://faultily-uncanny-cecelia.ngrok-free.dev/api/topic/"

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

export const fetchVocabularyByLevelId = async ({ levelId }: { levelId: number | string }): Promise<any[]> => {
  try {
    // const token = await AsyncStorage.getItem('accessToken'); // Lấy token nếu cần auth

    const endpoint = `https://faultily-uncanny-cecelia.ngrok-free.dev/api/vocabulary/?level=${levelId}`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // ...(token ? { 'Authorization': `Bearer ${token}` } : {}), // Thêm token nếu có
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.notification || 'Không thể tải từ vựng theo level');
    }

    const data = await response.json();
    return data.data || data || [];
  } catch (error: any) {
    console.error('Fetch vocabulary by level error:', error);
    throw error;
  }
};

export const fetchMeanByVocabularyAndLanguage = async ({ vocabulary, language }: { vocabulary: number, language: number }): Promise<any[]> => {
  try {
    // const token = await AsyncStorage.getItem('accessToken'); // Lấy token nếu cần auth
    const endpoint = `https://faultily-uncanny-cecelia.ngrok-free.dev/api/mean/?vocabulary=${vocabulary}&language=${language}`

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // ...(token ? { 'Authorization': `Bearer ${token}` } : {}), // Thêm token nếu có
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.notification || 'Không thể tải ý nghĩa theo vocabulary và language');
    }

    const data = await response.json();
    return data.data || data || [];
  } catch (error: any) {
    console.error('Fetch mean by vocabulary and language error:', error);
    throw error;
  }
};