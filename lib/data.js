const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(process.cwd(), 'data', 'users.json');

async function readUsers() {
  try {
    const content = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(content || '[]');
  } catch (e) {
    if (e.code === 'ENOENT') return [];
    throw e;
  }
}

async function writeUsers(users) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

async function addUser(user) {
  const users = await readUsers();
  users.push(user);
  await writeUsers(users);
  return user;
}

async function findUserByEmail(email) {
  const users = await readUsers();
  return users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
}

async function findUserById(id) {
  const users = await readUsers();
  return users.find((u) => String(u.id) === String(id));
}

async function deleteUserById(id) {
  const users = await readUsers();
  const idx = users.findIndex((u) => String(u.id) === String(id));
  if (idx === -1) return false;
  users.splice(idx, 1);
  await writeUsers(users);
  return true;
}

async function updateUserById(id, patch) {
  const users = await readUsers();
  const idx = users.findIndex((u) => String(u.id) === String(id));
  if (idx === -1) return null;
  const current = users[idx];
  const updated = {
    ...current,
    firstName: patch.firstName ?? current.firstName,
    lastName: patch.lastName ?? current.lastName,
    email: patch.email ?? current.email,
    phoneNumber: patch.phoneNumber ?? current.phoneNumber,
    gender: patch.gender ?? current.gender,
    birthdate: patch.birthdate ?? current.birthdate,
    district: patch.district ?? current.district,
    bloodGroup: patch.bloodGroup ?? current.bloodGroup,
    photo: patch.photo ?? current.photo,
  };
  users[idx] = updated;
  await writeUsers(users);
  return updated;
}

module.exports = { readUsers, writeUsers, addUser, findUserByEmail, findUserById, deleteUserById, updateUserById, DATA_FILE };
