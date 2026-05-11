import { getCurrentSession, setCurrentSession, clearCurrentSession } from './sessionsStore.js';

export const SessionsService = {
    async create({ channelId, messageId }) {
        await clearCurrentSession();
        await setCurrentSession({ channelId, messageId });
        return { channelId, messageId };
    },
    get: getCurrentSession,
    clear: clearCurrentSession,
};
