export const TURNSTILE_ACTIONS = {
  contact: "contact",
  cvRequest: "cv-request",
} as const;

export type TurnstileAction = (typeof TURNSTILE_ACTIONS)[keyof typeof TURNSTILE_ACTIONS];
