import {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
  } from "discord.js";
import axios from "axios";
import { SessionsService } from "../../services/sessionsService.js";
import { SlashCommandBuilder } from "discord.js";

const channelId = ""; // your channel id

export default {
    roles: [""], // role ids that can use this
    data: new SlashCommandBuilder()
      .setName("sessions")
      .setDescription("Sends the session panel"),
    async execute(interaction, client) {
      const serverKey = ""; // your server api key
      const apiBaseUrl = ""; // api base url (e.g. https://api.example.com/v1)

      const [playersRes, queueRes] = await Promise.allSettled([
        axios.get(`${apiBaseUrl}/server/players`, {
          headers: { "Server-Key": serverKey },
        }),
        axios.get(`${apiBaseUrl}/server/queue`, {
          headers: { "Server-Key": serverKey },
        }),
      ]);

      const players =
        playersRes.status === "fulfilled" ? playersRes.value.data : [];
      const queue = queueRes.status === "fulfilled" ? queueRes.value.data : [];

      const staffRoleId = ""; // staff role id
      await interaction.guild.members.fetch().catch(() => {});
      const moderatingCount = interaction.guild.members.cache.filter((m) =>
        m.roles.cache.has(staffRoleId)
      ).size;

      const tembed = new EmbedBuilder()
        .setColor("#37373E")
        .setImage(""); // header image url

      const notificationRoleId = ""; // notification role id
      const weekdayTime = ""; // weekday timestamp (e.g. 1761163200)
      const weekendTime = ""; // weekend timestamp (e.g. 1761148800)
      const embed1 = new EmbedBuilder()
        .setColor("#37373E")
        .setDescription(
          "> You will be notified here when a staff member initiates a session. Do not attempt to join the server when it is shutdown.\n\n> Ensure you have the <@&" + notificationRoleId + "> role to be notified when a session occurs. Our sessions typically occur sometime around <t:" + weekdayTime + ":t> on the weekdays and <t:" + weekendTime + ":t> on the weekends."
        )
        .setImage(""); // footer image url

      const now = Math.floor(Date.now() / 1000);

      const updatedEmbed = new EmbedBuilder()
        .setColor("#37373E")
        .setTitle("Session Status")
        .setDescription(`**Last Updated:** <t:${now}:R>`)
        .addFields(
          {
            name: "Players",
            value: `\`\`\`\n${players.length}\n\`\`\``,
            inline: true,
          },
          {
            name: "Moderating",
            value: `\`\`\`\n${moderatingCount}\n\`\`\``,
            inline: true,
          },
          {
            name: "Queue",
            value: `\`\`\`\n${queue.length}\n\`\`\``,
            inline: true,
          }
        )
        .setImage(""); // footer image url

      const button =
        players.length >= 1
          ? new ButtonBuilder()
              .setCustomId("n/a")
              .setLabel("Server Online")
              .setStyle(ButtonStyle.Success)
              .setDisabled(true)
          : new ButtonBuilder()
              .setCustomId("n/a")
              .setLabel("Server Offline")
              .setStyle(ButtonStyle.Danger)
              .setDisabled(true);

      const bellButton = new ButtonBuilder()
        .setCustomId("sessionsRole:button")
        .setEmoji("") // emoji (format: <:name:id> or just id)
        .setStyle(ButtonStyle.Secondary);

      const row = new ActionRowBuilder().addComponents(button, bellButton);

      const channel = await interaction.guild.channels.fetch(channelId);
      const message = await channel.send({
        embeds: [tembed, embed1, updatedEmbed],
        components: [row],
      });

      // Save the session
      await SessionsService.create({
        channelId: channel.id,
        messageId: message.id,
      });

      await interaction.reply({
        content: "**Successfully** sent the session panel.",
        ephemeral: true,
      });
    },
  };
