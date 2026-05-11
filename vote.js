import { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } from 'discord.js';

const cooldowns = new Map();

export default {
    name: 'vote',
    async execute(interaction, client, args) {
        const sessionId = args[0];
        const voter = interaction.user;
        const userId = voter.id;

        const now = Date.now();
        const cooldownTime = 5000;
        if (cooldowns.has(userId)) {
            const expiresAt = cooldowns.get(userId);
            if (now < expiresAt) {
                const relative = `<t:${Math.floor(expiresAt / 1000)}:R>`;
                return interaction.reply({
                    content: `You are on **cooldown**, please try again ${relative}.`,
                    ephemeral: true,
                });
            }
        }
        cooldowns.set(userId, now + cooldownTime);
        setTimeout(() => cooldowns.delete(userId), cooldownTime);

        if (!client.voteMap) client.voteMap = new Map();

        if (!client.voteMap.has(sessionId)) {
            client.voteMap.set(sessionId, new Map());
            client.activePollId = sessionId;
        }

        const sessionVotes = client.voteMap.get(sessionId);
        const hasVoted = sessionVotes.has(userId);

        if (hasVoted) {
            sessionVotes.delete(userId);
        } else {
            sessionVotes.set(userId, { userId, timestamp: Date.now() });
        }

        const count = sessionVotes.size;

        const voteBtn = new ButtonBuilder()
            .setCustomId(`vote:${sessionId}`)
            .setLabel('Vote')
            .setStyle(ButtonStyle.Secondary);

        const viewBtn = new ButtonBuilder()
            .setCustomId(`viewvote:${sessionId}`)
            .setLabel(`View Voters (${count})`)
            .setStyle(ButtonStyle.Secondary);

        await interaction.update({
            components: [new ActionRowBuilder().addComponents(voteBtn, viewBtn)],
        });

        await interaction.followUp({
            content: hasVoted ? '**Successfully** removed your vote!' : '**Successfully** counted your vote!',
            ephemeral: true,
        });

        const requiredVotes = 7; // change this to your required vote count
        if (sessionVotes.size === requiredVotes) {
            const votersArray = [...sessionVotes.values()];
            const votersList = votersArray.map((v) => `<@${v.userId}>`).join(', ') || 'No Voters';

            const headerEmbed = new EmbedBuilder()
                .setColor('#37373E')
                .setImage(''); // header image url

            const serverName = ''; // server name
            const serverOwner = ''; // server owner
            const joinCode = ''; // join code
            const infoEmbed = new EmbedBuilder()
                .setColor('#37373E')
                .setTitle('**Session Startup**')
                .setDescription(
                    '> A server start-up has been initiated! Please ensure you have read and understood our regulations prior to joining.\n\n' +
                    '**Game Information**\n' +
                    '> **Server Name**: ' + serverName + '\n' +
                    '> **Server Owner**: ' + serverOwner + '\n' +
                    '> **Join Code**: ' + joinCode + '\n\n'
                )
                .setImage(''); // footer image url

            const startLinkBtn = new ButtonBuilder()
                .setLabel('Quick Join')
                .setURL('https://example.com') // join url
                .setStyle(ButtonStyle.Link);

            const roleId = ''; // role id to ping
            await interaction.channel.send({
                content: `${roleId ? `<@&${roleId}>\n` : ''}-# ${votersList}`,
                embeds: [headerEmbed, infoEmbed],
                components: [new ActionRowBuilder().addComponents(startLinkBtn)],
            });

            try { await interaction.message.delete(); } catch {}

            for (const v of votersArray) {
                const uid = v.userId;
                const member = interaction.guild?.members.cache.get(uid)
                    || (await interaction.guild?.members.fetch(uid).catch(() => null));
                const userToDM = member ? member.user : await interaction.client.users.fetch(uid).catch(() => null);
                if (!userToDM) continue;

                try {
                    const dmEmbed = new EmbedBuilder()
                        .setColor('#37373E')
                        .setDescription(`Hey <@${uid}>, thank you for voting. The session has now started — please join the game to avoid getting moderated!`);

                    const dmLinkBtn = new ButtonBuilder()
                        .setLabel('Quick Join')
                        .setURL('https://example.com') // join url
                        .setStyle(ButtonStyle.Link);

                    await userToDM.send({
                        embeds: [dmEmbed],
                        components: [new ActionRowBuilder().addComponents(dmLinkBtn)],
                    });
                } catch (error) {
                    console.error(`Could not DM ${uid}: ${error.message}`);
                }
            }

            client.voteMap.delete(sessionId);
        }
    },
};
