const server = require('./configs/env-configs');
const userRoute = require('./routes/user.route');
const dataRoute = require('./routes/data.route');
const msgRoute = require('./routes/message.route');
const blogRoute = require('./routes/blog.route')
const { USER_PREFIX, DATA_PREFIX, MSG_PREFIX, BLOG_PREFIX } = require('./configs/app-config');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const checkAuthorize = require('./middlewares/auth-token');
const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');

server.config();

admin.initializeApp({
    credential:admin.credential.cert(serviceAccount)
});


server.provider.use(USER_PREFIX, checkAuthorize ,userRoute);
server.provider.use(DATA_PREFIX, dataRoute);
server.provider.use(MSG_PREFIX, checkAuthorize, msgRoute);
server.provider.use(BLOG_PREFIX, checkAuthorize, blogRoute);
server.provider.use(express.static(path.join(__dirname, 'build')));

server.provider.get('/*', (req, res) => {
      res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 8001;

server.provider.listen(PORT, () => {
  console.log(`Server is runnin on PORT ${PORT}`)
})