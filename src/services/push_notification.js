import config from '../config/env';
import apn from 'apn';
import GCM from 'node-gcm';
const { gcmconfig } = config.pushnotifications;
const { apnconfig } = config.pushnotifications;
const sender = new GCM.Sender(gcmconfig);
const note = new apn.Notification();

export async function contact(pushData, requestedToken, deviceRequested, message, pushType) {
  // APN CONFIG
  const apnProvider = new apn.Provider(apnconfig);
  note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
  note.sound = 'ping.aiff';
  note.alert = message;
  note.payload = { ...pushData, pushType };
  note.topic = "com.solsteace.linxios";

  // END APN CONFIG
  if (deviceRequested === "ios") {
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

