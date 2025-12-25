const { readUsers, writeUsers } = require('../../lib/data');
const { getUserFromReq } = require('../../lib/auth');
const crypto = require('crypto');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const me = getUserFromReq(req);
  if (!me) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { currentPassword, newPassword } = req.body || {};

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  const users = await readUsers();
  const userIndex = users.findIndex((u) => u.email.toLowerCase() === me.email.toLowerCase());

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const user = users[userIndex];
  const currentPasswordHash = crypto.createHash('sha256').update(String(currentPassword)).digest('hex');

  if (user.passwordHash !== currentPasswordHash) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  // Update password
  const newPasswordHash = crypto.createHash('sha256').update(String(newPassword)).digest('hex');
  users[userIndex] = {
    ...user,
    passwordHash: newPasswordHash,
    updatedAt: new Date().toISOString(),
  };

  await writeUsers(users);

  return res.status(200).json({ message: 'Password changed successfully' });
}
