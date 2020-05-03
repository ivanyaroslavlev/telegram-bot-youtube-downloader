const youtubedl = require("youtube-dl");
const TelegramBot = require("node-telegram-bot-api");

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(process.env.TOKEN_TELEGRAM_BOT, {
  baseApiUrl: process.env.PROXY,
  polling: true,
});

bot.on("message", (msg) => {
  if (msg.text === "/start") {
    bot.sendVideo(msg.chat.id, "./demo/tutorial.mp4");
    bot.sendMessage(
      msg.chat.id,
      `Hello, ${msg.chat.first_name} ${msg.chat.last_name}! Please waiting tutorial video...`
    );
  } else {
    getInfo(msg);
  }
});

const getInfo = (msg) => {
  youtubedl.getInfo(
    msg.text,
    ["--username=user", "--password=hunter2"],
    function (err, info) {
      if (err) {
        bot.sendMessage(msg.chat.id, err.message);
      }
      bot.sendPhoto(msg.chat.id, info.thumbnail, {
        caption: info.title,
        reply_markup: {
          inline_keyboard: [
            ...info.formats
              .map((format) => {
                if (
                  format.acodec === "none" ||
                  (format.vcodec === "none" && format.format_id !== "251")
                )
                  return null;

                return [
                  {
                    text: format.format,
                    url: format.url,
                    callback_data: "1",
                  },
                ];
              })
              .filter((key) => !!key),
          ],
        },
      });
    }
  );
};
