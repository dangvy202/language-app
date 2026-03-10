import { Exercise, HistoryProgressCreatePayload, Level, RegisterTutorPayload, UserNoteCreatePayLoad } from "@/interfaces/interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchLogin = async (email: string, password: string) => {
  const endpoint = "https://compare-auditor-suse-mediterranean.trycloudflare.com/api/v1/user/login"

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
  const endpoint = "https://scores-hereby-obtaining-rrp.trycloudflare.com/api/level/"

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
  const endpoint = "https://scores-hereby-obtaining-rrp.trycloudflare.com/api/topic/"

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

    const endpoint = `https://scores-hereby-obtaining-rrp.trycloudflare.com/api/vocabulary/?topic=${nameTopic}`;

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

    const endpoint = `https://scores-hereby-obtaining-rrp.trycloudflare.com/api/vocabulary/?level=${levelId}`;

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
    const endpoint = `https://scores-hereby-obtaining-rrp.trycloudflare.com/api/mean/?vocabulary=${vocabulary}&language=${language}`

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

    const endpoint = `https://compare-auditor-suse-mediterranean.trycloudflare.com/api/v1/user/${email}`;

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
    const endpoint = `https://scores-hereby-obtaining-rrp.trycloudflare.com/api/user_cache/?email=${email}`;

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

    const endpoint = `https://scores-hereby-obtaining-rrp.trycloudflare.com/api/user_cache/`;

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
  progress_percent,
  id_vocabulary_progress = 0,
}: HistoryProgressCreatePayload): Promise<any> => {
  try {
    const payload: Record<string, any> = {
      isFinished,
      user_cache,
      topic,
      progress_percent,
      id_vocabulary_progress,
    };

    if (finished_date !== undefined) {
      payload.finished_date = finished_date;
    }
    if (duration !== undefined) {
      payload.duration = duration;
    }

    const endpoint = "https://scores-hereby-obtaining-rrp.trycloudflare.com/api/history_progress/";

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
        `Server error: ${response.status} ${response.statusText}`;

      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (err: any) {
    console.error("Error HistoryProgress:", err);
    throw new Error(err.message || "Unable to save history progress");
  }
};

export const getHistoryProgress = async (userCacheId: number) => {
  let endpoint = `https://scores-hereby-obtaining-rrp.trycloudflare.com/api/history_progress/?user_cache=${userCacheId}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch history progress");
  }

  return response.json();
};

export const getExerciseProgress = async (userCacheId: number) => {
  let endpoint = `https://scores-hereby-obtaining-rrp.trycloudflare.com/api/exercise_progress/?user_cache=${userCacheId}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch history progress");
  }

  return response.json();
};

export const saveNoteVocabulary = async ({
  id_user_cache,
  id_vocabulary,
  content_note,
  description_note
}: UserNoteCreatePayLoad): Promise<any> => {

  const payload: Record<string, any> = {
    id_user_cache,
    id_vocabulary,
    content_note,
    description_note,
  };

  const response = await fetch(
    "https://scores-hereby-obtaining-rrp.trycloudflare.com/api/user_note/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to save note");
  }

  return await response.json();
};

export const fetchUserNotes = async (userCacheId: number) => {
  const response = await fetch(
    `https://scores-hereby-obtaining-rrp.trycloudflare.com/api/user_note/?id_user_cache=${userCacheId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch notes");
  }

  return response.json();
};

export const fetchExercise = async ({ query }: { query: string }): Promise<Exercise[]> => {
  const endpoint = "https://scores-hereby-obtaining-rrp.trycloudflare.com/api/exercise/"

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      accept: 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Fail to fetch exercise');
  }
  const data = await response.json();

  return data;
};

export const fetchExerciseQuestions = async (exerciseId: number) => {
  try {
    const endpoint = `https://scores-hereby-obtaining-rrp.trycloudflare.com/api/question/?exercise=${exerciseId}`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Unable to download questions');
    }

    const data = await response.json();
    return data;
  } catch (err: any) {
    console.error('Fetch error questions:', err);
    throw err;
  }
};

export const submitExerciseProgress = async ({
  id_user,
  id_exercise,
  score,
  completed_at,
}: {
  id_user: number;
  id_exercise: number;
  score: number;
  completed_at: string;
}) => {
  const response = await fetch('https://scores-hereby-obtaining-rrp.trycloudflare.com/api/exercise_progress/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id_user,
      id_exercise,
      score,
      completed_at,
    }),
  });

  if (!response.ok) {
    throw new Error('Submit progress failed');
  }

  return response.json();
};
export const registerTutor = async (data: {
  email: string;
  hourOfDay: string;
  selectedDays: number[];
  scoreSpeaking: string;
  scoreReading: string;
  scoreListening: string;
  scoreWriting: string;
  certificateFile: any;
  expectedSalary: string;
  experiences: { companyName: string; fromDate: string; toDate: string }[];
}): Promise<any> => {

  try {

    const dayNumberToText = (dayId: number): string => {
      const daysMap: { [key: number]: string } = {
        1: 'Thứ Hai',
        2: 'Thứ Ba',
        3: 'Thứ Tư',
        4: 'Thứ Năm',
        5: 'Thứ Sáu',
        6: 'Thứ Bảy',
        7: 'Chủ Nhật',
      };
      return daysMap[dayId] || 'Không xác định';
    };

    const formData = new FormData();

    formData.append("email", data.email.trim());
    formData.append("hourOfDay", data.hourOfDay);
    formData.append("expectedSalary", data.expectedSalary);

    formData.append("scoreSpeaking", data.scoreSpeaking);
    formData.append("scoreReading", data.scoreReading);
    formData.append("scoreListening", data.scoreListening);
    formData.append("scoreWriting", data.scoreWriting);

    data.selectedDays.map(dayNumberToText).forEach((day) => {
      formData.append("dayOfWeek", day);
    });

    data.experiences.forEach((exp, index) => {
      formData.append(`experienced[${index}].companyName`, exp.companyName);
      formData.append(`experienced[${index}].fromDate`, exp.fromDate);
      formData.append(`experienced[${index}].toDate`, exp.toDate);
    });

    // upload file
    formData.append("certificatePath", {
      uri: data.certificateFile.uri,
      name: data.certificateFile.name,
      type: data.certificateFile.mimeType || "application/octet-stream"
    } as any);

    const token = await AsyncStorage.getItem('token');

    if (!token) {
      throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại!');
    }

    const endpoint = "https://compare-auditor-suse-mediterranean.trycloudflare.com/api/v1/information-staff";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      },
      body: formData
    });

    const responseData = await response.json();

    if (responseData.code === 409) {
      return {
        conflict: true,
        message: responseData.notification || "Bạn đã đăng ký gia sư trước đó"
      };
    }

    if (!response.ok) {
      throw new Error(
        responseData.message || `Server error ${response.status}`
      );
    }

    return responseData;

  } catch (err: any) {

    console.error("registerTutor error:", err);

    throw new Error(
      err.message || "Không thể đăng ký gia sư. Vui lòng thử lại!"
    );
  }
};