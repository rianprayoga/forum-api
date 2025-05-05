const CreatedThread = require("../../Domains/threads/entities/CreatedThread");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const {DetailThread, DetailComment} = require('../../Domains/threads/entities/DetailThread');

class ThreadRepositoryPostgres extends ThreadRepository {

    constructor(pool, idGenerator) {

        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread(createThread, owner) {
        const { title, body} = createThread;
        const id = `thread-${this._idGenerator()}`;
    
        const query = {
          text: 'INSERT INTO threads(id, title, body, owner) VALUES($1, $2, $3, $4) RETURNING id, title, owner',
          values: [id, title, body, owner],
        };
    
        const result = await this._pool.query(query);
    
        return new CreatedThread({ ...result.rows[0] });
    }    

    async validateThreadExist(id){

        const result = await this._pool.query({
            text: 'SELECT id FROM threads t WHERE t.id = $1',
            values: [id]
        });

        if (!result.rowCount) {
            throw new NotFoundError('thread tidak ditemukan');
        }
      
        return id;
    }

    async getThread(id){

        const threadResult = await this._pool.query({
            text: 'select t.id, title, body, created_date as date, u.username from threads t left join users u on t.owner = u.id where t.id = $1',
            values: [id]
        });

        if (!threadResult.rowCount) {
            throw new NotFoundError('thread tidak ditemukan');
        }
        
        const commentsResult = await this._pool.query({
            text: 'select c.id, u.username, created_date as date, content, is_deleted from comments c left join users u on c.owner = u.id where c.thread_id = $1',
            values: [id]
        });
        
        if (commentsResult.rowCount){
            const comments = commentsResult.rows.map((x) => {
                return new DetailComment(x);
            });
            return new DetailThread({ ...threadResult.rows[0] }, comments);
        }

        return new DetailThread({ ...threadResult.rows[0] }, []);
    }

}

module.exports = ThreadRepositoryPostgres;