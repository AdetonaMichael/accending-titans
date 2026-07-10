/**
 * Birthday Types
 * Based on backend birthday rewards system
 */

export interface BirthdayEligibility {
  date_of_birth: string | null;
  birthday_this_month: boolean;
  total_subscription_months: number;
  is_eligible_for_reward: boolean;
  is_shoutout_only: boolean;
  current_reward: BirthdayReward | null;
}

export interface BirthdayReward {
  id: number;
  reward_type: string;        // "physical_delivery" | "service" | "shoutout"
  status: string;             // "pending" | "processing" | "delivered" | "cancelled"
  is_shoutout_only: boolean;
  gift_provider?: {
    id: number;
    name: string;
  };
  gift_item?: {
    id: number;
    title: string;
    price: number | null;
  };
}

export interface UpcomingBirthday {
  user_id: number;
  name: string;
  profile_photo_url: string | null;
  birth_date: string;
  age: number;
  days_until_birthday: number;
  rank: string | null;
  total_subscription_months: number;
  business: {
    name: string;
    category: string;
  } | null;
}

// Admin types
export interface AdminBirthdayMember {
  id: number;
  user_id: number;
  name: string;
  email: string;
  birth_date: string;
  age: number;
  rank: string | null;
  total_subscription_months: number;
  is_eligible: boolean;
  is_shoutout_only: boolean;
  reward: BirthdayReward | null;
}

export interface AssignGiftRequest {
  user_id: number;
  gift_provider_user_id: number;
  gift_portfolio_item_id: number;
  reward_type: string;
}
