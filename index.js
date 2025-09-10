const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  PermissionsBitField
} = require("discord.js");
const fs = require("fs");
const config = require("./config.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [Partials.Channel]
});

function hasAccess(member, sys = false) {
  if (config.sys.includes(member.id)) return true;
  if (sys) return false;
  if (config.owners.includes(member.id)) return true;
  if (member.permissions.has(PermissionsBitField.Flags.Administrator)) return true;
  return false;
}

function embedMessage(title, description) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(config.color)
    .setFooter({ text: config.footer });
}

client.once("ready", () => {
  client.user.setPresence({
    activities: [{ name: config.status, type: 1, url: "https://twitch.tv/d34fr" }],
    status: "dnd"
  });
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
});


client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();


  if (command === "help") {
    const embed = embedMessage("📖〡Aide", `
\`${config.prefix}dcall\` - Supprime **tous** les salons
\`${config.prefix}dc <Nom>\` - Supprime les salons contenant <Nom>
\`${config.prefix}dr\` - Supprime **tous** les rôles
\`${config.prefix}dr <Nom>\` - Supprime les rôles contenant <Nom>
\`${config.prefix}rename\` - Reset pseudos des membres
\`${config.prefix}unbanall\` - Débannit tous les bannis
\`${config.prefix}dero\` - Reset les perms @everyone
\`${config.prefix}owner <user>\` - Liste/Ajoute owner
\`${config.prefix}tempo\` - Crée un salon visible par tous
\`${config.prefix}clear\` - Supprime tous les messages d’un salon
    `);
    return message.channel.send({ embeds: [embed] });
  }

  if (command === "dcall") {
    if (!hasAccess(message.member)) return;
    for (const channel of message.guild.channels.cache.values()) {
      try { await channel.delete(); } catch {}
    }
    await message.guild.channels.create({
      name: "discussion",
      type: 0,
      permissionOverwrites: [
        { id: message.guild.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
      ]
    });
    return message.channel.send({ embeds: [embedMessage("🗑️〡Dcall", "Tous les salons ont été supprimés et un salon recréé.")] });
  }

  if (command === "dc") {
    if (!hasAccess(message.member)) return;
    const term = args.join(" ").toLowerCase();
    for (const channel of message.guild.channels.cache.values()) {
      if (channel.name.toLowerCase().includes(term)) {
        try { await channel.delete(); } catch {}
      }
    }
    await message.guild.channels.create({
      name: "discussion",
      type: 0,
      permissionOverwrites: [
        { id: message.guild.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
      ]
    });
    return message.channel.send({ embeds: [embedMessage("🗑️〡DC", `Salons contenant \`${term}\` supprimés.`)] });
  }

  if (command === "dr") {
    if (!hasAccess(message.member)) return;
    const term = args.join(" ").toLowerCase();
    for (const role of message.guild.roles.cache.values()) {
      if (role.managed || role.id === message.guild.id) continue;
      if (!term || role.name.toLowerCase().includes(term)) {
        try { await role.delete(); } catch {}
      }
    }
    return message.channel.send({ embeds: [embedMessage("🎭〡DR", term ? `Rôles contenant \`${term}\` supprimés.` : "Tous les rôles ont été supprimés.")] });
  }

  if (command === "rename") {
    if (!hasAccess(message.member)) return;
    for (const member of message.guild.members.cache.values()) {
      try { await member.setNickname(null); } catch {}
    }
    return message.channel.send({ embeds: [embedMessage("✏️〡Rename", "Tous les pseudos ont été reset.")] });
  }

  if (command === "unbanall") {
    if (!hasAccess(message.member)) return;
    const bans = await message.guild.bans.fetch();
    for (const ban of bans.values()) {
      try { await message.guild.members.unban(ban.user.id); } catch {}
    }
    return message.channel.send({ embeds: [embedMessage("🔓〡Unbanall", "Tous les membres bannis ont été débannis.")] });
  }

  if (command === "dero") {
    if (!hasAccess(message.member)) return;
    const everyone = message.guild.roles.everyone;
    await everyone.setPermissions([
      PermissionsBitField.Flags.ViewChannel,
      PermissionsBitField.Flags.CreateInstantInvite,
      PermissionsBitField.Flags.ChangeNickname,
      PermissionsBitField.Flags.ReadMessageHistory,
      PermissionsBitField.Flags.UseExternalEmojis,
      PermissionsBitField.Flags.Connect,
      PermissionsBitField.Flags.Speak,
      PermissionsBitField.Flags.Stream,
      PermissionsBitField.Flags.UseVAD,
      PermissionsBitField.Flags.UseApplicationCommands
    ]);
    return message.channel.send({ embeds: [embedMessage("⚙️〡Dero", "Permissions de @everyone réinitialisées.")] });
  }

  if (command === "owner") {
    if (!hasAccess(message.member, true)) return;
    if (!args[0]) {
      return message.channel.send({ embeds: [embedMessage("👑〡Owners", config.owners.map(id => `<@${id}>`).join("\n") || "Aucun owner.")] });
    }
    const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
    if (!user) return;
    if (!config.owners.includes(user.id)) {
      config.owners.push(user.id);
      fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
    }
    return message.channel.send({ embeds: [embedMessage("👑〡Owner", `${user.tag} ajouté aux owners.`)] });
  }

  if (command === "tempo") {
    if (!hasAccess(message.member)) return;
    await message.guild.channels.create({
      name: "temp-discussion",
      type: 0,
      permissionOverwrites: [
        { id: message.guild.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
      ]
    });
    return message.channel.send({ embeds: [embedMessage("⏳〡Tempo", "Salon temporaire créé.")] });
  }

  if (command === "clear") {
    if (!hasAccess(message.member)) return;
    const channel = message.channel;
    let messages;
    do {
      messages = await channel.messages.fetch({ limit: 100 });
      await channel.bulkDelete(messages);
    } while (messages.size > 0);
    return channel.send({ embeds: [embedMessage("🧹〡Clear", "Tous les messages ont été supprimés.")] });
  }
});

client.login(config.token);
