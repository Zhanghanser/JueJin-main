const db = require('../db')

exports.getType = async (req, res) => {
  try {
    const sql = `select * from article_type WHERE path is NOT NULL`
    const [results] = await db.promise().query(sql)
    if (results.length === 0) return res.cc('获取文章分类失败！')
    res.send({
      status: 0,
      message: '获取文章分类成功！',
      data: results
    })
  } catch (err) {
    return res.cc(err)
  }
}

exports.getTag = async (req, res) => {
  try {
    const sql = `select * from tag`
    const [results] = await db.promise().query(sql)
    if (results.length === 0) return res.cc('获取标签失败！')
    res.send({
      status: 0,
      message: '获取标签成功！',
      data: results
    })
  } catch (err) {
    return res.cc(err)
  }
}

exports.getArticleList = async (req, res) => {
  try {
    /**
     * page
     * limit
     * type
     * recommendType 0表示推荐，1表示最新
     */
    let { page, limit, type, recommendType } = req.query
    page = Number(page) || 1
    limit = Number(limit) || 10

    let sql = `select article.id,user.nickname,user.username,title,content,cover,name AS 'article_type',view_num,like_num,article.create_time,user.id AS user_id from article
  inner join article_type on article.type_id=article_type.id
  inner join user on article.user_id=user.id
  where status=1 `
    let params = []

    if (type) {
      sql += `and path=? `
      params.push(type)
    }

    sql +=
      recommendType == 0
        ? 'ORDER BY view_num DESC,like_num DESC'
        : 'ORDER BY article.create_time DESC'

    sql += `\nlimit ? offset ?`
    params.push(limit, (page - 1) * limit)

    let randomSortSql = `SELECT * FROM (${sql}) AS sorted_data ORDER BY RAND();`
    const [results] = await db.promise().query(randomSortSql, params)
    if (results.length === 0) return res.cc('没有更多了！', 0)
    res.send({
      status: 0,
      message: '获取文章成功！',
      data: results
    })
  } catch (err) {
    return res.cc(err)
  }
}

exports.getArticleTags = async (req, res) => {
  try {
    let { id } = req.query

    let sql = `SELECT tag_id,tag_name FROM article_tag_merge
      INNER JOIN tag ON article_tag_merge.tag_id = tag.id 
      WHERE article_id = ?`
    const [results] = await db.promise().query(sql, [id])
    if (results.length === 0) return res.cc('文章不存在！', 0)
    res.send({
      status: 0,
      message: '获取文章标签成功！',
      data: results
    })
  } catch (err) {
    return res.cc(err)
  }
}

exports.getArticleDetail = async (req, res) => {
  try {
    let { id } = req.query

    let sql = `SELECT
      article.id,
      article.user_id,
      user.nickname,
      user.username,
      user.avatar,
      title,
      content,
      cover,
      type_id,
      article_type.name AS article_type,
      view_num,
      like_num,
      star_num,
      article.create_time,
      status,
      path
    FROM
      article
      INNER JOIN article_type ON article.type_id = article_type.id
      INNER JOIN user ON article.user_id = user.id 
    WHERE
      article.id=?`
    const [results] = await db.promise().query(sql, [id])
    if (results.length === 0) return res.cc('文章不存在！', 0)
    res.send({
      status: 0,
      message: '获取文章详情成功！',
      data: results[0]
    })
  } catch (err) {
    return res.cc(err)
  }
}
