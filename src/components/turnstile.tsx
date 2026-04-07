"use client";

import { Turnstile as TurnstileWidget } from "@marsidev/react-turnstile";

interface TurnstileProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
}

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function Turnstile({ onSuccess, onError, onExpire }: TurnstileProps) {
  if (!siteKey) return null;

  return (
    <TurnstileWidget
      siteKey={siteKey}
      onSuccess={onSuccess}
      onError={onError}
      onExpire={onExpire}
      options={{
        theme: "light",
        size: "flexible",
      }}
    />
  );
}
