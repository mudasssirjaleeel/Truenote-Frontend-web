export interface StaffMember {
  id: string;
  userId: string;
  role: "super_admin" | "manager" | "barista" | "counter" | "rider";
  isActive: boolean;
  joinedAt: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatarUrl: string | null;
  };
  inviter?: {
    name: string;
    email: string;
  };
}

export interface StaffAuditLog {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  oldValue: any;
  newValue: any;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}
