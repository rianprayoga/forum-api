const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUsecase', () => {
  it('should execute sucessfully', async () => {
    const credentialId = '123';
    const payload = { title: 'title', body: 'body' };

    const threadRepo = new ThreadRepository();
    threadRepo.addThread = jest.fn(() => Promise.resolve());

    const usecase = new AddThreadUseCase(threadRepo);

    await usecase.execute(payload, credentialId);

    expect(threadRepo.addThread)
      .toBeCalledWith(new CreateThread(payload), credentialId);
  });
});
