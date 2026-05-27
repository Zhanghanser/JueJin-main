const db = require('../db/index')

// 获取用户基本信息的处理函数
exports.getUserInfo = async (req, res) => {
  try {
    const sql = `select id,username, nickname, email, avatar from user where username=? or nickname=?`
    const [results] = await db.promise().query(sql, [req.auth.username, req.auth.username])
    if (results.length !== 1) return res.cc('获取用户信息失败！')
    res.send({
      status: 0,
      message: '获取用户信息成功！',
      data: results[0],
    })
  } catch (err) {
    return res.cc(err)
  }
}
