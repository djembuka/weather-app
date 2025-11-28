// src/utils/toast.ts
type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

const ICONS = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};

export function showToast(
  message: string,
  type: ToastType = 'info',
  duration = 4000
) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  toast.innerHTML = `
    <span class="toast-icon">${ICONS[type]}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" aria-label="Закрыть">×</button>
  `;

  container.appendChild(toast);

  // Авто-удаление
  const timeout = setTimeout(() => removeToast(toast), duration);

  // Ручное закрытие
  const closeBtn = toast.querySelector('.toast-close')!;
  closeBtn.addEventListener('click', () => {
    clearTimeout(timeout);
    removeToast(toast);
  });
}

function removeToast(toast: HTMLElement) {
  toast.style.animation = 'slideOut 0.3s ease-in forwards';
  toast.addEventListener('animationend', () => {
    toast.remove();
  });
}