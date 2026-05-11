import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';

export const TICKET_PANEL_COLOR = 0x242429;

export const TICKET_PANEL_IMAGE = 'https://cdn.discordapp.com/attachments/1495601343610748978/1502741239554904235/image.png?ex=6a00d057&is=69ff7ed7&hm=3a7d29338d54ce12811f77f8cdd702a14d12e1a11ae4770aead7d7b2de200863&';

export const TICKET_PANEL_DESCRIPTION =
    "Need help? You're in the right place. Our assistance team is here to answer your questions and handle any requests. Whether something isn't clear or you've run into an issue with one of our services, we're ready to assist. Please make sure to open the correct ticket for your needs!\n\n" +
    "**Please read before opening a ticket:**\n" +
    "- We are not seeking any Developers!\n" +
    "- Please only open a ticket if you have a report, department problem, general question, or anything involving our server!";

export const TICKET_CATEGORIES = [
    { key: 'department', label: 'Department Support', emoji: '🏢', roleId: '1490147997181284417', style: ButtonStyle.Primary },
    { key: 'general',    label: 'General Support',    emoji: '💬', roleId: '1490147997244330118', style: ButtonStyle.Secondary },
    { key: 'management', label: 'Management Support', emoji: '👔', roleId: '1490147997269627080', style: ButtonStyle.Success },
];

export function getTicketCategory(key) {
    return TICKET_CATEGORIES.find(c => c.key === key) || null;
}

export function buildTicketPanel({ description } = {}) {
    const embed = new EmbedBuilder()
        .setTitle('Support Tickets')
        .setDescription(description || TICKET_PANEL_DESCRIPTION)
        .setColor(TICKET_PANEL_COLOR)
        .setImage(TICKET_PANEL_IMAGE);

    const row = new ActionRowBuilder().addComponents(
        ...TICKET_CATEGORIES.map(cat =>
            new ButtonBuilder()
                .setCustomId(`create_ticket:${cat.key}`)
                .setLabel(cat.label)
                .setStyle(cat.style)
                .setEmoji(cat.emoji)
        )
    );

    return { embeds: [embed], components: [row] };
}

export function isTicketPanelButton(customId) {
    return typeof customId === 'string' && (customId === 'create_ticket' || customId.startsWith('create_ticket:'));
}
