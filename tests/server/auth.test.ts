import { describe, it, expect, vi } from 'vitest';

// Mock do firebase-admin
vi.mock('../../api/_lib/firebase-admin', () => ({
  adminAuth: {
    verifyIdToken: vi.fn(),
  },
  adminDb: {
    collection: vi.fn(),
  },
}));

import { verificarAuth } from '../../api/_lib/requireAuth';
import { adminAuth, adminDb } from '../../api/_lib/firebase-admin';

describe('api/_lib/requireAuth', () => {
  it('rejeita requisições sem header Authorization', async () => {
    const mockReq: any = { headers: {} };
    await expect(verificarAuth(mockReq)).rejects.toThrow('Não autorizado');
  });

  it('rejeita requisições com formato de header inválido', async () => {
    const mockReq: any = { headers: { authorization: 'Basic 12345' } };
    await expect(verificarAuth(mockReq)).rejects.toThrow('Não autorizado');
  });

  it('valida token e retorna uid quando token é válido', async () => {
    vi.mocked(adminAuth.verifyIdToken).mockResolvedValueOnce({
      uid: 'user_123',
      email: 'user@example.com',
    } as any);

    const mockGetDoc = vi.fn().mockResolvedValueOnce({
      exists: true,
      data: () => ({
        plano: 'free',
        backup_automatico: true,
      }),
    });

    vi.mocked(adminDb.collection).mockReturnValueOnce({
      doc: vi.fn().mockReturnValueOnce({
        collection: vi.fn().mockReturnValueOnce({
          doc: vi.fn().mockReturnValueOnce({
            get: mockGetDoc,
          }),
        }),
      }),
    } as any);

    const mockReq: any = { headers: { authorization: 'Bearer valid_token_abc' } };
    const ctx = await verificarAuth(mockReq);

    expect(ctx.uid).toBe('user_123');
    expect(ctx.email).toBe('user@example.com');
    expect(ctx.userConfig.backup_automatico).toBe(true);
  });
});
