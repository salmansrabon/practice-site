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

module.exports = { readUsers, writeUsers, addUser, findUserByEmail, DATA_FILE };
