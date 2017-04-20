# Slack Status Updater (Last.fm)

This app, while running, will update your Slack user status with what is currently playing on the specified Last.fm user. When the app exists, the status will change to 'No Currently Playing'.

### Install



```
git clone https://github.com/alex-phillips/node-slack-fm-status
cd node-slack-fm-status
npm install
```

Once cloned, simply copy the `.env.example` file and fill in the necessary credentials. Then just run `run.js` with your Last.fm username:

```
node run.js LASTFM_USERNAME
```
