import {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
  } from "discord.js";

const channelId = ""; // channel id

export default {
    roles: [""], // role ids that can use this
    data: new SlashCommandBuilder()
      .setName("session-boost")
      .setDescription("Sends a boost ping."),

    async execute(interaction, client) {
      const embed1 = new EmbedBuilder()
        .setColor("#37373E")
        .setImage(""); // header image url

      const embed2 = new EmbedBuilder()
        .setColor("#37373E")
        .setTitle("Session Boost")
        .setDescription(
          "> The in-game server count is currently **low**. Join up to skip the queue and participate in some amazing roleplays!"
        )
        .setImage(""); // footer image url

      const startLinkButton = new ButtonBuilder()
        .setLabel("Quick Join")
        .setURL("") // join url
        .setStyle(ButtonStyle.Link);

      const startButtonRow = new ActionRowBuilder().addComponents(
        startLinkButton
      );

      const roleId = ""; // role id (leave empty to use @here)
      const channel = await client.channels.fetch(channelId);
      await channel.send({
        content: roleId ? `<@&${roleId}>` : "@here",
        embeds: [embed1, embed2],
        components: [startButtonRow],
      });

      await interaction.reply({
        content:
          "**Successfully** sent session boost!",
        ephemeral: true,
      });
    },
  };
