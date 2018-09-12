/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var env = require('node-env-file');
env(__dirname + '/.env');

function usage_tip() {
  console.log('~~~~~~~~~~');
  console.log('Botkit Starter Kit');
  console.log('Execute your bot application like this:');
  console.log('clientId=<MY SLACK CLIENT ID> clientSecret=<MY CLIENT SECRET> PORT=3000 node bot.js');
  console.log('Get Slack app credentials here: https://api.slack.com/apps')
  console.log('~~~~~~~~~~');
}

if (!process.env.clientId || !process.env.clientSecret || !process.env.PORT) {
  usage_tip();
  process.exit(1);
}

const isInLambda = !!process.env.LAMBDA_TASK_ROOT;
const isInServerless = !!process.env.OFFLINE_LAMBDA_TASK_ROOT || isInLambda;

var Botkit = require('botkit');
var debug = require('debug')('botkit:main');

var bot_options = {
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    // debug: true,
    scopes: ['bot'],
};

const admin = require('firebase-admin');
var serviceAccount = require(process.env.FIREBASE_URI);
if(!!!process.env.FIREBASE_INITIALIZED){
  admin.initializeApp({credential: admin.credential.cert(serviceAccount)});
  process.env.FIREBASE_INITIALIZED = true;
}
var db = admin.firestore();

var firebaseStorage = require('botkit-storage-firestore')({database: db}),
    // Create the Botkit controller, which controls all instances of the bot.
    controller = Botkit.slackbot({
        debug: true || process.env.DEBUG == 'true',
        require_delivery: true,
        rtm_receive_messages: false,
        send_via_rtm: false,
        retry: 5,
        stale_connection_timeout: 500,
        interactive_replies: true,
        storage: firebaseStorage
    });

controller.startTicking();

// Set up an Express-powered webserver to expose oauth and webhook endpoints
var webserver = require(__dirname + '/components/express_webserver.js')(controller);

webserver.get('/', function(req, res){
  res.render('index', {
    domain: req.get('host'),
    protocol: req.protocol,
    layout: 'layouts/default'
  });
})
// Set up a simple storage backend for keeping a record of customers
// who sign up for the app via the oauth
require(__dirname + '/components/user_registration.js')(controller);

// Send an onboarding message when a new team joins
require(__dirname + '/components/onboarding.js')(controller);

var normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require("./skills/" + file)(controller);
});

webserver.locals['AWS_STAGE_URL_PREFIX'] = isInLambda ? process.env.AWS_STAGE_URL_PREFIX : '';

const port = process.env.PORT || 3000;
if (isInServerless) {
    const serverlessExpress = require('aws-serverless-express');
    const server = serverlessExpress.createServer(webserver);
    module.exports.handler = (event, context) => serverlessExpress.proxy(server, event, context)
} else {
    var http = require('http');
    const server = http.createServer(webserver);
    controller.httpserver = server;
    server.listen(port, null, function() {
        console.log('Express webserver configured and listening at http://localhost:' + port);
    });
}
