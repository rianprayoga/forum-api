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

            // Arrange
            const fakeIdGenerator = () => '123'; // stub!
          const repo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
          const payload = {title: 'title', body: 'body', owner: 'user-123'}  

          // Action
          const {id, title, owner} = await repo.addThread(payload);
    
          // Assert
          expect(id).toBe('thread-123');
          expect(title).toBe(payload.title);
          expect(owner).toBe(payload.owner);

        });
      });


});