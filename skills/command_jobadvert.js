module.exports = function(controller) {
  const admins = require(__dirname + '/.conf/admins.json');
  const sponsors = require(__dirname + '/.conf/sponsors.json');
  controller.on("slash_command", function(bot, message) {
    var t = ''; //"\nMessage:```" + JSON.stringify(message) + "```";

    if(admins.includes(message.username) <0){
      bot.replyPrivate(message, "Only Staff Personell authorized to publish adverts." + t);
      return;
    }

    if (message.command.startsWith("/jobadvert")) {
      const parts = message.text.split('\n').join('\n ').split(' ');
      let sponsorName = parts[0].trim();
      while(sponsorName.startsWith('@')){
        sponsorName = sponsorName.substring(1);
      }

      const sponsor = sponsors[sponsorName.toLowerCase()];
      if(!!!sponsor){
        bot.replyPrivate(message, "Unsupported sponsor. Known sponsors are `" + Object.keys(sponsors).join(",") + "`" + t);
        return;
      }

      const text = parts.slice(1).join(' ').trim();

      bot.reply(message, {
        as_user: false,
        username: 'Job@' + sponsor.name,
        icon_url: sponsor.logo,
        text: text + t,
        attachments: [
          {
            text: "Do you like it?",
            attachment_type: "default",
            callback_id: message.command,
            actions: [
              {
                name: "like",
                text: "Like",
                value: "like",
                type: "button",
                style: "primary",
              },
              {
                name: "ask-more",
                text: "Ask More",
                type: "button",
                style: "primary",
                url: "slack://user?team=" + message.team_id + "&id=" + sponsor.id
              }
            ]
          }
        ]
      });
      bot.replyPrivate(message, 'Published');
    } else {
      bot.replyPrivate(message, "Could not post job advert" + t);
    }
  });

  controller.on("interactive_message_callback", function(bot, message) {
    var t = ''; //"\nMessage:```" + JSON.stringify(message).replace('```', 'code') + "```";
    if (message.callback_id.startsWith("/jobadvert")) {
      bot.api.reactions.add(
        {
          timestamp: message.message_ts,
          channel: message.channel,
          name: "+1"
        },
        function(err, res) {
          if (err) {
            bot.botkit.log("Failed to add emoji reaction :(", err);
          }
        }
      );

      var newMessage = message.original_message;
      newMessage.text = newMessage.text + t;
      bot.replyInteractive(message, newMessage);
    }
  });
};
