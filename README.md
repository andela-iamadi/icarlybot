# icarlybot

INTRODUCTION

CueBot is a Bot designed to act as task reminder over the popular Slack messenger app. CueBot allows users create a list of tasks, specifying when each task is due and when they'd want the reminder sent. Promptly at the due time, CueBot sends the reminder to the person, group or channel, depending on the user's choice.

Architectural Overview

CueBot is itself based on Node Slack Client, a library built to abstract out the low-level details of interactions between the Bot and Slack API, so that a developer can delve directly into building whatever functionality is required, already armed with functions for most basic operations.

Since there is very little documentation available for Node Slack Client, I had to go through the Library in details and have written out a mock documentation available here to help you get started if you choose at any time to use the Library.

CueBot listens for direct messages or mentions in groups or channels in conversations on Slack, processes this information to something the API would understand, then sends the processed message to a backend API that acts on it appropriately and sends a response back.

Depending on the feedback, CueBot kicks off a reminder countdown.

What we need

From the overview, we obviously need Node Slack Client. Download it here if you've not already done so. We also need an API to help us persist tasks in a database.

For this purpose, I chose to build my API using Ruby on Rails, persisting with PostgreSQL database. Feel free to use any language or framework of your choice. However, if you would also like to build your API with Rails too, I wrote a walk-through here to assist you with that.

Bulding CueBot

STEP 1: Register a Bot on Slack

This is a quite easy step. visit <a href="http://api.slack.com">Slack API</a> [get the steps]

STEP 2: Set up Node Slack-Client to interact with your newly created Bot.

Clone this project here so that your environment is set up as required by Slack-Client.

Open the index.js file and require Slack Client
`
var Slack = require ('slack-client');
`

Now create an instance of the Slack-Client class.
`
var token = 'xoxb-YOUR-SUPER-SECRET-TOKEN-HERE';
autoReconnect = true
autoMark = true

var slack = new Slack(token, autoReconnect, autoMark);
`

To connect, Slack requires the token is provided. This is the same token you obtained from Slack when you registered the bot.
The autoReconnect and autoMark options are optional on Slack-Client as they default to true and false respectively. [check meaning of autoMark].

At this point we would want to attempt to login with our bot. this is as easy as calling the login method.

`
slack.login();
`

However, before you launch a login attempt, you might want to listen for a successful login attempt, and then do or log something that just tells you how things progressed. Modifying this blog's [check for blog owner] idea, I settled for this function;

`
slack.on('open', function () {

  var channels = Object.keys(slack.channels)
      .map(function (k) { return slack.channels[k]; })
      .filter(function (c) { return c.is_member; })
      .map(function (c) { return c.name; });

  var groups = Object.keys(slack.groups)
      .map(function (k) { return slack.groups[k]; })
      .filter(function (g) { return g.is_open && !g.is_archived; })
      .map(function (g) { return g.name; });
  console.log('Welcome to Slack. You are ' + slack.self.name + ' of ' + slack.team.name);

  if (channels.length > 0) {
      console.log('You are in: ' + channels.join(', '));
  }
  else {
      console.log('You are not in any channels.');
  }

  if (groups.length > 0) {
     console.log('As well as: ' + groups.join(', '));
  }
});
`

This function just listens for a successful open connection, then gets all channels and groups our bot is registered to. It then logs them including the name of the team (Did I mention? You have to be on a team to be on slack).


Next we would like to listen for messages sent to channels, groups CueBot belongs possible direct messages, so we could choose to discard or do some other cool stuff. Our function should look like this:

`
slack.on('message', function(message) {
    var channel = slack.getChannelGroupOrDMByID(message.channel);
    var user = slack.getUserByID(message.user);

    // Do awesome stuffs with CueBot when appropriate
		// message comes
});
`
With this function, we get the channel the message was sent and the user that sent the message. Notice the cool ways Slack-Client allows us to interact with Slack. Other methods available are explained here if you'd like further reading on Slack-Client before moving further.


Now we are checking for successful login and messages. We are good to go right? Wrong. Trust me, you do not want to launch your Bot without checking for errors. You could end up pulling your hair out when you have no idea where a bug could be.

`
slack.on ('error', function(error) {
  console.error("Error: " + error);
});
`

<<<Back to CueBot

Having set up CueBot to work with Slack, we can now go into building the reminder engine.

Create another folder in the same CueBot folder and name it app. In the newly created app folder, create four more folders: controllers, helpers, services and shared. Then create a file named index.js in the same app folder.

As you may have guessed, all controllers, services, helpers and shared methods are to be required in the index.js file so we can export our app as a single class.


By now Your directory structure should look like this:
