import { PermissionFlagsBits } from 'discord.js';
import { ROLE_TIERS, getTier } from '../config/roleTiers.js';

export function memberMeetsTier(member, requiredTierName) {
    if (!member || !requiredTierName) return true;
    const required = getTier(requiredTierName);
    if (!required) return true;

    if (member.permissions?.has?.(PermissionFlagsBits.Administrator)) return true;

    const memberRoleIds = member.roles?.cache ? [...member.roles.cache.keys()] : [];
    const highestRank = Object.values(ROLE_TIERS).reduce((max, tier) => {
        return memberRoleIds.includes(tier.roleId) && tier.rank > max ? tier.rank : max;
    }, 0);

    return highestRank >= required.rank;
}

export function tierLabel(tierName) {
    return getTier(tierName)?.label || tierName;
}
