import { showToast } from './toast';

export function handleError(error: unknown, context: string) {
    console.error(`[${context}]`, error);
  
    let message = 'Что-то пошло не так...';
  
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    } else if (
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof (error as any).message === 'string'
    ) {
      message = (error as any).message;
    }
  
    showToast(message, 'error');
}