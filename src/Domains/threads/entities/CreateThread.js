class CreateThread {
  constructor(payload) {
    this._checkPayload(payload);

    const { title, body } = payload;

    this.title = title;
    this.body = body;
  }

  _checkPayload({ title, body }) {
    if (!title || !body) {
      throw new Error('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (title.length > 50) {
      throw new Error('CREATE_THREAD.TITLE_LIMIT_CHAR');
    }

    if (body.length > 50) {
      throw new Error('CREATE_THREAD.BODY_LIMIT_CHAR');
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreateThread;
