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
  created_at: string,
  updated_at: string,
}

export interface HistoryProgressCreatePayload {
  isFinished: boolean;
  finished_date?: string | null;
  duration?: string | null;
  user_cache: number;
  topic: number;
  id_vocabulary_progress: number;
}