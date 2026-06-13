import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 12;

// bcrypt hashes always start with $2a$, $2b$, or $2y$.
const isHashed = (value) => typeof value === "string" && /^\$2[aby]\$/.test(value);

export const hashPassword = (plain) => bcrypt.hash(plain, BCRYPT_ROUNDS);

// Verifies a plaintext password against either a bcrypt hash (new users)
// or a legacy plaintext value (existing users not yet migrated).
export const verifyPassword = async (plain, stored) => {
    if (isHashed(stored)) {
        return bcrypt.compare(plain, stored);
    }
    return plain === stored; // legacy fallback
};

// True when the stored password is still plaintext and should be upgraded.
export const isLegacyPlaintext = (stored) => !isHashed(stored);