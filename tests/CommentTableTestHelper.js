/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentTableTestHelper = {

  async getIsDeletedStatus(commentId) {
    const result = await pool.query({
      text: 'SELECT is_deleted FROM comments WHERE id=$1',
      values: [commentId],
    });

    return result.rows[0].is_deleted;
  },

  async getComment(commentId) {
    const result = await pool.query({
      text: 'SELECT * FROM comments WHERE id=$1',
      values: [commentId],
    });
    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentTableTestHelper;
