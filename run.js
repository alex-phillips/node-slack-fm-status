#!/usr/bin/env node
var LastfmAPI = require('lastfmapi'),
  request = require('request-promise-native');

require('dotenv').config({
  path: `${__dirname}/.env`,
});

let lastfm = new LastfmAPI({
  api_key: process.env.LASTFM_KEY,
  secret: process.env.LASTFM_SECRET,
}),
  username = process.argv[2],
  currentTracks = [];

if (!username) {
  console.log('No username specified');
  process.exit();
}

run();
let getRecentInterval = setInterval(run, 10000);

function run() {
  lastfm.user.getRecentTracks({
    // limit: 1,
    user: username,
  }, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    let track = data.track[0],
      info = `${track.name} - ${track.artist['#text']}`;
    if (currentTracks.includes(info)) {
      return;
    }

    currentTracks.unshift(info);
    if (currentTracks.length > 2) {
      currentTracks.pop();
    }

    currentTrack = info;

    Promise.all(process.env.SLACK_TOKEN.split(',').map(token => {
      return request.post('https://slack.com/api/users.profile.set', {
        form: {
          token: token,
          profile: JSON.stringify({
            "status_text": info,
            "status_emoji": ':musical_note:',
          })
        }
      });
    }))
    .then(() => {
      console.log(`Now playing: ${info}`);
    });
  });
}

function exitHandler(options, err) {
  if (err) {
    console.log(err);
  }

  console.log('Exiting...');
   Promise.all(process.env.SLACK_TOKEN.split(',').map(token => {
    return request.post('https://slack.com/api/users.profile.set', {
      form: {
        token: process.env.SLACK_TOKEN,
        profile: JSON.stringify({
          "status_text": ``,
          "status_emoji": '',
        })
      }
    });
  }))
  .then(() => {
    process.exit();
  });
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));
//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
