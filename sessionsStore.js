import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STORE_PATH = path.join(__dirname, '..', '..', 'data', 'sessions.json');

async function ensureDir() {
    await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
}

export async function getCurrentSession() {
    try {
        const raw = await fs.readFile(STORE_PATH, 'utf8');
        const data = JSON.parse(raw);
        if (data && data.channelId && data.messageId) return data;
        return null;
    } catch (err) {
        if (err.code === 'ENOENT') return null;
        throw err;
    }
}

export async function setCurrentSession({ channelId, messageId }) {
    await ensureDir();
    await fs.writeFile(STORE_PATH, JSON.stringify({ channelId, messageId }, null, 2));
}

export async function clearCurrentSession() {
    try {
        await fs.unlink(STORE_PATH);
    } catch (err) {
        if (err.code !== 'ENOENT') throw err;
    }
}
