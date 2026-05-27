/** Re-enable login gate by setting PUBLIC_AUTH_REQUIRED=true in env. */
export function isAuthRequired() {
  return import.meta.env.PUBLIC_AUTH_REQUIRED === 'true';
}
