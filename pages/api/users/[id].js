const { getUserFromReq } = require('../../../lib/auth');
const { findUserById, deleteUserById, updateUserById, findUserByEmail } = require('../../../lib/data');

export default async function handler(req, res) {
  const me = getUserFromReq(req);
  if (!me) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (req.method === 'GET') {
    const user = await findUserById(id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ user });
  }

  if (req.method === 'DELETE') {
    const ok = await deleteUserById(id);
    if (!ok) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ message: 'Deleted' });
  }

  if (req.method === 'PUT') {
    const body = req.body || {};
    // Allow editing any user (test site), but keep email unique across users
    const target = await findUserById(id);
    if (!target) return res.status(404).json({ error: 'Not found' });
    if (body.email && body.email !== target.email) {
      const exists = await findUserByEmail(body.email);
      if (exists && String(exists.id) !== String(id)) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }
    const updated = await updateUserById(id, {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phoneNumber: body.phoneNumber,
      gender: body.gender,
      birthdate: body.birthdate,
      district: body.district,
      bloodGroup: body.bloodGroup,
      photo: body.photo,
    });
    return res.status(200).json({ user: updated });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
