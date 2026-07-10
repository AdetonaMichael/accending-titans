/**
 * Roles & Permissions Types
 * Based on Spatie Laravel Permission backend API
 */

import type { AdminDashboardStatsData } from './admin-stats.types';

// ============= Permission Slugs =============
export type PermissionSlug =
  | 'manage_users'
  | 'manage_roles'
  | 'manage_permissions'
  | 'manage_customers'
  | 'manage_transactions'
  | 'perform_transactions'
  | 'navigate_application'
  | 'view_ledger'
  | 'manage_ledger'
  | 'approve_ledger'
  | 'view_reports';

// ============= Role Slugs =============
export type RoleSlug = 'admin' | 'user' | 'customer';

// ============= Role Types =============
export interface Role {
  id: number;
  name: string;
  guard_name: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export interface StoreRoleRequest {
  name: string;
  guard_name?: string;
  permissions?: string[];
}

export interface UpdateRoleRequest {
  name: string;
  permissions?: string[];
}

// ============= Permission Types =============
export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface StorePermissionRequest {
  name: string;
  guard_name?: string;
}

export interface UpdatePermissionRequest {
  name: string;
}

// ============= Assignment Types =============
export interface AssignRoleRequest {
  user_id: number;
  role: string;
}

export interface AssignPermissionRequest {
  role: string;
  permission: string;
}

export interface RevokePermissionRequest {
  role: string;
  permission: string;
}

// ============= Admin User Types (from backend docs) =============
export interface AdminUserDetail {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  is_active: boolean;
  is_verified: boolean;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  dob: string | null;
  gender: string | null;
  address: string | null;
  nin: string | null;
  roles: string[];
  permissions: string[];
  profile_photo_url: string | null;
  is_profile_complete: boolean;
  referral: {
    code: string | null;
    link: string | null;
    total_referrals: number;
  };
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  deletion_reason: string | null;
  deletion_requested_at: string | null;
}

export interface AdminUserListItem {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  is_active: boolean;
  is_verified: boolean;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  roles: string[];
  permissions: string[];
  profile_photo_url: string | null;
  is_profile_complete: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// ============= Admin Stats Types =============
export interface AdminDashboardStats {
  total_users: number;
  active_users: number;
  verified_users: number;
  unverified_users: number;
  deleted_users: number;
  users_with_complete_profile: number;
  role_distribution: {
    admin: number;
    user: number;
    customer: number;
  };
  recent_registrations_7_days: number;
}

// ============= Login History Types =============
export interface LoginHistoryEntry {
  id: number;
  ip_address: string;
  channel: string;
  user_agent: string;
  location: {
    latitude: string;
    longitude: string;
    accuracy: string;
  } | null;
  logged_in_at: string;
}

// ============= API Response Wrappers =============
export interface RolesListResponse {
  roles: Role[];
}

export interface PermissionsListResponse {
  permissions: Permission[];
}

export interface RoleCreateResponse {
  role: Role;
}

export interface PermissionCreateResponse {
  permission: Permission;
}

export interface AssignRoleResponse {
  user: {
    id: number;
    name: string;
    email: string;
    roles: string[];
    permissions: string[];
  };
}

export interface AssignPermissionResponse {
  role: string;
  permissions: string[];
}

export interface AdminUserUpdateResponse {
  user: Partial<AdminUserDetail>;
}

export interface AdminStatsResponse {
  stats: AdminDashboardStatsData;
}

export interface ToggleActiveResponse {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    is_active: boolean;
  };
}

export interface RestoreUserResponse {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    restored_at: string;
  };
}

export interface LoginHistoryResponse {
  user_id: number;
  login_history: LoginHistoryEntry[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

// ============= User Update Request =============
export interface AdminUpdateUserRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  is_active?: boolean;
  roles?: string[];
  profile_photo_url?: string;
}
