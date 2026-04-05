import { Ionicons } from '@expo/vector-icons';

type IoniconName = keyof typeof Ionicons.glyphMap; interface Skill {
  key_skill: 'reading' | 'listening' | 'speaking' | 'writing',
  label: string,
  icon: IoniconName
}

interface Authentication {
  token: string,
  expired: string
}

interface Level {
  id_level: number;
  rank: string;
  level_name: string;
  created_at: string,
  updated_at: string,
  description: string,
  skills: Skill[]
}

interface Topic {
  id_topic: number;
  name_topic: string;
  icon: string,
  vocabulary_count: number,
  created_at: string,
  updated_at: string,
}

interface Exercise {
  id_exercise: number,
  icon: string,
  name: string,
  description: string,
  type: string,
  difficulty: string,
  topic: number,
  time_limit: number,
  points: number,
  question_count: number,
}

interface ExerciseProgress {
  attempts: number,
  completed_at: string,
  exercises: number,
  id_exercise_progress: number,
  is_completed: boolean,
  score: number,
}

export interface HistoryProgressCreatePayload {
  isFinished: boolean;
  finished_date?: string | null;
  duration?: string | null;
  user_cache: number;
  topic: number;
  progress_percent: number,
  id_vocabulary_progress: number;
}

export interface UserNoteCreatePayLoad {
  content_note: string | null;
  description_note: string | null;
  id_vocabulary: string;
  id_user_cache: number;
}

interface ExperiencedStaff {
  companyName: string;
  fromDate: string;
  toDate: string;
}

interface RegisterTutorPayload {
  email: string;
  hourOfDay: number;
  dayOfWeek: number;
  scoreSpeaking: number;
  scoreReading: number;
  scoreListening: number;
  scoreWriting: number;
  certificatePath?: string | null;
  expectedSalary: number;
  experienced: ExperiencedStaff[];
}

interface UserInformation {
  avatar: string;
  email: string;
  idUser: number;
  phone: string;
}

interface FileData {
  uri: string;
  name: string;
  type: string;
}

interface Tutor {
  id: number;

  name: string;
  avatar: string;

  certificate: string;

  expectedSalary: number; // giá mentor đề xuất
  pricePerHour: number;
  specialty: string; // skill text

  description?: string;

  scores: {
    speaking: number;
    reading: number;
    listening: number;
    writing: number;
  };

  skills: number[];

  experiences: {
    companyName: string;
    fromDate: string;
    toDate: string;
  }[];

  rating?: number;
  reviews?: number;
  students?: number;

  isOnline?: boolean;
}

interface User {
    username: string;
    avatar: string;
    gender: string;
}

interface InformationStaff {
  idInformationStaff: number;
  scoreSpeaking: number;
  scoreReading: number;
  scoreListening: number;
  scoreWriting: number;
  certificatePath: string;
  expectedSalary: number;
  user: User;
}

interface Contract {
  idUser: number;
  emailTrainees: string | null;
  phoneTrainees: string | null;
  expectedFeeUser: number;
  expectedFeeMentor: number | null;
  agreeFee: number | null;
  statusStaff: string;
  statusUser: string;
  status: string;
  createdAt: string;
  userPaidAt: string;
  summaryFeePlatform: number | null;
  percentFeePlatform: number | null;
  salaryStaff: number | null;
  informationStaffResponse: InformationStaff;
}

export interface InformationStaffTest {
  idInformationStaff: number;
  user: {
    username: string;
    gender: string;
  };
  scoreSpeaking: number;
  scoreReading: number;
  scoreListening: number;
  scoreWriting: number;
  expectedSalary: number | null;
  certificatePath: string | null;
}

export interface ContractTest {
  id: number;                            // Bắt buộc có id
  idUser: number;
  emailTrainees: string | null;
  phoneTrainees: string | null;

  expectedFeeUser: number | null;        // ← Sửa thành | null (rất quan trọng)
  expectedFeeMentor: number | null;
  agreeFee: number | null;

  statusStaff: string;
  statusUser: string;
  status: string;

  createdAt: string;

  informationStaffResponse: InformationStaffTest;
}