import {
    instantReplaceMark,
    instantReplaceBlock,
    instantList,
} from './plugins';

function getDecimalCounterpart(num) {
    switch (num) {
        case 1:
            return 'one';
        case 2:
            return 'two';
        case 3:
            return 'three';
        case 4:
            return 'four';
        case 5:
            return 'five';
        case 6:
            return 'six';
        default:
            break;
    }
}

const plugins = [
    instantReplaceBlock({
        pattern: /^#{1,6}\s*.+/,
        passive: false,
        block: str => {
            const length = (str.match(/#/g) || []).length;
            const number = getDecimalCounterpart(length);

            return `heading-${number}`;
        },
        onFormat: str => {
            let length = (str.match(/#/g) || []).length;

            if (str.charAt(length) === ' ') {
                length += 1;
            }

            return str.substr(length);
        },
    }),
    instantReplaceBlock({
        triggers: ' ',
        pattern: /^(>)/,
        block: 'block-quote',
        onFormat: str => str.substr(1),
    }),
    instantReplaceBlock({
        triggers: [' ', 'Enter'],
        pattern: /^---/,
        block: 'separator',
        passive: false,
        onFormat: str => str.substr(3),
    }),
    instantReplaceMark({
        pattern: /\`+.+\`/,
        mark: 'code',
        onFormat: str => str.substr(1).slice(0, -1),
    }),
    instantReplaceMark({
        pattern: /\*+.+\*/,
        mark: 'bold',
        onFormat: str => str.substr(1).slice(0, -1),
    }),
    instantReplaceMark({
        pattern: /\_+.+\_/,
        mark: 'emphasis',
        onFormat: str => str.substr(1).slice(0, -1),
    }),
    instantList({
        pattern: /^\-/,
        list: 'bulleted-list',
        item: 'list-item',
    }),
];

export default plugins;
