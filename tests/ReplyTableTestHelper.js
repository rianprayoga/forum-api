/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ReplyTableTestHelper = {

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
  async getIsDeletedStatus(id) {
    const result = await pool.query({
      text: 'SELECT is_deleted FROM replies WHERE id=$1',
      values: [id],
    });

    return result.rows[0].is_deleted;
  },
  async getReply(id){
    const result = await pool.query({
      text: 'SELECT * FROM replies WHERE id=$1',
      values: [id],
    });
    return result.rows[0];
  },
};

module.exports = ReplyTableTestHelper;
