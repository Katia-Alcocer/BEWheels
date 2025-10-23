import bcrypt from 'bcrypt';

export const hashPassword = async (plainText) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plainText, salt);
};

export const comparePassword = async (plainText, hash) => {
  return await bcrypt.compare(plainText, hash);
};
