// handleError.enhanced.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleError } from '@/utils/errorHandler.ts';
import { showToast } from '@/utils/toast';

vi.mock('@/utils/toast', () => ({
    showToast: vi.fn()
}));

const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
const mockedShowToast = vi.mocked(showToast);

describe('handleError', () => {
    
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Error instance → error.message', () => {
    const error = new Error('Сеть недоступна');
    handleError(error, 'fetchData');

    expect(mockConsoleError).toHaveBeenCalledWith('[fetchData]', error);
    expect(mockedShowToast).toHaveBeenCalledWith('Сеть недоступна', 'error');
  });

  it('string → as message', () => {
    handleError('Таймаут запроса', 'apiCall');

    expect(mockConsoleError).toHaveBeenCalledWith('[apiCall]', 'Таймаут запроса');
    expect(mockedShowToast).toHaveBeenCalledWith('Таймаут запроса', 'error');
  });

  it('{message: "..."} → message', () => {
    const axiosLikeError = {
      message: 'Request failed with status code 500',
      response: { status: 500 },
      config: { url: '/api/users' },
    };

    handleError(axiosLikeError, 'axiosRequest');

    expect(mockConsoleError).toHaveBeenCalledWith('[axiosRequest]', axiosLikeError);
    expect(mockedShowToast).toHaveBeenCalledWith('Request failed with status code 500', 'error');
  });

  it('{message: ""} → message === ""', () => {
    const error = { message: '' };
    handleError(error, 'emptyMessage');

    expect(mockedShowToast).toHaveBeenCalledWith('', 'error');
  });

  it('{message: <not a string>} → default', () => {
    const error = { message: 123 }; // message не строка
    handleError(error, 'invalidMessageType');

    expect(mockedShowToast).toHaveBeenCalledWith('Что-то пошло не так...', 'error');
  });

  it('null, undefined, number, boolean → default', () => {
    const cases: unknown[] = [null, undefined, 404, false, Symbol('boom'), []];

    cases.forEach((error) => {
      mockConsoleError.mockClear();
      mockedShowToast.mockClear();

      handleError(error, 'fallback');

      expect(mockConsoleError).toHaveBeenCalledWith('[fallback]', error);
      expect(mockedShowToast).toHaveBeenCalledWith('Что-то пошло не так...', 'error');
    });
  });

  it('{notAMessageKey: ""} → default', () => {
    const error = { code: 'ECONNREFUSED' };
    handleError(error, 'noMessageField');

    expect(mockedShowToast).toHaveBeenCalledWith('Что-то пошло не так...', 'error');
  });

  it('{ error: {message: ""}} → default', () => {
    const error = {
      error: { message: 'Вложенная ошибка' },
    } as any;

    handleError(error, 'nested');

    // Мы проверяем только наличие поля message на самом объекте, а не глубоко
    expect(mockedShowToast).toHaveBeenCalledWith('Что-то пошло не так...', 'error');
  });

  it('"symbols [] !#1"', () => {
    const error = new Error('boom');
    const context = `Очень "важный" [контекст] с пробелами и символами! #1`;

    handleError(error, context);

    expect(mockConsoleError).toHaveBeenCalledWith(
      '[Очень "важный" [контекст] с пробелами и символами! #1]',
      error
    );
    expect(mockedShowToast).toHaveBeenCalledWith('boom', 'error');
  });
});