import config from '../config/env';
import apn from 'apn';
import GCM from 'node-gcm';
const { gcmconfig } = config.pushnotifications;
const { apnconfig } = config.pushnotifications;
const sender = new GCM.Sender(gcmconfig);
const apnProvider = new apn.Provider(apnconfig);
const note = new apn.Notification();

export async function contactExchanger(selectedCurrencies, requester, requestedToken, deviceRequested) {
  const title = `${requester.firstName} ${requester.lastName} is interested in exchanging ${selectedCurrencies[0]} and ...`;
  // APN CONFIG
  note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
  note.sound = 'ping.aiff';
  note.alert = title;
  // END APN CONFIG
  const message = new GCM.Message({
    data: {
      message: title,
      requester,
      selectedCurrencies,
    },
  });
  if (deviceRequested === "ios") {
    apnProvider.send(note, requestedToken).then((result) => {
  // see documentation for an explanation of result
      console.info(result.failed[0].response);
    });
  } else {
    sender.send(message, { registrationTokens: requestedToken });
  }
}

/*  export async function notifySuccessRequester(requested, requesterToken) {
}*/
