
var Slack = require ('slack-client');
var CueBot = require('./app');

// var token = 'xoxb-7916142720-gNfXEy3hOIHLUTM3Ol4rUk0e';
var token = 'xoxb-7916142720-fjvl0Auh8m4wpvktynqj0vek';
autoReconnect = true
autoMark = true

var slack = new Slack(token, autoReconnect, autoMark);

var cueBot;

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
  if (typeof cueBot === "undefined") {
    cueBot  = new CueBot(slack);
    cueBot.setAllReminders();
  }
});


slack.on('message', function(message) {
    var channel = slack.getChannelGroupOrDMByID(message.channel);
    var user = slack.getUserByID(message.user);
    if (message.user !== slack.self.id)
    cueBot.handleReq(message, user, channel);
});

slack.on('hello', function(message) {
  debugger;
});

slack.on ('error', function(error) {
  console.error("Error: " + error);
});

slack.login();
