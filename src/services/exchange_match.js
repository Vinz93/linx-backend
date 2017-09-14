
import ExchangeMatch from '../models/exchange_match';

export async function validatioUserParticipation(exchangeMatchId, userId) {
  const exchangeMatch = await ExchangeMatch.findOne({
    _id: exchangeMatchId,
  }).populate({
    path: 'requester',
    select: 'user',
    populate: {
      path: 'user',
      select: 'id',
    },
  })
    .populate({
      path: 'requested',
      select: 'user',
      populate: {
        path: 'user',
        select: 'id',
      },
    });
  if (!exchangeMatch) {
    throw new Error('Invalid chat id');
  }
  const { requester, requested } = exchangeMatch;

  if (!requester.user._id.equals(userId) && !requested.user._id.equals(userId)) {
    throw new Error('Not authorized');
  }
  return;
}
