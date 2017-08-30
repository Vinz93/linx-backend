import config from '../config/env';
import apn from 'apn';
const { apnconfig } = config.pushnotifications;
const apnProvider = new apn.Provider(apnconfig);


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

  apnProvider.send(note, requestedToken).then((result) => {
  // see documentation for an explanation of result
    console.info(result.failed[0].response);
  });
}

export async function notifySuccessRequester(requested, requesterToken) {
  // hola
}
