export interface FineTuning {
  is_allowed_to_fine_tune: boolean;
  state: Record<string, unknown>;
  verification_failures: unknown[];
  verification_attempts_count: number;
  manual_verification_requested: boolean;
  language: null | string;
  progress: Record<string, unknown>;
  message: Record<string, unknown>;
  dataset_duration_seconds: null | number;
  verification_attempts: null | unknown;
  slice_ids: null | unknown[];
  manual_verification: null | unknown;
}

export interface Labels {
  accent: string;
  description: string;
  age: string;
  gender: string;
  use_case: string;
}

export interface Voice {
  public_owner_id: string;
  voice_id: string;
  date_unix: number;
  name: string;
  accent: string;
  gender: string;
  age: string;
  descriptive: string;
  use_case: string;
  category: string;
  language: string;
  description: string;
  preview_url: string;
  usage_character_count_1y: number;
  usage_character_count_7d: number;
  play_api_usage_character_count_1y: number;
  cloned_by_count: number;
  rate: number;
  free_users_allowed: boolean;
  live_moderation_enabled: boolean;
  featured: boolean;
  notice_period: null | number;
  instagram_username: null | string;
  twitter_username: null | string;
  youtube_username: null | string;
  tiktok_username: null | string;
  image_url: string;
}

export interface TVoices {
  voices: Array<Voice>;
  has_more: boolean;
  last_sort_id: string;
}
