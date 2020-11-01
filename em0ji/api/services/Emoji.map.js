const appLibrary = require("../../lib");
const emoji_array = appLibrary.get("/emoji/emoji.json").emoji;

const emoji_map = new Map();

emoji_array.forEach(emoji => {
    emoji_map.set(emoji.name, emoji.value);
});

module.exports = emoji_map;