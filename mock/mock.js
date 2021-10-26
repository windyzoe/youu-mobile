// https://github.com/jaywcjlove/mocker-api
const mock = {
  // 本地mock示例
  'GET /api/user': {
    id: 1,
    username: 'kenny',
    sex: 6,
  },
  'POST /api/login': (req, res) => {
    const { password, username } = req.body;
    if (password === '888888' && username === 'admin') {
      return res.json({
        status: 'ok',
        code: 0,
        token: 'sdfsdfsdfdsf',
        data: {
          id: 1,
          username: 'kenny',
          sex: 6,
        },
      });
    } else {
      return res.status(403).json({
        status: 'error',
        code: 403,
      });
    }
  },
  'POST /api/logout': (req, res) => {
    return res.json({
      status: 'ok1',
      code: 0,
    });
  },
  'POST /api/user/userList': (req, res) => {
    const { pageIndex, pageSize, keyWord } = req.body;
    if (pageIndex && pageSize) {
      return res.json({
        code: 0,
        data: { user: [] },
        path: req.params[0],
      });
    } else {
      return res.status(403).json({
        status: 'error',
        code: 403,
      });
    }
  },
};

module.exports = mock;
