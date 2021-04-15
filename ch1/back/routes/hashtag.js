const express = require('express');

const db = require('../models');

const router = express.Router();

router.get('/:tag', async (req, res, next) => {
  // GET /hashtag/:tag?lastId=10&limit=10
  try {
    let where = {};
    if (parseInt(req.query.listId, 10)) {
      where = {
        id: {
          [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10), // less than
        },
      };
    }
    const posts = await db.Post.findAll({
      where,
      include: [
        {
          model: db.Hashtag,
          where: { name: decodeURIComponent(req.params.tag) }, //한글일 수 있어서
        },
        {
          model: db.User,
          attributes: ['id', 'nickname'],
        },
        {
          model: db.Image,
        },
        {
          model: db.User,
          as: 'Likers',
          attributes: ['id'],
        },
        {
          model: db.Post,
          as: 'Retweet',
          include: [
            {
              model: db.User,
              attributes: ['id', 'nickname'],
            },
            {
              model: db.Image,
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
      // 실무에서는 offset과 limit을 안쓴다.
      limit: parseInt(req.query.limit, 10) || 10,
    });
    return res.json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
