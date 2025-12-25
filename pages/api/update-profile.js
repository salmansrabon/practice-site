const { readUsers, writeUsers } = require('../../lib/data');
const { getUserFromReq } = require('../../lib/auth');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const me = getUserFromReq(req);
  if (!me) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { firstName, lastName, phoneNumber, gender, photo } = req.body || {};

  if (!firstName || !lastName || !phoneNumber || !gender) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const users = await readUsers();
  const userIndex = users.findIndex((u) => u.email.toLowerCase() === me.email.toLowerCase());

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Update user profile
  const updatedUser = {
    ...users[userIndex],
    firstName: String(firstName).trim(),
    lastName: String(lastName).trim(),
    phoneNumber: String(phoneNumber).trim(),
    gender: String(gender),
    updatedAt: new Date().toISOString(),
  };

  // Add photo if provided
  if (photo) {
    updatedUser.photo = photo;
  }

  users[userIndex] = updatedUser;

  await writeUsers(users);

  return res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
}
