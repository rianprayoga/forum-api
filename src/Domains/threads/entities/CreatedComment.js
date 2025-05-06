class CreatedComment {
  constructor(payload) {
    this._checkPayload(payload);

    const { id, content, owner } = payload;

    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  _checkPayload({ id, content, owner }) {
    if (!content || !id || !owner) {
      throw new Error('CREATED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof id !== 'string' || typeof owner !== 'string') {
      throw new Error('CREATED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreatedComment;
