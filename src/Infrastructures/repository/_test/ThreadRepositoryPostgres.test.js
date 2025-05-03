const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');


describe('ThreadRepository Postgres', () => {

    beforeAll(async () => {
        await UsersTableTestHelper.addUser({id:'user-123'});
    })

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });
    
    afterAll(async () => {
        await pool.end();
    });

    describe('addToken function', () => {
        it('should add thread to database', async () => {

            const fakeIdGenerator = () => '123'; // stub!
            const owner = 'user-123';
          const repo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
          const payload = {title: 'title', body: 'body'};  

          const result = await repo.addThread(payload, owner);
    
          expect(result.id).toBe('thread-123');
          expect(result.title).toBe(payload.title);
          expect(result.owner).toBe(owner);

        });
      });


});