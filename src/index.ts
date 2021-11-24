import EnvLoader from "./classes/EnvLoader";
EnvLoader.load();

import moment from 'moment-timezone';
moment.locale('id');
moment.tz.setDefault(`Asia/Jakarta`);

import client from './client';
client.login(client.config.token)