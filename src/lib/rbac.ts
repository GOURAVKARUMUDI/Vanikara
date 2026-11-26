/**
 * Role-Based Access Control (RBAC) permission matrix for Vanikara Console.
 * Enforced on the server for every protected API handler.
 */

export type AdminRole =
  | "super_admin"
  | "content_manager"
  | "hr_manager"
  | "operations_manager"
  | "finance_manager"
  | "auditor";

export type Permission =
  | "dashboard:read"
  | "content:read"
  | "content:write"
  | "crm:read"
  | "crm:write"
  | "recruitment:read"
  | "recruitment:write"
  | "products:read"
  | "products:write"
  | "users:read"
  | "users:write"
  | "security:read"
  | "audit:read"
  | "privacy:read"
  | "privacy:write"
  | "settings:read"
  | "settings:write"
  | "finance:read"
  | "finance:write";

const ALL_PERMISSIONS: Permission[] = [
  "dashboard:read",
  "content:read",
  "content:write",
  "crm:read",
  "crm:write",
  "recruitment:read",
  "recruitment:write",
  "products:read",
  "products:write",
  "users:read",
  "users:write",
  "security:read",
  "audit:read",
  "privacy:read",
  "privacy:write",
  "settings:read",
  "settings:write",
  "finance:read",
  "finance:write",
];

export const ROLE_PERMISSIONS: Record<AdminRole, ReadonlySet<Permission>> = {
  super_admin: new Set(ALL_PERMISSIONS),
  content_manager: new Set(["dashboard:read", "content:read", "content:write", "products:read", "products:write"]),
  hr_manager: new Set(["dashboard:read", "recruitment:read", "recruitment:write"]),
  operations_manager: new Set(["dashboard:read", "crm:read", "crm:write", "products:read", "products:write"]),
  finance_manager: new Set(["dashboard:read", "finance:read", "finance:write"]),
  auditor: new Set(["dashboard:read", "security:read", "audit:read", "privacy:read", "settings:read"]),
};

/**
 * Resolves an admin's role from optional ADMIN_ROLES env map
 * (`username:role;username2:role2`). Defaults to `super_admin` for
 * explicitly provisioned fixed ADMIN_ACCOUNTS unless restricted.
 */
export function resolveAdminRole(username: string): AdminRole {
  const normalized = username.trim().toLowerCase();
  const entries = (process.env.ADMIN_ROLES ?? "")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const entry of entries) {
    const [u, r] = entry.split(":").map((x) => x.trim().toLowerCase());
    if (u === normalized && r && r in ROLE_PERMISSIONS) {
      return r as AdminRole;
    }
  }
  return "super_admin";
}

export function hasPermission(role: AdminRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.has(permission) ?? false;
}

export function adminHasPermission(username: string, permission: Permission): boolean {
  return hasPermission(resolveAdminRole(username), permission);
}
