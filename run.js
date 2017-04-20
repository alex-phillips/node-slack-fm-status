#!/usr/bin/env node
var LastFmNode = require('lastfm').LastFmNode,
  request = require('request');

require('dotenv').config({
  path: `${__dirname}/.env`,
});



let lastfm = new LastFmNode({
  api_key: process.env.LASTFM_KEY,
  secret: process.env.LASTFM_SECRET,
}),
  username = process.argv[2],
  trackstream = lastfm.stream(username);

if (!username) {
  console.log('No username specified');
  process.exit();
}

console.log(`Tracking stream for user ${username}`);
trackstream.on('nowPlaying', function(track) {
  let response = request.post('https://slack.com/api/users.profile.set', {
    form: {
      token: process.env.SLACK_TOKEN,
      profile: JSON.stringify({
        "status_text": `${track.name} - ${track.artist['#text']}`,
        "status_emoji": ':musical_note:',
      })
    }
  }, (err, data, response) => {
    console.log(`Now playing: ${track.name} - ${track.artist['#text']}`);
  });
});

trackstream.on('scrobbled', function(track) {
  console.log('Scrobbled: ' + track.name);
});

trackstream.start();

function exitHandler(options, err) {
  let response = request.post('https://slack.com/api/users.profile.set', {
    form: {
      token: process.env.SLACK_TOKEN,
      profile: JSON.stringify({
        "status_text": `Not currently playing`,
        "status_emoji": ':musical_note:',
      })
    }
  }, (err, data, response) => {
    process.exit();
  });
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));
//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
