import { GOOGLE_FORMS_CONFIG } from "@/config/googleForms";
import { logError, logInfo } from "./security";

/**
 * Programmatically submits a form payload to Google Forms based on a centralized config.
 * Works as a secondary operational sync alongside Supabase.
 * 
 * @param formType - The type of form (e.g. "contact", "careers", "internship", etc.)
 * @param data - The raw key-value payload to submit
 * @returns A promise resolving to true if submission succeeded or was skipped (no config), or false if failed
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function submitToGoogleForm(formType: string, data: Record<string, any>): Promise<boolean> {
  const config = GOOGLE_FORMS_CONFIG[formType];

  if (!config) {
    logError("Google Forms Integration", `No centralized configuration found for form type: ${formType}`);
    return false;
  }

  // Gracefully skip sync if the responseUrl is empty or not configured (dev flexibility)
  if (!config.responseUrl) {
    logInfo(
      "Google Forms Integration",
      `No response URL configured for form "${config.name}". Skipping Google Forms sync.`
    );
    return true;
  }

  // 1. Build form urlencoded payload matching Google Form entry IDs
  const formData = new URLSearchParams();
  let mappedFieldsCount = 0;

  for (const [key, value] of Object.entries(data)) {
    const entryId = config.fields[key];
    if (entryId) {
      const valStr = typeof value === "object" ? JSON.stringify(value) : String(value ?? "");
      formData.append(entryId, valStr);
      mappedFieldsCount++;
    }
  }

  // Add submission timestamp if mapped in the config fields
  if (config.fields["timestamp"]) {
    formData.append(config.fields["timestamp"], new Date().toISOString());
  }

  if (mappedFieldsCount === 0) {
    logError("Google Forms Integration", `No matching keys found in mapping fields for form: ${config.name}`);
    return false;
  }

  // 2. Perform HTTP POST request to the Google Forms endpoint
  const url = config.responseUrl;
  
  // Enforce a serverless-friendly timeout (6 seconds) using AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      logInfo("Google Forms Integration", `Successfully submitted form response for type "${formType}"`);
      return true;
    } else {
      logError("Google Forms Integration", `Failed submission to Google Forms for type "${formType}". Status: ${response.status}`);
      return false;
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    clearTimeout(timeoutId);
    logError("Google Forms Integration", `HTTP POST request failed or timed out for type "${formType}": ${err.message || err}`);
    return false;
  }
}
