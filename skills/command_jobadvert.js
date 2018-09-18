module.exports = function(controller) {
  const admins = require(__dirname + "/.conf/admins.json");
  const sponsors = require(__dirname + "/.conf/sponsors.json");
  controller.on("slash_command", function(bot, message) {
    var t = ""; //"\nMessage:```" + JSON.stringify(message) + "```";

    if (admins.includes(message.username) < 0) {
      bot.replyPrivate( message, "Only Staff Personell authorized to publish adverts." + t );
      return;
    }

    if (message.command.startsWith("/jobadvert")) {
      const parts = message.text.split("\n").map(l => l.trim()).join("\n").split(" ");
      let sponsorName = parts[0].trim();
      while (sponsorName.startsWith("@")) {
        sponsorName = sponsorName.substring(1);
      }

      const sponsor = sponsors[sponsorName.toLowerCase()];
      if (!!!sponsor) {
        bot.replyPrivate( message, "Unsupported sponsor. Known sponsors are `" + Object.keys(sponsors).join(", ") + "`" + t );
        return;
      }

      const text = parts.slice(1).join(" ").trim() + "\n";
      bot.reply(message, {
        as_user: false,
        username: "Job@" + sponsor.name,
        icon_url: sponsor.logo,
        text: text + t,
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
                url: "slack://user?team=" + message.team_id + "&id=" + sponsor.id
              }
            ]
          }
        ]
      });
      bot.replyPrivate(message, "Published");
    } else {
      bot.replyPrivate(message, "Could not post job advert" + t);
    }
  });

  controller.on("interactive_message_callback", function(bot, message) {
    var t = ''; // "\nMessage:```" + JSON.stringify(message).replace('```', 'code') + "```";
    if (message.callback_id.startsWith("/jobadvert")) {
      
      message.ts = message.message_ts;
      bot.replyInThread(message, ':star2: <@' + message.user + '> liked the post :star2:' + t);

      var newMessage = message.original_message;
      let text = newMessage.text.split('\n');
      text.pop();
      text.push('' + ((newMessage.reply_count || 0) +1) + ' :+1: likes');
      newMessage.text = text.join('\n') + t;
      bot.replyInteractive(message, newMessage);
    }
  });
};
