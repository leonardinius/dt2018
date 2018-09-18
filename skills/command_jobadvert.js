module.exports = function(controller) {
  controller.on("slash_command", function(bot, message) {
    var t = "\nMessage:```" + JSON.stringify(message) + "```";
      if(message.command == "/jobadvert"){
        // reply to slash command
        bot.replyPublic(
          message,{
            text: message.text + t + "\n@" + message.user + " ask more",
            attachments: [
              {
                text: "Do you like it?",
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
          }
        );
      } else {
        bot.replyPrivate(
            message,
            "Could not post job advert" + t
          );
      }
  });
};
