const CreateThread = require('../../Domains/threads/entities/CreateThread')

class AddThreadUseCase{

    constructor( threadRepository) {
        this._threadRepository = threadRepository;
      }
    
      async execute(payload, credentialId) {
        const data = new CreateThread(payload);
        return await this._threadRepository.addThread(data, credentialId);
      }

}

module.exports = AddThreadUseCase;