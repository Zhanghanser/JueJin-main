const db = require('../db')

exports.getAddView = async (req, res) => {
  try {
    let { id } = req.query
    const sql = 'update article set view_num=view_num+1 where id =?'
    await db.promise().query(sql, [id])
    res.cc('浏览量添加成功！', 0)
  } catch (err) {
    return res.cc(err)
  }
}

exports.getIsLike = async (req, res) => {
  try {
    let { typeId, userId, contentId } = req.query
    const sql = 'select * from `like` WHERE type_id=? and user_id=? and content_id=?'
    const [results] = await db.promise().query(sql, [typeId, userId, contentId])
    res.send({
      status: 0,
      data: results.length > 0
    })
  } catch (err) {
    return res.cc(err)
  }
}

exports.getAddLike = async (req, res) => {
  try {
    let { typeId, userId, contentId } = req.query
    const sql = 'insert into `like` (user_id,content_id,type_id) value(?,?,?)'
    const [results] = await db.promise().query(sql, [userId, contentId, typeId])
    if (results.affectedRows !== 1) return res.cc('添加点赞失败！', 0)
    if (typeId == 0) {
      const sql2 = 'update article set like_num=like_num+1 WHERE id =?'
      const [updResult] = await db.promise().query(sql2, [contentId])
      if (updResult.affectedRows !== 1) return res.cc('添加点赞失败！', 0)
    }
    res.send({
      status: 0,
      message: '添加点赞成功！'
    })
  } catch (err) {
    return res.cc(err)
  }
}

exports.getDeleteLike = async (req, res) => {
  try {
    let { typeId, userId, contentId } = req.query
    const sql = 'delete from `like` where type_id=? and user_id=? and content_id=?'
    const [results] = await db.promise().query(sql, [typeId, userId, contentId])
    if (results.affectedRows !== 1) return res.cc('取消点赞失败！', 0)
    if (typeId == 0) {
      const sql2 = 'update article set like_num=like_num-1 WHERE id =?'
      const [updResult] = await db.promise().query(sql2, [contentId])
      if (updResult.affectedRows !== 1) return res.cc('取消点赞失败！', 0)
    }
    res.send({
      status: 0,
      message: '取消点赞成功！'
    })
  } catch (err) {
    return res.cc(err)
  }
}

exports.getIsStar = async (req, res) => {
  try {
    let { articleId, userId } = req.query
    const sql = 'select * from star WHERE user_id=? and article_id=?'
    const [results] = await db.promise().query(sql, [userId, articleId])
    res.send({
      status: 0,
      data: results.length > 0
    })
  } catch (err) {
    return res.cc(err)
  }
}

exports.getAddStar = async (req, res) => {
  try {
    let { articleId, userId } = req.query
    const sql = 'insert into star (user_id,article_id) value(?,?)'
    const [results] = await db.promise().query(sql, [userId, articleId])
    if (results.affectedRows !== 1) return res.cc('收藏失败！', 0)
    const sql2 = 'update article set star_num=star_num+1 WHERE id =?'
    const [updResult] = await db.promise().query(sql2, [articleId])
    if (updResult.affectedRows !== 1) return res.cc('添加点赞失败！', 0)
    res.send({
      status: 0,
      message: '收藏成功！'
    })
  } catch (err) {
    return res.cc(err)
  }
}

exports.getDeleteStar = async (req, res) => {
  try {
    let { articleId, userId } = req.query
    const sql = 'delete from star where user_id=? and article_id=?'
    const [results] = await db.promise().query(sql, [userId, articleId])
    if (results.affectedRows !== 1) return res.cc('取消收藏失败！', 0)
    const sql2 = 'update article set star_num=star_num-1 WHERE id =?'
    const [updResult] = await db.promise().query(sql2, [articleId])
    if (updResult.affectedRows !== 1) return res.cc('取消点赞失败！', 0)
    res.send({
      status: 0,
      message: '取消收藏成功！'
    })
  } catch (err) {
    return res.cc(err)
  }
}

exports.getIsFollow = async (req, res) => {
  try {
    let { userId, followedUserId } = req.query
    const sql = 'select * from follow WHERE user_id=? and followed_user_id=?'
    const [results] = await db.promise().query(sql, [userId, followedUserId])
    res.send({
      status: 0,
      data: results.length > 0
    })
  } catch (err) {
    return res.cc(err)
  }
}

exports.getAddFollow = async (req, res) => {
  try {
    let { userId, followedUserId } = req.query
    const sql = 'insert into follow (user_id,followed_user_id) value(?,?)'
    const [results] = await db.promise().query(sql, [userId, followedUserId])
    if (results.affectedRows !== 1) return res.cc('关注失败！', 0)
    res.send({
      status: 0,
      message: '关注成功！'
    })
  } catch (err) {
    return res.cc(err)
  }
}

exports.getDeleteFollow = async (req, res) => {
  try {
    let { userId, followedUserId } = req.query
    const sql = 'delete from follow where user_id=? and followed_user_id=?'
    const [results] = await db.promise().query(sql, [userId, followedUserId])
    if (results.affectedRows !== 1) return res.cc('取消关注失败！', 0)
    res.send({
      status: 0,
      message: '取消关注成功！'
    })
  } catch (err) {
    return res.cc(err)
  }
}

exports.getFollowListByUserId = async (req, res) => {
  try {
    let { userId } = req.query
    const sql = 'select followed_user_id from follow WHERE user_id=?'
    const [results] = await db.promise().query(sql, [userId])
    res.send({
      status: 0,
      data: results
    })
  } catch (err) {
    return res.cc(err)
  }
}

exports.getFollowedListByUserId = async (req, res) => {
  try {
    let { userId } = req.query
    const sql = 'select user_id from follow WHERE followed_user_id=?'
    const [results] = await db.promise().query(sql, [userId])
    res.send({
      status: 0,
      data: results
    })
  } catch (err) {
    return res.cc(err)
  }
}
