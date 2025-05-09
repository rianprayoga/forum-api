const { DetailReply } = require('./entities/DetailThread');

const ThreadContstructor = {
  build(thread, comments, replies) {
    const holder = thread;

    const map = new Map();
    replies.forEach((element) => {
      const commentId = element.commentid;
      if (map.has(commentId)) {
        const tmp = map.get(commentId);
        tmp.push(new DetailReply(element));
        map.set(commentId, tmp);
      } else {
        map.set(commentId, [new DetailReply(element)]);
      }
    });

    const adjustedComments = comments.map((element) => {
      const tmp = element;
      tmp.replies = map.has(element.id) ? map.get(element.id) : [];
      return tmp;
    });

    holder.comments = adjustedComments;
    return holder;
  },
};

module.exports = ThreadContstructor;
