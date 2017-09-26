import apn from 'apn';
import GCM from 'node-gcm';
import httpStatus from 'http-status';
import { APIError } from '../helpers/errors';
import config from '../config/env';

const { gcmconfig, apnconfig } = config.pushnotifications;
const apnProvider = new apn.Provider(apnconfig);
const sender = new GCM.Sender(gcmconfig);

export async function contact(pushData, requestedToken, deviceRequested, message, pushType) {
  if (!requestedToken) {
    throw new APIError('deviceToken match not found', httpStatus.NOT_FOUND);
  }
  if (!deviceRequested) {
    throw new APIError('deviceType match not found', httpStatus.NOT_FOUND);
  }

  if (deviceRequested === "ios") {
    // APN CONFIG
    const note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.sound = 'ping.aiff';
    note.alert = message;
    note.payload = { ...pushData, pushType };
    note.topic = "com.solsteace.linxios";
    // END APN CONFIG
    console.info('requestedToken: ', requestedToken, JSON.stringify(note));
    const apnpush = await apnProvider.send(note, requestedToken);
    return apnpush;
  }
  const gcmmessage = new GCM.Message({
    data: {
      message,
      pushData,
    },
  });
  const gcmpush = await sender.send(gcmmessage, { registrationTokens: requestedToken });
  return gcmpush;
}

