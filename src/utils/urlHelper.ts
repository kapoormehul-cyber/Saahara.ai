/**
 * Utility functions for robust URL opening and verification.
 * Ensures external links open reliably across desktop browsers, mobile touch devices,
 * and restricted webview / iframe preview environments.
 */

export function openExternalOfficialUrl(
  url: string,
  e?: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
): boolean {
  if (e) {
    e.stopPropagation();
  }

  if (!url || typeof url !== 'string' || !/^https?:\/\//i.test(url.trim())) {
    if (e) e.preventDefault();
    console.warn('[OfficialSource] Invalid or missing official URL:', url);
    return false;
  }

  const cleanUrl = url.trim();

  // If user used modifier keys (Ctrl, Cmd, Shift, Alt, middle-click), let the browser handle naturally
  if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)) {
    return true;
  }

  // Attempt window.open in a new tab with security attributes
  try {
    const newWindow = window.open(cleanUrl, '_blank', 'noopener,noreferrer');
    if (newWindow && !newWindow.closed) {
      if (e) e.preventDefault();
      try {
        newWindow.focus();
      } catch {
        // focus() might throw in restricted cross-origin frames; safe to ignore
      }
      return true;
    }
  } catch (err) {
    console.warn('[OfficialSource] window.open failed, attempting fallback navigation:', err);
  }

  // Fallback: If window.open was blocked by sandbox (e.g. iframe preview without allow-popups)
  // or a strict popup blocker, check if we're inside an iframe and open via top.
  try {
    if (window.self !== window.top) {
      if (e) e.preventDefault();
      window.open(cleanUrl, '_top');
      return true;
    }
  } catch {
    // Cross-origin top access check may throw; fall through
  }

  // Allow native <a> navigation if window.open was blocked in standard browser
  return true;
}
