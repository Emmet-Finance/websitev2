import { useState } from "react";
import { isValidEmail } from "../verifiers";
import { emailBackend } from "../types";

async function Subscribe(
  email: string,
): Promise<{ success: boolean; error: string | null }> {
  const request = `${emailBackend}/email/email?email=${email}`;
  const result = await fetch(request);
  const json = await result.json();
  return {
    success: json.ok,
    error: json.error ? json.error : null,
  };
}

export default function useSignup() {
  const [success, setSuccess] = useState<boolean>();
  const [error, setError] = useState<string | null>(null);

  const send = (email: string) => {
    (async () => {
      if (isValidEmail(email)) {
        const result = await Subscribe(email);
        setSuccess(result.success);
        setError(result.error);
      }
    })();
  };

  return { send, success, error };
}
