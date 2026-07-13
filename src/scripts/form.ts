interface FormConfig {
  formId: string;
  endpoint: string;
  subject: string;
  fieldIds: string[];
}

// Wires up focus/value styling and a Formspree POST submit handler for a form.
// Shared shape so other pages (e.g. the reports request form) can reuse it
// instead of hand-rolling their own fetch-to-Formspree submit handler.
export function initForm(config: FormConfig): void {
  const form = document.getElementById(config.formId) as HTMLFormElement | null;
  if (!form) return;

  const submitBtn = form.querySelector('.btn-submit') as HTMLButtonElement | null;
  let messageDiv = document.getElementById('formMessage');
  if (!messageDiv) {
    messageDiv = document.createElement('div');
    messageDiv.id = 'formMessage';
    messageDiv.className = 'form-message';
    form.appendChild(messageDiv);
  }

  form.querySelectorAll('input, select, textarea').forEach((input) => {
    input.addEventListener('focus', () => input.parentElement?.classList.add('focused'));
    input.addEventListener('blur', () => {
      if (!(input as HTMLInputElement).value) input.parentElement?.classList.remove('focused');
    });
    input.addEventListener('change', () => {
      if ((input as HTMLInputElement).value) {
        input.classList.add('has-value');
        input.parentElement?.classList.add('focused');
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;
    form.querySelectorAll('[required]').forEach((input) => {
      const el = input as HTMLInputElement;
      if (!el.value.trim()) {
        isValid = false;
        el.style.borderColor = '#dc2626';
      } else {
        el.style.borderColor = '';
      }
    });

    if (!isValid) {
      messageDiv.innerHTML = '<span style="color: var(--accent-red);">Please fill in all required fields.</span>';
      messageDiv.style.opacity = '1';
      return;
    }

    const payload: Record<string, string> = { _subject: config.subject };
    for (const id of config.fieldIds) {
      payload[id] = (document.getElementById(id) as HTMLInputElement | null)?.value ?? '';
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
    }
    messageDiv.innerHTML = '<span style="color: #94a3b8;">Sending…</span>';
    messageDiv.style.opacity = '1';

    try {
      const r = await fetch(config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (r.ok) {
        messageDiv.innerHTML = '<span style="color: #10b981;">REQUEST RECEIVED. STANDBY FOR CONTACT.</span>';
        messageDiv.className = 'form-message success';
        form.reset();
      } else {
        const err = await r.json().catch(() => ({}));
        messageDiv.innerHTML =
          '<span style="color: #f87171;">' + (err.error || 'Send failed') + '. Email ksekhon9851@Gmail.com</span>';
        messageDiv.className = 'form-message';
      }
    } catch {
      messageDiv.innerHTML = '<span style="color: #f87171;">Network error. Email ksekhon9851@Gmail.com</span>';
      messageDiv.className = 'form-message';
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
    }
    messageDiv.style.opacity = '1';
  });
}
