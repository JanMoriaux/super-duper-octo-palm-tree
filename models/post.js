const { pool, sql } = require('../util/database');

module.exports = class Post {
  constructor(title, imageUrl, content, creator) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.content = content;
    this.creator = creator;
    this.createdAt = new Date();
    this.updatetAt = new Date();
  }

  static async find() {
    const db = await pool;
    const request = db.request();
    const result = await request.query('SELECT * FROM Posts');
    return result.recordset.map(post =>
      Object.assign({}, post, { creator: { id: post.creatorId, name: 'Jan' } })
    );
  }

  async save() {
    const db = await pool;
    const transaction = db.transaction();
    await transaction.begin();
    let request = transaction.request();
    request.input('title', sql.VarChar, this.title);
    request.input('content', sql.Text, this.content);
    request.input('imageUrl', sql.Text, this.imageUrl);
    request.input('creatorId', sql.Int, this.creator.id);
    let result = await request.query(
      'INSERT INTO Posts(title,content,imageUrl,creatorId)' +
        'VALUES(@title,@content,@imageUrl,@creatorId)'
    );
    if (result.rowsAffected[0] === 1) {
      request = transaction.request();
      result = await request.query(
        'SELECT * FROM Posts Where Posts.id = @@Identity'
      );
      await transaction.commit();
      return result;
    }
  }

  static async findById(id) {
    const db = await pool;
    const request = db.request();
    request.input('id', sql.Int, id);
    let result = await request.query(
      'SELECT * FROM Posts WHERE Posts.id = @id'
    );
    return result.recordset[0];
  }
};
