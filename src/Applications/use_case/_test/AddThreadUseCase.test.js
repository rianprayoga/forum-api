const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUsecase', () => {
  it('should execute sucessfully', async () => {
    const credentialId = '123';
    const payload = { title: 'title', body: 'body' };

    const threadRepo = new ThreadRepository();
    threadRepo.addThread = jest.fn(() => Promise.resolve({ title: 'title', body: 'body', id: 'id' }));

    const usecase = new AddThreadUseCase(threadRepo);

    const result = await usecase.execute(payload, credentialId);

    expect(result.id).toEqual('id');
    expect(result.body).toEqual(payload.body);
    expect(result.title).toEqual(payload.title);

    expect(threadRepo.addThread)
      .toBeCalledWith(new CreateThread(payload), credentialId);
  });
});
