module.exports = function(controller) {
  controller.on("slash_command", function(bot, message) {
    var t = "\nMessage:```" + JSON.stringify(message) + "```";
      if(message.command == "/jobadvert"){
        // reply to slash command
        bot.replyPublic(
          message,
          "Everyone can see this part of the slash command" + t
        );
      } else {
        bot.replyPrivate(
            message,
            "Could not post job advert" + t
          );
      }
  });
};
