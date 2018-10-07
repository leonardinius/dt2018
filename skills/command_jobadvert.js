module.exports = function(controller) {

  const admins = require(__dirname + "/.conf/admins.json");
  const sponsors = require(__dirname + "/.conf/sponsors.json");
  controller.on("slash_command", function(bot, message) {
    let sponsor = message.username
    if (!sponsors.includes(sponsor)) {
      bot.replyPrivate(message, "Sorry, only sponsors can publish job ads. ");
      return;
    }

    if (message.command.startsWith("/jobadvert")) {
      
      let text = message.text || '';
      const parts = text.match(/\n+|\S+/g) || [];

      text = parts.slice(1).join(" ").trim() + "\n";
      bot.reply(message, {
        as_user: sponsor,
        username: sponsor,
        text: text,
        attachments: [
          {
            text: "",
            attachment_type: "default",
            callback_id: message.command,
            actions: [
              {
                name: "like",
                text: "Like",
                value: "like",
                type: "button",
                style: "primary"
              },
              {
                name: "ask-more",
                text: "Ask More",
                type: "button",
                style: "primary",
                url: "slack://user?team=" + message.team_id + "&id=" + sponsor
              }
            ]
          }
        ]
      });
      bot.replyPrivate(message, "Done!");
    } else {
      bot.replyPrivate(message, "Could not post job advertisement");
    }
  });

  controller.on("interactive_message_callback", function (bot, message) {
    var t = ''; //"\nMessage:```" + JSON.stringify(message).replace('```', 'code') + "```";
    if (message.callback_id.startsWith("/jobadvert")) {

      message.ts = message.message_ts;
      const newMessageInThread = {};
      newMessageInThread.as_user = message.original_message.as_user;
      newMessageInThread.username = message.original_message.username;
      newMessageInThread.icon_url = Object.values(message.original_message.icons || {})[0];
      newMessageInThread.text = ':star2: <@' + message.user + '> liked the post :star2:' + t;
      bot.replyInThread(message, newMessageInThread);

      const newMessageUpdated = message.original_message;
      let text = newMessageUpdated.text.split('\n');
      text.pop();
      text.push(':+1: ' + ((newMessageUpdated.reply_count || 0) + 1) + ' likes');
      newMessageUpdated.text = text.join('\n') + t;
      bot.replyInteractive(message, newMessageUpdated);
    }
  });
};
