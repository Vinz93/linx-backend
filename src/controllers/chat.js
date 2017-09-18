// import { APIError } from '../helpers/errors';
import Promise from 'bluebird';

import { paginate } from '../helpers/utils';

import { validatioUserParticipation as validatioUserParticipationChat } from '../services/exchange_match';

import ExchangeMatch from '../models/exchange_match';
import Exchange from '../models/exchange';
import Message from '../models/message';

const MessageController = {

  /**
 * @swagger
 * /chats:
 *   get:
 *     tags:
 *      - Chat
 *     description: Chats list
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         description: format 'JWT your-token'.
 *         in: header
 *         required: true
 *         type: string
 *       - name: page
 *         description: Page number
 *         in: query
 *         required: false
 *         type: integer
 *       - name: limit
 *         description: Maximum number of objects per page
 *         in: query
 *         required: false
 *         type: integer
 *     responses:
 *       200:
 *         description: list of chats
 *         schema:
 *          type: object
 *          properties:
 *            docs:
 *             type: array
 *             items:
 *              $ref: '#/definitions/Chat'
 */
  async find(req, res) {
    const { id: userId } = req.user;
    const exchanges = await Exchange.find({ user: userId, isActive: true });
    const exchangesId = exchanges.map(e => e.id);
    const find = {
      status: 'active',
      $or: [
        { requested: { $in: exchangesId } },
        { requester: { $in: exchangesId } },
      ],
    };
    const options = {
      populate: [{
        path: 'requester',
        select: 'user',
        populate: {
          path: 'user',
        },
      }, {
        path: 'requested',
        select: 'user',
        populate: {
          path: 'user',
        },
      }],
    };
    const exchangesMatch = await ExchangeMatch.paginate(find, options);
    exchangesMatch.docs = await Promise.map(exchangesMatch.docs, async e => {
      const { id, createdAt, updatedAt, requested, requester, status } = e;
      const lastMessage = await Message.find({ chat: id }).sort('-createdAt');
      const result = {
        id,
        createdAt,
        updatedAt,
        status,
        lastMessage: lastMessage[0].createdAt,
      };
      const requestedUser = requested.user;
      const requesterUser = requester.user;
      if (requestedUser.id !== userId) {
        result.user = requestedUser;
      } else {
        result.user = requesterUser;
      }
      return result;
    });
    return res.json(exchangesMatch);
  },

  /**
   * @swagger
   * /chats/{id}/message:
   *   get:
   *     tags:
   *      - Chat
   *     description: Chat messages list
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         description: format 'JWT your-token'.
   *         in: header
   *         required: true
   *         type: string
   *       - name: id
   *         in: path
   *         required: true
   *         description: exchange match id
   *         type: string
   *       - name: page
   *         description: Page number
   *         in: query
   *         required: false
   *         type: integer
   *       - name: limit
   *         description: Maximum number of objects per page
   *         in: query
   *         required: false
   *         type: integer
   *     responses:
   *       200:
   *         description: list of messages
   *         schema:
   *          type: object
   *          properties:
   *            docs:
   *             type: array
   *             items:
   *              $ref: '#/definitions/ReqMessage'
   */
  async findMessage(req, res) {
    const { id: chatId } = req.params;
    const { page, limit } = req.query;
    await validatioUserParticipationChat(chatId, req.user.id);
    const find = {
      chat: chatId,
    };
    const options = {
      sort: { createdAt: -1 },
    };
    if (page || limit) {
      options.page = paginate.offset(page);
      options.limit = paginate.limit(limit);
    }
    const messages = await Message.paginate(find, options);
    return res.json(messages);
  },
};

export default MessageController;
