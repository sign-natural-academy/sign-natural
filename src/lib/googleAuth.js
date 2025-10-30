// src/lib/googleAuth.js
export function initGoogle({ clientId, onCredential }) {
  /* global google */
  if (!window.google || !google.accounts || !clientId) return;

  google.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => onCredential?.(response.credential),
    auto_select: false,
    ux_mode: "popup",
  });
}

export function renderGoogleButton(containerId) {
  /* global google */
  if (!window.google || !google.accounts) return;
  const el = document.getElementById(containerId);
  if (!el) return;

  google.accounts.id.renderButton(el, {
    theme: "outline",
    size: "large",
    type: "standard",
    shape: "pill",
    text: "signin_with",
    logo_alignment: "left",
    width: 260,
  });
}
