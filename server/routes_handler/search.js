const db = require('../db')

exports.getComprehensive = async (req, res) => {
  try {
    let { page, limit, sort, keyWords } = req.query
    page = Number(page) || 1
    limit = Number(limit) || 10
    let total = 0

    let baseSql = `select article.id,user.nickname,user.username,title,content,cover,name AS 'article_type',view_num,like_num,article.create_time,user.id AS user_id from article
  inner join article_type on article.type_id=article_type.id
  inner join user on article.user_id=user.id
  where status=1 `
    let countParams = []
    let queryParams = []

    if (keyWords) {
      const likePattern = `%${keyWords}%`
      baseSql += `and (title like ? or content like ?) `
      countParams.push(likePattern, likePattern)
      queryParams.push(likePattern, likePattern)
    }

    // Get total count
    try {
      const [countResult] = await db.promise().query(baseSql, countParams)
      total = countResult.length
    } catch (_e) {
      // ignore count error
    }

    switch (sort) {
      case '0':
        baseSql += 'ORDER BY view_num DESC,like_num DESC'
        break
      case '1':
        baseSql += 'ORDER BY article.create_time DESC'
        break
      case '2':
        baseSql += 'ORDER BY like_num DESC,view_num DESC'
        break
    }
    baseSql += `\nlimit ? offset ?`
    queryParams.push(limit, (page - 1) * limit)

    const [results] = await db.promise().query(baseSql, queryParams)
    res.send({
      status: 0,
      message: '获取文章成功！',
      data: results,
      total
    })
  } catch (err) {
    return res.cc(err)
  }
}

exports.getArticleList = async (req, res) => {
  try {
    let { page, limit, sort, keyWords } = req.query
    page = Number(page) || 1
    limit = Number(limit) || 10
    let total = 0

    let baseSql = `select article.id,user.nickname,user.username,title,content,cover,name AS 'article_type',view_num,like_num,article.create_time,user.id AS user_id from article
  inner join article_type on article.type_id=article_type.id
  inner join user on article.user_id=user.id
  where status=1 `
    let countParams = []
    let queryParams = []

    if (keyWords) {
      const likePattern = `%${keyWords}%`
      baseSql += `and (title like ? or content like ?) `
      countParams.push(likePattern, likePattern)
      queryParams.push(likePattern, likePattern)
    }

    // Get total count
    try {
      const [countResult] = await db.promise().query(baseSql, countParams)
      total = countResult.length
    } catch (_e) {
      // ignore count error
    }

    switch (sort) {
      case '0':
        baseSql += 'ORDER BY view_num DESC,like_num DESC'
        break
      case '1':
        baseSql += 'ORDER BY article.create_time DESC'
        break
      case '2':
        baseSql += 'ORDER BY like_num DESC,view_num DESC'
        break
    }
    baseSql += `\nlimit ? offset ?`
    queryParams.push(limit, (page - 1) * limit)

    let randomSortSql = `SELECT * FROM (${baseSql}) AS sorted_data ORDER BY RAND();`
    const [results] = await db.promise().query(randomSortSql, queryParams)
    res.send({
      status: 0,
      message: '获取文章成功！',
      data: results,
      total
    })
  } catch (err) {
    return res.cc(err)
  }
}

exports.getUserList = async (req, res) => {
  try {
    let { page, limit, keyWords, userIdList } = req.query
    page = Number(page) || 1
    limit = Number(limit) || 10
    let total = 0

    // If userIdList is a string, parse it; otherwise keep as array
    if (typeof userIdList === 'string') {
      try { userIdList = JSON.parse(userIdList) } catch (_e) { userIdList = userIdList.split(',') }
    }

    let sql = `SELECT id,username,nickname,avatar FROM user WHERE `
    let params = []

    if (keyWords) {
      const likePattern = `%${keyWords}%`
      sql += `(nickname is null and username like ?) or (nickname like ?)`
      params.push(likePattern, likePattern)
    } else {
      if (userIdList && userIdList.length > 0) {
        const placeholders = userIdList.map(() => '?').join(',')
        sql += `id in (${placeholders})`
        params.push(...userIdList)
      } else {
        sql += `id in (-1)`
      }
    }

    // Get total count
    try {
      const [countResult] = await db.promise().query(sql, params)
      total = countResult.length
    } catch (_e) {
      // ignore count error
    }

    sql += ` ORDER BY create_time ASC\nlimit ? offset ?`
    params.push(limit, (page - 1) * limit)

    const [results] = await db.promise().query(sql, params)
    res.send({
      status: 0,
      message: '获取用户列表成功！',
      data: results,
      total
    })
  } catch (err) {
    return res.cc(err)
  }
}

