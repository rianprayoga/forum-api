const { DetailThread, DetailComment } = require('../DetailThread');

describe('DetailThread', () => {
  it('should create sucessfully when comment deleted', () => {
    const comment = new DetailComment(
      {
        id: '321',
        is_deleted: true,
        username: 'what',
        content: 'where',
      },
      [],
    );
    const detail = new DetailThread({ id: '123' }, [comment]);

    expect(detail.id).toEqual('123');
    expect(detail.comments[0].content).toEqual('**komentar telah dihapus**');
    expect(detail.comments[0].username).toEqual('what');
    expect(detail.comments[0].id).toEqual('321');
  });

  it('should create sucessfully when comment not deleted', () => {
    const comment = new DetailComment(
      {
        id: '321',
        is_deleted: false,
        username: 'what',
        content: 'where',
      },
      [],
    );
    const detail = new DetailThread({ id: '123' }, [comment]);

    expect(detail.id).toEqual('123');
    expect(detail.comments[0].content).toEqual('where');
    expect(detail.comments[0].username).toEqual('what');
    expect(detail.comments[0].id).toEqual('321');
  });
});
