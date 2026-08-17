export interface AuditEntry {
  id?: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export function createAuditEntry(
  userId: string,
  action: string,
  resource: string,
  details?: Record<string, any>
): AuditEntry {
  return {
    userId,
    action,
    resource,
    details,
    timestamp: new Date().toISOString(),
  };
}
