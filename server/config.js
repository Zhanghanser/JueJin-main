// 这是一个全局的配置文件

module.exports = {
  // 加密和解密 Token 的秘钥
  jwtSecretKey: process.env.JWT_SECRET || 'your-secure-random-key-here',
  // token 的有效期
  expiresIn: '10h',
}
