import { useState } from 'react';
import { sanitizeInput, detectThreat } from '../lib/security';

export function useSecurity(initialValue: string = '') {
  const [value, setValue] = useState(initialValue);

  const { score: riskScore, classification } = detectThreat(value);

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  return {
    value,
    safeValue: sanitizeInput(value),
    riskScore,
    classification,
    isBlocked: riskScore > 60,
    handleChange
  };
}
