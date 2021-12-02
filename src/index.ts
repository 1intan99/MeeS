import EnvLoader from "./classes/EnvLoader";
EnvLoader.load();

import moment from 'moment-timezone';
moment.locale('id');
moment.tz.setDefault(`Asia/Jakarta`);

import client from './client';
/** Music Dashboard Coming Soon */
// import Logger from "./classes/Logger";
// client.http.listen(3000, () => {
//     Logger.log("SUCCESS", `Web Server has been started!`);
// });
client.mongo.connect();
client.login(client.config.token)