exports.getArticleByTagId = async (req, res) => {
  try {
    let { page, limit, sort, tagId } = req.query
    page = Number(page) || 1
    limit = Number(limit) || 10
    let total = 0
    let tagName = ''

    let sql = `SELECT
    article.id,
    USER.nickname,
    USER.username,
    title,
    content,
    cover,
    NAME AS 'article_type',
    view_num,
    like_num,
    article.create_time,
    USER.id AS user_id
  FROM
    article_tag_merge
    INNER JOIN article ON article_tag_merge.article_id = article.id 
    INNER JOIN article_type ON article.type_id = article_type.id
    INNER JOIN USER ON article.user_id = USER.id 
  WHERE tag_id = ? AND article.status=1 `

    // Get total count
    try {
      const [countResult] = await db.promise().query(sql, [tagId])
      total = countResult.length
    } catch (_e) {
      // ignore count error
    }

    // Get tag name
    try {
      let sql2 = `select tag_name from tag where id=?`
      const [tagResult] = await db.promise().query(sql2, [tagId])
      tagName = tagResult.length == 1 ? tagResult[0].tag_name : null
    } catch (_e) {
      // ignore
    }

    switch (sort) {
      case '0':
        sql += 'ORDER BY view_num DESC,like_num DESC'
        break
      case '1':
        sql += 'ORDER BY article.create_time DESC'
        break
      case '2':
        sql += 'ORDER BY like_num DESC,view_num DESC'
        break
    }
    sql += `\nlimit ? offset ?`

    const [results] = await db.promise().query(sql, [tagId, limit, (page - 1) * limit])
    res.send({
      status: 0,
      message: total == 0 ? '标签不存在' : '获取标签文章成功！',
      data: results,
      total,
      tagName
    })
  } catch (err) {
    return res.cc(err)
  }
}

