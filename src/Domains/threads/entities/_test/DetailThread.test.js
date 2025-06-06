const { DetailThread, DetailComment, DetailReply } = require('../DetailThread');

describe('DetailThread', () => {
  it('should create sucessfully when comment deleted', () => {
    const comment = new DetailComment(
      {
        id: '321',
        is_deleted: true,
        username: 'what',
        content: 'where',
        date: 'date',
      },
      [],
    );
    const detail = new DetailThread({
      is_deleted: false,
      id: '123',
      username: 'what',
      body: 'where',
      title: 'who',
      date: 'date',
    }, [comment]);

    expect(detail.id).toEqual('123');
    expect(detail.username).toEqual('what');
    expect(detail.body).toEqual('where');
    expect(detail.title).toEqual('who');
    expect(detail.date).toEqual('date');
    expect(detail.comments[0].content).toEqual('**komentar telah dihapus**');
    expect(detail.comments[0].username).toEqual('what');
    expect(detail.comments[0].id).toEqual('321');
    expect(detail.comments[0].date).toEqual('date');
    expect(detail.comments[0].replies).toEqual([]);
  });

  it('should create sucessfully when comment not deleted', () => {
    const comment = new DetailComment(
      {
        id: '321',
        is_deleted: false,
        username: 'what',
        content: 'where',
        date: 'date',
      },
    );
    const detail = new DetailThread(
      {
        is_deleted: false,
        id: '123',
        username: 'what',
        body: 'where',
        date: 'date',
        title: 'title',
      },
      [comment],
    );

    expect(detail.id).toEqual('123');
    expect(detail.username).toEqual('what');
    expect(detail.body).toEqual('where');
    expect(detail.title).toEqual('title');
    expect(detail.date).toEqual('date');

    expect(detail.comments[0].content).toEqual('where');
    expect(detail.comments[0].username).toEqual('what');
    expect(detail.comments[0].id).toEqual('321');
    expect(detail.comments[0].replies).toEqual([]);
    expect(detail.comments[0].date).toEqual('date');
  });

  it('should create sucessfully detail reply when deleted is true', () => {
    const reply = new DetailReply(
      {
        id: '321',
        is_deleted: true,
        username: 'what',
        content: 'where',
        date: 'date',
      },
    );

    expect(reply.id).toEqual('321');
    expect(reply.content).toEqual('**balasan telah dihapus**');
    expect(reply.username).toEqual('what');
    expect(reply.date).toEqual('date');
  });

  it('should create sucessfully detail reply when deleted is false', () => {
    const reply = new DetailReply(
      {
        id: '321',
        is_deleted: false,
        username: 'what',
        content: 'where',
        date: 'date',
      },
    );

    expect(reply.id).toEqual('321');
    expect(reply.content).toEqual('where');
    expect(reply.username).toEqual('what');
    expect(reply.date).toEqual('date');
  });
});
