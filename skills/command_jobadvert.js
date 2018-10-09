module.exports = function(controller) {

  const admins = require(__dirname + "/.conf/admins.json");
  const sponsors = require(__dirname + "/.conf/sponsors.json");
  
  controller.on("slash_command", function(bot, message) {
    
    let sponsor = message.user
    
    if (sponsors.indexOf(sponsor) < 0) {
      bot.replyPrivate(message, "Sorry, only sponsors can publish job ads. Your message will be deleted.");
      
      
      bot.api.chat.delete({token: message.token, ts: message.ts, channel: message.channel}, function(err, res) {
        if (err) {
          bot.botkit.log('chat.delete error: ', err);
        }
      });
      
      return;
    }   
  });
}
