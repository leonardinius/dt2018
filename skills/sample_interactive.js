module.exports = function(controller) {
  controller.hears("interactive", "direct_message", function(bot, message) {
    bot.reply(message, {
      attachments: [
        {
          title: "Do you want to interact with my buttons?",
          callback_id: "123",
          attachment_type: "default",
          actions: [
            {
              name: "yes",
              text: "Yes",
              value: "yes",
              type: "button"
            },
            {
              name: "no",
              text: "No",
              value: "no",
              type: "button"
            }
          ]
        }
      ]
    });
  });

  controller.on("interactive_message_callback", function(bot, message) {
    // check message.actions and message.callback_id to see what action to take...
    bot.replyInteractive(message, {
      text: "...",
      attachments: [
        {
          title: "My buttons",
          callback_id: "123",
          attachment_type: "default",
          actions: [
            {
              name: "yes",
              text: "Yes!",
              value: "yes",
              type: "button"
            },
            {
              text: "No!",
              name: "no",
              value: "delete",
              style: "danger",
              type: "button",
              confirm: {
                title: "Are you sure?",
                text: "This will do something!",
                ok_text: "Yes",
                dismiss_text: "No"
              }
            }
          ]
        }
      ]
    });
  });
};
