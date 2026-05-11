export const ROLE_TIERS = {
    admin:  { rank: 3, roleId: '1490147997282078900', label: 'Admin' },
    mod:    { rank: 2, roleId: '1490147997282078896', label: 'Moderator' },
    helper: { rank: 1, roleId: '1490147997244330118', label: 'Helper' },
};

export const TIER_ORDER = ['helper', 'mod', 'admin'];

export function getTier(name) {
    return ROLE_TIERS[name] || null;
}
