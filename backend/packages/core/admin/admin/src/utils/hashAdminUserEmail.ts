import { SanitizedAdminUser } from '../../../shared/contracts/shared';

export const utils = {
  bufferToHex(buffer: ArrayBuffer) {
    return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
  },
  async digestMessage(message: string) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);

    return this.bufferToHex(hashBuffer);
  },
};

export async function hashAdminUserEmail(payload?: SanitizedAdminUser) {
  if (!payload || !payload.email) {
    return null;
  }

  try {
    return await utils.digestMessage(payload.email);
  } catch (error) {
    return null;
  }
}
