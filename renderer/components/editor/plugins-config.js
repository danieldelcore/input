import { instantReplace } from './plugins';

const plugins = [
    instantReplace({
        pattern: /\`+.+\`/,
        mark: 'code',
        onFormat: str => str.substr(1).slice(0, -1),
    }),
    instantReplace({
        pattern: /\*+.+\*/,
        mark: 'bold',
        onFormat: str => str.substr(1).slice(0, -1),
    }),
    instantReplace({
        pattern: /\_+.+\_/,
        mark: 'emphasis',
        onFormat: str => str.substr(1).slice(0, -1),
    }),
];

export default plugins;
