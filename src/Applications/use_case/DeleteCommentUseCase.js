class DeleteCommentuseCae {

    constructor( {threadRepository, commentRepository}) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(threadId, commentId, owner){

        await this._threadRepository.validateThreadExist(threadId);
        await this._commentRepository.validateCommentOwnership(commentId, owner);
        await this._commentRepository.markAsDeleted(commentId);
    }

}

module.exports = DeleteCommentuseCae;