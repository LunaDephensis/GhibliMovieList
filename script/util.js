export function nameShortering(name) {
    if(name.length > 15) {
        let words = name.split(" ");
        let firstChar = words[0].slice(0, 1) + '.';
        words[0] = firstChar;
        return words.join(' ');
    }
    return name;
}

