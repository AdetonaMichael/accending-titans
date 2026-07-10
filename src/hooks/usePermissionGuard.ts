'use client';

import { useAuthStore } from '@/store/auth.store';
import { useMemo } from 'react';
import type { PermissionSlug, RoleSlug } from '@/types/role.types';

/**
 * PermissionGuard hook - provides permission and role checking utilities
 * Based on the backend Spatie Laravel Permission system
 */
export const usePermissionGuard = () => {
  const { user } = useAuthStore();

  const roles = useMemo(() => user?.roles || [], [user?.roles]);
  const permissions = useMemo(() => user?.permissions || [], [user?.permissions]);

  /**
   * Check if the current user has a specific permission
   */
  const hasPermission = (permission: PermissionSlug): boolean => {
    if (!user) return false;
    return permissions.includes(permission);
  };

  /**
   * Check if the current user has a specific role
   */
  const hasRole = (role: RoleSlug): boolean => {
    if (!user) return false;
    return roles.includes(role);
  };

  /**
   * Check if the current user has any of the specified roles
   */
  const hasAnyRole = (roleList: RoleSlug[]): boolean => {
    if (!user) return false;
    return roleList.some((r) => roles.includes(r));
  };

  /**
   * Check if the current user has all of the specified permissions
   */
  const hasAllPermissions = (permissionList: PermissionSlug[]): boolean => {
    if (!user) return false;
    return permissionList.every((p) => permissions.includes(p));
  };

  /**
   * Check if the current user has any of the specified permissions
   */
  const hasAnyPermission = (permissionList: PermissionSlug[]): boolean => {
    if (!user) return false;
    return permissionList.some((p) => permissions.includes(p));
  };

  /**
   * Check if user is admin
   */
  const isAdmin = useMemo(() => hasRole('admin'), [roles]);

  /**
   * Get the primary role for display/badge purposes
   */
  const primaryRole = useMemo(() => {
    if (roles.includes('admin')) return 'admin';
    if (roles.includes('customer')) return 'customer';
    if (roles.includes('user')) return 'user';
    return roles[0] || null;
  }, [roles]);

  return {
    roles,
    permissions,
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllPermissions,
    hasAnyPermission,
    isAdmin,
    primaryRole,
  };
};

/**
 * Get badge variant for a role name
 */
export const getRoleBadgeVariant = (
  role: string
): 'danger' | 'success' | 'info' | 'warning' | 'default' => {
  const roleMap: Record<string, 'danger' | 'success' | 'info' | 'warning' | 'default'> = {
    admin: 'danger',
    customer: 'success',
    user: 'info',
    agent: 'warning',
  };
  return roleMap[role?.toLowerCase()] || 'default';
};

/**
 * Get color class for a role badge (for more customization)
 */
export const getRoleBadgeColor = (role: string): string => {
  const roleMap: Record<string, string> = {
    admin: 'bg-red-100 text-red-800 border-red-200',
    customer: 'bg-green-100 text-green-800 border-green-200',
    user: 'bg-blue-100 text-blue-800 border-blue-200',
    agent: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };
  return roleMap[role?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
};
