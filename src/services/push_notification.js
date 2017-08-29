import config from '../config/env';
import apn from 'apn';
const pushNotif = config.pushnotifications;
console.info(pushNotif);
const apnProvider = new apn.Provider(pushNotif);


export async function contactExchanger(selectedCurrencies, requester, requestedToken) {
  // const message = new GCM.Message({
  //   data: {
  //     message: `${requester.firstName} ${requester.lastName} is interested in exchanging ${selectedCurrencies[0]} and ...`,
  //     requester,
  //     selectedCurrencies,
  //   },
  const note = new apn.Notification();

  note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
  note.badge = 3;
  note.sound = 'ping.aiff';
  note.alert = `${requester.firstName} ${requester.lastName} is interested in exchanging ${selectedCurrencies[0]} and ...`;
  note.payload = { messageFrom: 'John Appleseed' };
  note.topic = '<your-app-bundle-id>';

  apnProvider.send(note, requestedToken).then((result) => {
  // see documentation for an explanation of result
    console.info(result);
  });
}

export async function notifySuccessRequester(requested, requesterToken) {
  // hola
}
