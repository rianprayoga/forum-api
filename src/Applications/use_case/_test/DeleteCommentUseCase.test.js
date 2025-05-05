const CommentRepository = require("../../../Domains/threads/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const DeleteCommentuseCae = require("../DeleteCommentUseCase");

describe('DeleteCommentUseCase', ()=> {

    it('should execute sucessfully', async ()=> {
        const threadId = 'threadId';
        const commentId = 'commentId';
        const owner = 'owner';

        const threadRepo = new ThreadRepository();
        threadRepo.validateThreadExist = jest.fn(()=> Promise.resolve());

        const commetRepo = new CommentRepository();
        commetRepo.validateCommentOwnership = jest.fn(() => Promise.resolve());
        commetRepo.markAsDeleted = jest.fn(()=> Promise.resolve());

        const usecase = new DeleteCommentuseCae({
            threadRepository: threadRepo,
            commentRepository: commetRepo
        });

        await usecase.execute(threadId, commentId, owner);

        expect(threadRepo.validateThreadExist).toBeCalledWith(threadId);
        expect(commetRepo.validateCommentOwnership).toBeCalledWith(commentId, owner);
        expect(commetRepo.markAsDeleted).toBeCalledWith(commentId);
    });

});