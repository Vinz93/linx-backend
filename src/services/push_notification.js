import GCM from 'node-gcm';
import config from '../config/env';
const { apiKeyGcm } = config.pushnotifications;

const sender = new GCM.Sender(apiKeyGcm);

export async function contactExchanger(selectedCurrencies, requester, requestedToken) {
  const message = new GCM.Message({
    data: {
      message: `${requester.firstName} ${requester.lastName} is interested in exchanging ${selectedCurrencies[0]} and ...`,
      requester,
      selectedCurrencies,
    },
  });

  return await sender.send(message, { registrationTokens: requestedToken });
}

export async function notifySuccessRequester(requested, requesterToken) {
  const message = new GCM.Message({
    data: {
      message: `${requested.firstName} ${requested.lastName} has accepted your invitation to exchange`,
    },
  });

  return await sender.send(message, { registrationTokens: requesterToken });
}
