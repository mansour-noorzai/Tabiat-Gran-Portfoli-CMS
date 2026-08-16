export type Role = "super_admin" | "admin" | "editor";
export type Permission = "dashboard.read"|"content.read"|"content.write"|"content.publish"|"messages.read"|"messages.write"|"media.read"|"media.write"|"settings.read"|"settings.write"|"users.read"|"users.write"|"audit.read";
const permissions: Record<Role, Permission[]> = {
  super_admin: ["dashboard.read","content.read","content.write","content.publish","messages.read","messages.write","media.read","media.write","settings.read","settings.write","users.read","users.write","audit.read"],
  admin: ["dashboard.read","content.read","content.write","content.publish","messages.read","messages.write","media.read","media.write","settings.read","settings.write","audit.read"],
  editor: ["dashboard.read","content.read","content.write","media.read","media.write"],
};
export function can(role: Role, permission: Permission) { return permissions[role]?.includes(permission) ?? false; }
