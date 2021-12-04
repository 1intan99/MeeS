import moment from 'moment-timezone';
moment.locale('id');
moment.tz.setDefault(`Asia/Jakarta`);

import client from './client';
client.mongo.connect();
client.login(client.config.token)