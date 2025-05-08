const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUsecase', () => {
  it('should execute sucessfully', async () => {
    const credentialId = '123';
    const payload = { title: 'title', body: 'body' };

    const threadRepo = new ThreadRepository();
    threadRepo.addThread = jest.fn(() => Promise.resolve(
      new CreatedThread({
        title: 'title', body: 'body', id: 'id', owner: credentialId,
      }),
    ));

    const usecase = new AddThreadUseCase(threadRepo);

    const result = await usecase.execute(payload, credentialId);

    expect(result).toStrictEqual(new CreatedThread({
      title: 'title', body: 'body', id: 'id', owner: credentialId,
    }));

    expect(threadRepo.addThread)
      .toBeCalledWith(new CreateThread(payload), credentialId);
  });
});
