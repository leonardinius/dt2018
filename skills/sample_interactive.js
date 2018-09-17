module.exports = function(controller) {
  controller.hears(["^job (.*)"], "direct_message", function(bot, message) {
    if (!message.match[1]) {
      bot.reply(message, "I will job post whatever you ask.");
      return;
    }

    bot.reply(message, {
      text: message.match[1] + "\n\n<@" + message.user + "|Ask More>",
      attachments: [
        {
          callback_id: "123",
          attachment_type: "default",
          actions: [
            {
              name: "like",
              text: "Like",
              value: "like",
              type: "button",
              style: "primary"
            }
          ]
        }
      ]
    });
  });

  controller.on("interactive_message_callback", function(bot, message) {
    // check message.actions and message.callback_id to see what action to take...
    bot.api.reactions.add(
      {
        timestamp: message.ts,
        channel: message.channel,
        name: "robot_face"
      },
      function(err, res) {
        if (err) {
          bot.botkit.log("Failed to add emoji reaction :(", err);
        }
      }
    );

    bot.replyInteractive(message, message);
  });
};
