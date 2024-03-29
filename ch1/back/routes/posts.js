const express = require('express');
const multer = require('multer');
const path = require('path'); // path 모듈 노드 기본 제공

const db = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', async (req, res, next) => {
  // GET /posts?offset=10&limit=10
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
