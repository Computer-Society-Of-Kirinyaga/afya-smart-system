import * as bcrypt from 'bcrypt';

export async function hashData(data: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(data, salt);
}

export async function compareData(
  data: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(data, hash);
}
