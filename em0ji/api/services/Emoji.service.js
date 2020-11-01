const emoji_map = require("./Emoji.map");

class Emoji {

    getValue(name = "none") {
        let emoji = emoji_map.get(name);
        if (!emoji) emoji = emoji_map.get("dunno");
        return emoji;
    }
}

module.exports = {
    class: Emoji,
    getInst: function () {
        return new Emoji();
    }
};