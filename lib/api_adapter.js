var crypto = require('crypto');

/**
 * @class ApiAdapter
 * Provides methods to convert between old JSON API and how things are
 * named in our MySQL database.
 */
module.exports = {
    /**
     * Turns comment row into JSON response.
     */
    commentToJson: function(comment) {
        return {
            _id: comment.id,
            user_id: comment.user_id,
            author: comment.username,
            target: this.targetToJson(comment),
            content: comment.content,
            contentHtml: comment.content_html,
            createdAt: String(comment.created_at),
            score: comment.vote,
            upVote: comment.vote_dir === 1,
            downVote: comment.vote_dir === -1,
            read: comment.read,
            tags: comment.tags ? comment.tags.split("\t") : [],
            moderator: comment.moderator,
            emailHash: crypto.createHash('md5').update(comment.email).digest("hex"),
            parentId: comment.parent_id,
            replyCount: comment.reply_count
        };
    },

    /**
     * Turns user row into JSON response.
     */
    userToJson: function(user) {
        return {
            id: user.id,
            userName: user.username,
            score: user.score,
            mod: user.moderator,
            emailHash: crypto.createHash('md5').update(user.email).digest("hex")
        };
    },

    /**
     * Turns target array in JSON into {type,cls,member} object.
     */
    targetFromJson: function(json) {
        try {
            var target = JSON.parse(json);
        }
        catch (e) {
            throw "Unable to parse JSON string: " + json;
        }

        return {
            type: target[0],
            cls: target[1],
            member: target[2] || ""
        };
    },

    /**
     * Turns target object into array.
     */
    targetToJson: function(target) {
        return [
            target.type,
            target.cls,
            target.member
        ];
    }
};