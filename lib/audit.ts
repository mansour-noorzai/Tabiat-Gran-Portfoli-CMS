import { AuditLog } from "@/models"; import type { Role } from "./permissions";
export async function writeAudit(session:{userId:string;name:string;email:string;role:Role},action:string,resource:string,resourceId="",details:Record<string,unknown>={}){await AuditLog.create({userId:session.userId,userName:session.name,action,resource,resourceId,details})}
