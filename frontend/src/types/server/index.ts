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
  notice_period: number;
  instagram_username: string;
  twitter_username: string;
  youtube_username: string;
  tiktok_username: string;
  image_url: string;
}

export interface TVoices {
  voices: Array<Voice>;
  has_more: boolean;
  last_sort_id: string;
}
