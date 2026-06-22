import { supabaseService } from "@/utils/supabase/service";
import { logError } from "@/lib/security";

/**
 * Logs an administrative action to the database.
 * 
 * @param adminEmail The email of the admin performing the action
 * @param action The action performed (e.g., 'UPDATE_PROJECT', 'DELETE_USER')
 * @param targetId The ID of the record being modified
 * @param details Additional context or JSON stringified payload
 */
export async function logAdminAction(adminEmail: string, action: string, targetId: string, details?: any) {
  try {
    const { error } = await supabaseService
      .from("admin_audit_logs")
      .insert([
        {
          admin_email: adminEmail,
          action: action,
          target_id: targetId,
          details: typeof details === 'string' ? details : JSON.stringify(details || {}),
        }
      ]);

    if (error) {
      console.warn("Audit Log Write Failure:", error.message);
      // We don't throw here to avoid failing the main request if logging fails,
      // but we log it internally for monitoring.
    }
  } catch (err: any) {
    logError("Audit Logger", err);
  }
}
