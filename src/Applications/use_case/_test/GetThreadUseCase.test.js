const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const GetThreadUseCase = require("../GetThreadUseCase");

describe('GetThreadUseCase', ()=> {

    it('should execute sucessfully', async ()=>{
        const threadId = 'threadId';

        const threadRepo = new ThreadRepository();
        threadRepo.getThread = jest.fn(()=> Promise.resolve());

        const usecase = new GetThreadUseCase(threadRepo);
        await usecase.execute(threadId);

        expect(threadRepo.getThread).toBeCalledWith(threadId);
    });

});