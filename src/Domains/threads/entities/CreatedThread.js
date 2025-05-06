class CreatedThread {
  constructor(payload) {
    this._checkPayload(payload);

    const { id, title, owner } = payload;

    this.id = id;
    this.title = title;
    this.owner = owner;
  }

  _checkPayload({ id, title, owner }) {
    if (!title || !id || !owner) {
      throw new Error('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof id !== 'string' || typeof owner !== 'string') {
      throw new Error('CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreatedThread;
