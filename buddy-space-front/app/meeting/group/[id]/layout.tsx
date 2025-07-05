"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/app/api"; // Assuming @/app/api is correctly configured for axios instance

interface GroupPermissions {
  isLoading: boolean;
  isLeader: () => boolean;
  hasPermission: (permission: string) => boolean;
  getCurrentUserId: () => number | null;
  getCurrentUserRole: () => string | null;
  isSubLeaderOrAbove: () => boolean;
  isMemberOrAbove: () => boolean;
  refreshPermissions: () => Promise<void>;
}

// Helper to get auth token
const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken") || localStorage.getItem("token");
};

// Helper to get auth headers
const getAuthHeaders = async () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("유효하지 않은 토큰");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export function useGroupPermissions(): GroupPermissions {
  const { id: groupId } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const fetchPermissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const headers = await getAuthHeaders();
      const response = await api.get(`/groups/${groupId}/permissions/me`, { headers });
      const { role, permissions, userId } = response.data.result;
      setUserRole(role);
      setUserPermissions(permissions);
      setCurrentUserId(userId);
    } catch (error: any) {
      console.error("Failed to fetch group permissions:", error);
      if (error.response?.status === 401 || error.message.includes("토큰")) {
        // Handle unauthorized access, e.g., redirect to login
        localStorage.clear();
        router.push("/login");
      }
      setUserRole(null);
      setUserPermissions([]);
      setCurrentUserId(null);
    } finally {
      setIsLoading(false);
    }
  }, [groupId, router]);

  useEffect(() => {
    if (groupId) {
      fetchPermissions();
    }
  }, [groupId, fetchPermissions]);

  const isLeader = useCallback(() => userRole === "LEADER", [userRole]);
  const isSubLeaderOrAbove = useCallback(() => userRole === "LEADER" || userRole === "SUB_LEADER", [userRole]);
  const isMemberOrAbove = useCallback(() => userRole === "LEADER" || userRole === "SUB_LEADER" || userRole === "MEMBER", [userRole]);
  const hasPermission = useCallback((permission: string) => userPermissions.includes(permission), [userPermissions]);
  const getCurrentUserId = useCallback(() => currentUserId, [currentUserId]);
  const getCurrentUserRole = useCallback(() => userRole, [userRole]);
  const refreshPermissions = useCallback(async () => {
    await fetchPermissions();
  }, [fetchPermissions]);

  return {
    isLoading,
    isLeader,
    hasPermission,
    getCurrentUserId,
    getCurrentUserRole,
    isSubLeaderOrAbove,
    isMemberOrAbove,
    refreshPermissions,
  };
}

// Placeholder for usePermissionChecker - assuming it might be a re-export or similar
export function usePermissionChecker() {
  return useGroupPermissions(); // Or a more specific implementation if needed
}

export default function GroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}