exports.getArticleByUserIdList = async (req, res) => {
  try {
    let { page, limit, userIdList } = req.query
    page = Number(page) || 1
    limit = Number(limit) || 10

    if (typeof userIdList === 'string') {
      try { userIdList = JSON.parse(userIdList) } catch (_e) { userIdList = userIdList.split(',') }
    }

    let sql = `select article.id,user.nickname,user.username,title,content,cover,view_num,like_num,article.create_time,user.id AS user_id from article
  inner join user on article.user_id=user.id
  where status=1 `
    let params = []

    if (userIdList && userIdList.length > 0) {
      const placeholders = userIdList.map(() => '?').join(',')
      sql += `and user_id in (${placeholders}) `
      params.push(...userIdList)
    } else {
      sql += `and user_id in (-1) `
    }

    sql += `ORDER BY article.create_time DESC\nlimit ? offset ?`
    params.push(limit, (page - 1) * limit)

    const [results] = await db.promise().query(sql, params)
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

exports.getArticleByUserId = async (req, res) => {
  // type: 0为草稿，1为已发布的文章
  try {
    let { page, limit, userId, type } = req.query
    page = Number(page) || 1
    limit = Number(limit) || 10

    let sql = `
  SELECT
    article.id,
    USER.nickname,
    USER.username,
    title,
    content,
    cover,
    NAME AS 'article_type',
    view_num,
    like_num,
    article.create_time,
    USER.id AS user_id 
  FROM
    article
    INNER JOIN article_type ON article.type_id = article_type.id
    INNER JOIN USER ON article.user_id = USER.id 
  WHERE
    STATUS =? and user_id=? `
    let params = [type, userId]

    sql += `limit ? offset ?`
    params.push(limit, (page - 1) * limit)

    const [results] = await db.promise().query(sql, params)
    if (results.length === 0) return res.cc('没有更多了！', 0)
    res.send({
      status: 0,
      message: `获取${type == 0 ? '草稿' : '文章'}成功！`,
      data: results
    })
  } catch (err) {
    return res.cc(err)
  }
}

exports.getStarredArticleByUserId = async (req, res) => {
  try {
    let { page, limit, userId } = req.query
    page = Number(page) || 1
    limit = Number(limit) || 10
    let total = 0

    let sql = `SELECT
      article.id,
      USER.nickname,
      USER.username,
      title,
      content,
      cover,
      NAME AS 'article_type',
      view_num,
      like_num,
      article.create_time,
      USER.id AS user_id 
    FROM
      article
      INNER JOIN article_type ON article.type_id = article_type.id
      INNER JOIN USER ON article.user_id = USER.id 
    WHERE
      STATUS =1 and article.id in(select article_id from star WHERE user_id=?) `

    // Get total count
    try {
      const [countResult] = await db.promise().query(sql, [userId])
      total = countResult.length
    } catch (_e) {
      // ignore count error
    }

    sql += `limit ? offset ?`

    const [results] = await db.promise().query(sql, [userId, limit, (page - 1) * limit])
    if (results.length === 0) return res.cc('没有更多了！', 0)
    res.send({
      status: 0,
      message: '获取收藏文章成功！',
      data: results,
      total
    })
  } catch (err) {
    return res.cc(err)
  }
}

exports.getLikedArticleByUserId = async (req, res) => {
  try {
    let { page, limit, userId } = req.query
    page = Number(page) || 1
    limit = Number(limit) || 10

    let sql = `SELECT
      article.id,
      USER.nickname,
      USER.username,
      title,
      content,
      cover,
      NAME AS 'article_type',
      view_num,
      like_num,
      article.create_time,
      USER.id AS user_id 
    FROM
      article
      INNER JOIN article_type ON article.type_id = article_type.id
      INNER JOIN USER ON article.user_id = USER.id 
    WHERE
      STATUS =1 and article.id in(select content_id from \`like\`  WHERE type_id=0 and user_id=?) `

    sql += `limit ? offset ?`

    const [results] = await db.promise().query(sql, [userId, limit, (page - 1) * limit])
    if (results.length === 0) return res.cc('没有更多了！', 0)
    res.send({
      status: 0,
      message: '获取点赞文章成功！',
      data: results
    })
  } catch (err) {
    return res.cc(err)
  }
}

exports.getArticleByKeyWordsFromPublishedAndStarredAndLiked = async (req, res) => {
  try {
    let { page, limit, userId, keyWords } = req.query
    page = Number(page) || 1
    limit = Number(limit) || 10

    let sql = `SELECT
            article.id,
            USER.nickname,
            USER.username,
            title,
            content,
            cover,
            NAME AS 'article_type',
            view_num,
            like_num,
            article.create_time,
            USER.id AS user_id 
          FROM
            article
            INNER JOIN article_type ON article.type_id = article_type.id
            INNER JOIN USER ON article.user_id = USER.id 
          WHERE
            STATUS = 1 
            AND (user_id = ?
                OR article.id IN (SELECT content_id FROM \`like\` WHERE type_id = 0 AND user_id = ?) 
                OR article.id IN (SELECT article_id  FROM \`star\` WHERE user_id = ?)) `
    let params = [userId, userId, userId]

    if (keyWords) {
      const likePattern = `%${keyWords}%`
      sql += `AND (title like ? or content like ?)`
      params.push(likePattern, likePattern)
    }

    sql += `\nlimit ? offset ?`
    params.push(limit, (page - 1) * limit)

    const [results] = await db.promise().query(sql, params)
    res.send({
      status: 0,
      message: '获取文章成功！',
      data: results
    })
  } catch (err) {
    return res.cc(err)
  }
}
