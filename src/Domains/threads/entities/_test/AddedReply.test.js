const AddedReply = require('../AddedReply');

describe('AddedReply', () => {
  it('should init sucessfully', () => {
    const result = new AddedReply({ id: 'id', content: 'content', owner: 'owner' });

    expect(result.id).toEqual('id');
    expect(result.content).toEqual('content');
    expect(result.owner).toEqual('owner');
  });
});
