/**
 * Content Submission Types
 * Based on backend content review system
 */

export interface ContentSubmission {
  id: number;
  title: string;
  content_type: string;     // "advertisement" | "promotional_video" | "graphic" | "photo"
  status: string;           // "pending_review" | "approved" | "rejected"
  media_url: string;
  duration_seconds: number | null;
  description: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  rejection_reason: string | null;
  estimated_review_completion: string;
}

export interface SubmitContentRequest {
  title: string;
  content_type: string;
  media_url: string;
  duration_seconds?: number;
  description?: string;
}

// Admin types
export interface AdminContentSubmission extends ContentSubmission {
  user_id: number;
  user_name: string;
  user_email: string;
}

export interface RejectContentRequest {
  reason: string;
}
