/* eslint-env node */
/*
 * @license
 * Your First PWA Codelab (https://g.co/codelabs/pwa)
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License
 */
'use strict';

const express = require('express');
const fetch = require('node-fetch');
var fs = require('fs');
var https = require('https');
var proxy = require('http-proxy-middleware');
const axios = require('axios');
var subscription ='test push';

require('dotenv').config({ path: 'variables.env' });

const webPush = require('web-push');
const bodyParser = require('body-parser');

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
const PC_IP = process.env.PC_IP;

webPush.setVapidDetails('mailto:abhinav.kareer@nutanix.com', publicVapidKey, privateVapidKey);

// const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;

// CODELAB: Change this to add a delay (ms) before the server responds.
const PollAlerts = 5000;

/**
 * Starts the Express server.
 *
 * @return {ExpressServer} instance of the Express server.
 */
function startServer() {
  const app = express();
  const port = process.env.port || 80;

  // app.use(bodyParser.json());
  // app.use(poller);

  // Redirect HTTP to HTTPS,
  //  app.use(redirectToHTTPS([/localhost:(\d{4})/], [], 301));

   app.use(
    '/api',
    proxy({ target: 'https://'+PC_IP,
    changeOrigin: true,
    secure:false,
    logLevel:'debug'
   })
  );


  // Logging for each request
  app.use((req, resp, next) => {
    const now = new Date();
    const time = `${now.toLocaleDateString()} - ${now.toLocaleTimeString()}`;
    const path = `"${req.method} ${req.path}"`;
    const m = `${req.ip} - ${time} - ${path}`;
    // eslint-disable-next-line no-console
    console.log(m);
    next();
  });
  app.post('/subscribe', (req, res) => {
    subscription = req.body
    console.log("A new subscription");
    res.status(201).json({});

    const payload = JSON.stringify({
      title: 'Push notifications with Service Workers',
    });

    webPush.sendNotification(subscription, payload)
      .catch(error => console.error(error));
  });

  // Handle requests for static files
  app.use(express.static('public'));

  // Start the server
  // return   https.createServer({
  //   key: fs.readFileSync('server.key'),
  //   cert: fs.readFileSync('server.cert')
  // }, app).listen(port, () => {
  //   // eslint-disable-next-line no-console
  //   console.log('Local DevServer Started on port :'+port);
  // });

  return app.listen(port, () => {
    getAlerts();
    // eslint-disable-next-line no-console
    console.log('Local DevServer Started on port '+port);
  });

}


const POLLING_INTERVAL_SECS = 30;



const attrs ={"entity_type":"alert","grouping_attribute":"severity","group_member_count":10,"group_member_sort_order":"DESCENDING","group_member_attributes":[{"attribute":"title"},{"attribute":"default_message"},{"attribute":"severity"},{"attribute":"param_name_list"},{"attribute":"param_value_list"}],"query_name":"prism:GroupByQueryModel","filter_criteria":"resolved==false"};
const url ="https://"+PC_IP+"/api/nutanix/v3/groups";
const username = "admin";
const password = "Nutanix.123";

const payload = JSON.stringify({
  title: 'Push notifications with Service Workers',
});
// At instance level
const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});
instance.get('*');

// At request level
const agent = new https.Agent({  
  rejectUnauthorized: false
});

console.log('Initiating Poller');
setInterval(() => {
  getAlerts();
}, POLLING_INTERVAL_SECS * 1000);


function getAlerts() {
  axios({
    method: 'post',
    url,
    data: attrs,
    auth: {
      username: username,
      password: password
  },
  httpsAgent: agent
  }).then(response => {
    try {
      webPush.sendNotification(subscription, payload)
      .catch(error => console.error(error));
    } catch (error) {
      console.log(error);
    }
    console.log('Data Fetch Complete!');
  })
  .catch(error => {
    console.log("Error:", error);
  });
}

startServer();



