/* eslint max-classes-per-file: "off" */

class DetailThread {
  constructor(data, comments) {
    this.id = data.id;
    this.title = data.title;
    this.body = data.body;
    this.date = data.date;
    this.username = data.username;
    this.comments = comments;
  }
}

class DetailComment {
  constructor(data, replies) {
    this.id = data.id;
    this.username = data.username;
    this.date = data.date;
    this.content = data.is_deleted ? '**komentar telah dihapus**' : data.content;
    this.replies = replies === undefined ? [] : replies;
  }
}

class DetailReply {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.date = data.date;
    this.content = data.is_deleted ? '**balasan telah dihapus**' : data.content;
  }
}

module.exports = { DetailThread, DetailComment, DetailReply };
