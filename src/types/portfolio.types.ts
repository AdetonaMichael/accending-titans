/**
 * Portfolio Types
 * Based on backend portfolio management system
 */

export interface Portfolio {
  id: number;
  business_name: string;
  business_category: string | null;
  business_description: string | null;
  whatsapp_number: string | null;
  profile_image_url: string | null;
  cover_image_url: string | null;
  is_approved: boolean;
  is_featured: boolean;
  views_count: number;
  user?: {
    id: number;
    name: string;
    profile_photo_url: string | null;
  };
  items: PortfolioItem[];
}

export interface PortfolioItem {
  id: number;
  title: string;
  description: string | null;
  price: number | null;
  image_urls: string[] | null;
  whatsapp_dm_link: string | null;
  is_active: boolean;
}

export interface UpsertPortfolioRequest {
  business_name: string;
  business_category?: string;
  business_description?: string;
  whatsapp_number?: string;
  profile_image_url?: string;
  cover_image_url?: string;
}

export interface AddPortfolioItemRequest {
  title: string;
  description?: string;
  price?: number;
  image_urls?: string[];
  whatsapp_dm_link?: string;
}

export interface UpdatePortfolioItemRequest {
  title?: string;
  description?: string;
  price?: number;
  image_urls?: string[];
  whatsapp_dm_link?: string;
  is_active?: boolean;
}

export interface PortfolioBrowseParams {
  category?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface PortfolioCategory {
  name: string;
  count: number;
}

// Admin types
export interface AdminPortfolioUpdateRequest {
  is_approved?: boolean;
  is_featured?: boolean;
}
