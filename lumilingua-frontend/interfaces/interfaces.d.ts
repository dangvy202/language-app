import { Ionicons } from '@expo/vector-icons';

type IoniconName = keyof typeof Ionicons.glyphMap;interface Skill {
  key_skill: 'reading' | 'listening' | 'speaking' | 'writing',
  label: string,
  icon: IoniconName
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