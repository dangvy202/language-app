import { HistoryProgressCreatePayload, Level } from "@/interfaces/interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchLogin = async (email: string, password: string) => {
  const endpoint = "http://localhost:8888/api/v1/user/login"

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
  const endpoint = "http://localhost:8000/api/level/"

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
  const endpoint = "http://localhost:8000/api/topic/"

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

export const fetchVocabularyByTopic = async ({ nameTopic }: { nameTopic: string }): Promise<any[]> => {
  try {
    // const token = await AsyncStorage.getItem('accessToken'); // Lấy token nếu cần auth

    const endpoint = `http://localhost:8000/api/vocabulary/?topic=${nameTopic}`;

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
      throw new Error(errorData.message || errorData.notification || 'Không thể tải từ vựng theo topic');
    }

    const data = await response.json();
    return data.data || data || [];
  } catch (error: any) {
    console.error('Fetch vocabulary by topic error:', error);
    throw error;
  }
};

export const fetchVocabularyByLevelId = async ({ levelId }: { levelId: number | string }): Promise<any[]> => {
  try {
    // const token = await AsyncStorage.getItem('accessToken'); // Lấy token nếu cần auth

    const endpoint = `http://localhost:8000/api/vocabulary/?level=${levelId}`;

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
    const endpoint = `http://localhost:8000/api/mean/?vocabulary=${vocabulary}&language=${language}`

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

export const fetchInformation = async ({ query }: { query: string }): Promise<any[]> => {
  try {
    const token = await AsyncStorage.getItem('token');
    const email = await AsyncStorage.getItem('email');

    const endpoint = `http://localhost:8888/api/v1/user/${email}`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.notification || 'Unable to get information user');
    }

    const data = await response.json();
    return data.data || data || [];
  } catch (error: any) {
    console.error('Fetch Information user error:', error);
    throw error;
  }
};

export const fetchUserCache = async ({ email }: { email: string }): Promise<any[]> => {
  try {
    const endpoint = `http://localhost:8000/api/user_cache/?email=${email}`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = {};
      }

      const errorMessage =
        errorData.error ||
        errorData.detail ||
        errorData.message ||
        `Error server: ${response.status} ${response.statusText}`;

      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.data || data || [];
  } catch (err: any) {
    throw new Error(err.message || 'Unable to get UserCache');
  }
};

export const saveOrUpdateUserCache = async ({ id_user, email, phone, streak = 0, }: {
  id_user: number;
  email: string;
  phone: string;
  streak?: number;
}) => {
  if (!id_user || !email || !phone) {
    throw new Error('Fields is null or blank: id_user, email, phone');
  }

  try {
    const payload = {
      id_user,
      email,
      phone,
      streak,
    };

    const endpoint = `http://localhost:8000/api/user_cache/`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = {};
      }

      const errorMessage =
        errorData.error ||
        errorData.detail ||
        errorData.message ||
        `Error server: ${response.status} ${response.statusText}`;

      throw new Error(errorMessage);
    }
    return response;
  } catch (err: any) {
    throw new Error(err.message || 'Unable to save UserCache');
  }
};

export const saveHistoryProgress = async ({
  isFinished,
  finished_date,
  duration,
  user_cache,
  topic,
  id_vocabulary_progress = 0,
}: HistoryProgressCreatePayload): Promise<any> => {
  try {
    const payload: Record<string, any> = {
      isFinished,
      user_cache,
      topic,
      id_vocabulary_progress,
    };

    // Chỉ thêm nếu có giá trị (backend thường cho phép null/blank)
    if (finished_date !== undefined) {
      payload.finished_date = finished_date; // phải là string ISO 8601
    }
    if (duration !== undefined) {
      payload.duration = duration;           // "HH:MM:SS" hoặc số giây tùy backend
    }

    const endpoint = "http://localhost:8000/api/history_progress/";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = {};
      }

      const errorMessage =
        errorData.error ||
        errorData.detail ||
        errorData.message ||
        errorData.non_field_errors?.[0] ||
        `Lỗi server: ${response.status} ${response.statusText}`;

      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (err: any) {
    console.error("Error HistoryProgress:", err);
    throw new Error(err.message || "Unable to save history progress");
  }
};