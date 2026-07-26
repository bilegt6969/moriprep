import * as dotenv from "dotenv";
import path from "path";

// 1. Force load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

if (!process.env.MONGODB_URI) {
  console.error("CRITICAL: MONGODB_URI is not defined in .env.local!");
  process.exit(1);
}

import {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    SlashCommandBuilder,
} from "discord.js";

// 2. Define the bot
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
  new SlashCommandBuilder()
    .setName("approve")
    .setDescription("Approve an order payment")
    .addStringOption((option) =>
      option.setName("txcode").setDescription("The SNT code").setRequired(true),
    ),
  new SlashCommandBuilder()
    .setName("ship")
    .setDescription("Mark order as on delivery")
    .addStringOption((option) =>
      option.setName("txcode").setDescription("The SNT code").setRequired(true),
    ),
  new SlashCommandBuilder()
    .setName("deliver")
    .setDescription("Mark order as delivered")
    .addStringOption((option) =>
      option.setName("txcode").setDescription("The SNT code").setRequired(true),
    ),
].map((command) => command.toJSON());

client.on("clientReady", async (client) => {
  console.log(`Bot logged in as ${client.user?.tag}`);
  const rest = new REST({ version: "10" }).setToken(
    process.env.DISCORD_BOT_TOKEN!,
  );
  try {
    await rest.put(Routes.applicationCommands(client.user!.id), {
      body: commands,
    });
    console.log("Successfully registered slash commands.");
  } catch (error) {
    console.error("Error registering commands:", error);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const allowedUserIds =
    process.env.DISCORD_ADMIN_USER_IDS?.split(",")
      .map((id) => id.trim())
      .filter(Boolean) ?? [];

  if (
    allowedUserIds.length === 0 ||
    !allowedUserIds.includes(interaction.user.id)
  ) {
    await interaction.reply({
      content: "You are not authorized to run this command.",
      ephemeral: true,
    });
    return;
  }

  const txCode = interaction.options.getString("txcode");

  if (interaction.commandName === "approve") {
    // 3. Immediately defer to prevent 'Unknown interaction' timeout
    await interaction.deferReply();

    try {
      // Dynamic imports to ensure environment is fully initialized
      // TODO: Implement proper database connection
      // const { default: dbConnect } = await import("../lib/dbConnect");
      // const { Order } = await import("../models/Order");
      // await dbConnect();

      // 4. Perform update with Mongoose v8+ compliant syntax
      // const order = await (Order as any).findOneAndUpdate(
      //   { txCode: txCode },
      //   { status: "Payment Approved" },
      //   { returnDocument: "after" },
      // );

      // Placeholder response
      await interaction.editReply(
        `✅ Order **${txCode}** has been marked as Payment Approved (placeholder).`,
      );
    } catch (error) {
      console.error(error);
      await interaction.editReply(
        "⚠️ An error occurred while updating the order.",
      );
    }
  }

  if (interaction.commandName === "ship") {
    await interaction.deferReply();

    try {
      // TODO: Implement proper database connection
      // const { default: dbConnect } = await import("../lib/dbConnect");
      // const { Order } = await import("../models/Order");
      // await dbConnect();

      // const order = await (Order as any).findOneAndUpdate(
      //   { txCode: txCode },
      //   { status: "On Delivery" },
      //   { returnDocument: "after" },
      // );

      // Placeholder response
      await interaction.editReply(
        `🚚 Order **${txCode}** has been marked as On Delivery (placeholder).`,
      );
    } catch (error) {
      console.error(error);
      await interaction.editReply(
        "⚠️ An error occurred while updating the order.",
      );
    }
  }

  if (interaction.commandName === "deliver") {
    await interaction.deferReply();

    try {
      // TODO: Implement proper database connection
      // const { default: dbConnect } = await import("../lib/dbConnect");
      // const { Order } = await import("../models/Order");
      // await dbConnect();

      // const order = await (Order as any).findOneAndUpdate(
      //   { txCode: txCode },
      //   { status: "Delivered" },
      //   { returnDocument: "after" },
      // );

      // Placeholder response
      await interaction.editReply(
        `✅ Order **${txCode}** has been marked as Delivered (placeholder).`,
      );
    } catch (error) {
      console.error(error);
      await interaction.editReply(
        "⚠️ An error occurred while updating the order.",
      );
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
