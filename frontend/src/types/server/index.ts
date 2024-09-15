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
  voice_id: string;
  name: string;
  category?: string;
  fine_tuning?: FineTuning;
  labels?: Labels;
  description?: null | string;
  preview_url?: string;
  available_for_tiers?: unknown[];
  settings?: null | unknown;
  sharing?: null | unknown;
  high_quality_base_model_ids?: string[];
  safety_control?: null | unknown;
  voice_verification?: {
    requires_verification: boolean;
    is_verified: boolean;
    verification_failures: unknown[];
    verification_attempts_count: number;
    language: null | string;
    verification_attempts: null | unknown;
  };
  permission_on_resource?: null | unknown;
  is_legacy?: boolean;
  is_mixed?: boolean;
}

export interface TVoices {
  voices: Array<Voice>;
}

// history
export type Settings = {
  similarity_boost?: number;
  stability?: number;
  style?: number;
  use_speaker_boost?: boolean;
};

export type THistory = {
  history_item_id: string;
  request_id?: string;
  voice_id?: string;
  model_id?: string;
  voice_name?: string;
  voice_category?: string;
  text?: string;
  date_unix?: number;
  character_count_change_from?: number;
  character_count_change_to?: number;
  content_type?: string;
  state?: string;
  settings?: Settings;
  feedback?: string | null;
  share_link_id?: string | null;
  source?: string;
  alignments?: string | null;
};

export type THistoryResponse = {
  history: THistory[];
  last_history_item_id?: string;
  has_more?: boolean;
};
