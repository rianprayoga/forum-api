const CreatedThread = require("../../Domains/threads/entities/CreatedThread");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");

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

}

module.exports = ThreadRepositoryPostgres;