// import { APIError } from '../helpers/errors';
import Message from '../models/message';

import { paginate } from '../helpers/utils';

import { validatioUserParticipation as validatioUserParticipationChat } from '../services/exchange_match';

const MessageController = {

  /**
   * @swagger
   * /chats/{id}/message:
   *   get:
   *     tags:
   *      - Chat
   *     description: Chat message list
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
  async find(req, res) {
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
