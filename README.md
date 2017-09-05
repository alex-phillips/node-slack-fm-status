# Slack Status Updater (Last.fm)

This app, while running, will update your Slack user status with what is currently playing on the specified Last.fm user. When the app exists, the status will change to 'No Currently Playing'.

### Install

```
git clone https://github.com/alex-phillips/node-slack-fm-status
cd node-slack-fm-status
npm install
cp .env.example .env
```

Once cloned, [get your Last.fm API credentials here](https://www.last.fm/api/account/create) and [obtain a Slack authentication token here](https://api.slack.com/custom-integrations/legacy-tokens). 

Open up `.env` and fill in your Last.fm and Slack credentials. Then, run `run.js` with your Last.fm username:

```
node run.js LASTFM_USERNAME
```
