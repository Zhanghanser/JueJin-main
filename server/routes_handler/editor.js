const db = require('../db')

exports.getCreateArticle = async (req, res) => {
  try {
    let { userId } = req.query
    let sql = `INSERT INTO article (user_id) VALUE(?)`
    const [results] = await db.promise().query(sql, [userId])
    if (results.affectedRows !== 1) return res.cc('文章创建失败！', 0)
    res.send({
      status: 0,
      message: '文章创建成功！',
      data: results.insertId
    })
  } catch (err) {
    return res.cc(err)
  }
}

exports.getUpdateArticle = async (req, res) => {
  try {
    let { title, content, cover, typeId, tagList, id, userId } = req.body

    const sql = `select * from article where id=? and user_id=?`
    const [article] = await db.promise().query(sql, [id, userId])
    if (article.length === 0) return res.cc('没有权限修改该文章！')

    const currentTime = new Date()
    const formattedTime = currentTime.toLocaleString().replace('/', '-')

    let sql1, params1
    if (cover) {
      sql1 = `UPDATE article SET title=?,content=?,type_id=?,cover=?,create_time=? WHERE id=?`
      params1 = [title, content, typeId || 1, cover, formattedTime, id]
    } else {
      sql1 = `UPDATE article SET title=?,content=?,type_id=?,create_time=? WHERE id=?`
      params1 = [title, content, typeId || 1, formattedTime, id]
    }

    const [updateResult] = await db.promise().query(sql1, params1)
    if (updateResult.affectedRows !== 1) return res.cc('文章更新失败！', 0)

    if (tagList && tagList.length > 0) {
      // Delete existing tags
      const sql2 = `DELETE FROM article_tag_merge WHERE article_id=?`
      await db.promise().query(sql2, [id])

      // Insert new tags with parameterized batch
      const placeholders = tagList.map(() => '(?, ?)').join(',')
      const sql3 = `INSERT INTO article_tag_merge VALUES ${placeholders}`
      const params3 = []
      tagList.forEach(item => {
        params3.push(id, item)
      })
      await db.promise().query(sql3, params3)
    }

    res.send({
      status: 0,
      message: '文章更新成功！'
    })
  } catch (err) {
    return res.cc(err)
  }
}

exports.getPublishArticle = async (req, res) => {
  try {
    let { title, content, cover, typeId, tagList, id, userId } = req.body

    const sql = `select * from article where id=? and user_id=?`
    const [article] = await db.promise().query(sql, [id, userId])
    if (article.length === 0) return res.cc('没有权限修改该文章！')

    const currentTime = new Date()
    const formattedTime = currentTime.toLocaleString().replace('/', '-')

    let sql1, params1
    if (cover) {
      sql1 = `UPDATE article SET title=?,content=?,type_id=?,cover=?,create_time=?,status='1' WHERE id=?`
      params1 = [title, content, typeId || 1, cover, formattedTime, id]
    } else {
      sql1 = `UPDATE article SET title=?,content=?,type_id=?,create_time=?,status='1' WHERE id=?`
      params1 = [title, content, typeId || 1, formattedTime, id]
    }

    const [updateResult] = await db.promise().query(sql1, params1)
    if (updateResult.affectedRows !== 1) return res.cc('文章发布失败！', 0)

    if (tagList && tagList.length > 0) {
      // Delete existing tags
      const sql2 = `DELETE FROM article_tag_merge WHERE article_id=?`
      await db.promise().query(sql2, [id])

      // Insert new tags with parameterized batch
      const placeholders = tagList.map(() => '(?, ?)').join(',')
      const sql3 = `INSERT INTO article_tag_merge VALUES ${placeholders}`
      const params3 = []
      tagList.forEach(item => {
        params3.push(id, item)
      })
      await db.promise().query(sql3, params3)
    }

    res.send({
      status: 0,
      message: '文章发布成功！'
    })
  } catch (err) {
    return res.cc(err)
  }
}
