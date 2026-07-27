import { describe, it, expect, vi } from 'vitest';
import { tratarErroIA } from '../../api/_lib/errorHandler';
import { getDefaultEndpoint } from '../../api/_lib/ia';

describe('api/_lib/errorHandler', () => {
  it('identifica erro de chave ausente', () => {
    const mockRes: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    tratarErroIA(new Error('chave_ausente'), mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ erro: 'chave_ausente' });
  });

  it('identifica erro de cota excedida (429)', () => {
    const mockRes: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    tratarErroIA(new Error('RESOURCE_EXHAUSTED: quota exceeded'), mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(429);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        erro: expect.stringContaining('cota de uso'),
      })
    );
  });

  it('identifica erro de chave de API inválida', () => {
    const mockRes: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    tratarErroIA(new Error('API_KEY_INVALID'), mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        erro: expect.stringContaining('inválida ou expirou'),
      })
    );
  });
});

describe('api/_lib/ia/getDefaultEndpoint', () => {
  it('retorna os endpoints corretos por provedor', () => {
    expect(getDefaultEndpoint('groq')).toBe('https://api.groq.com/openai/v1/chat/completions');
    expect(getDefaultEndpoint('openrouter')).toBe('https://openrouter.ai/api/v1/chat/completions');
    expect(getDefaultEndpoint('mistral')).toBe('https://api.mistral.ai/v1/chat/completions');
    expect(getDefaultEndpoint('openai_compat')).toBe('https://api.openai.com/v1/chat/completions');
  });
});
