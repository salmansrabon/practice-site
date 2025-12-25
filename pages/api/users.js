const { readUsers } = require('../../lib/data');
const { getUserFromReq } = require('../../lib/auth');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const me = getUserFromReq(req);
  if (!me) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const q = String(req.query.q || '').toLowerCase();
  const page = Math.max(1, parseInt(req.query.page || '1', 10));
  const pageSize = Math.max(1, parseInt(req.query.pageSize || '10', 10));

  const users = await readUsers();
  const filtered = q
    ? users.filter((u) =>
        [u.firstName, u.lastName, u.email, u.phoneNumber]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      )
    : users;

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return res.status(200).json({ data, page, pageSize, total, totalPages });
}
