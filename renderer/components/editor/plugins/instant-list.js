function onBackspace(options, event, editor, next) {
    const { selection, startBlock } = editor.value;

    if (selection.start.offset !== 0) return next();
    if (startBlock.type !== options.item) return next();

    editor.setBlocks('paragraph');

    if (startBlock.type === options.item) {
        editor.unwrapBlock(options.list);
    }
}

function onSpace(options, event, editor, next) {
    const { startBlock } = editor.value;
    const { text } = startBlock;
    const match = options.pattern.exec(text);

    if (!match) return next();

    const matchText = match[0];

    editor
        .deleteBackward(matchText.length)
        .setBlocks(options.item)
        .wrapBlock(options.list)
        .moveFocusToStartOfNode(startBlock)
        .delete();
}

function onTab(options, event, editor, next) {}

const instantList = options => ({
    onKeyDown: (event, editor, next) => {
        switch (event.key) {
            case ' ':
                return onSpace(options, event, editor, next);
            case 'Backspace':
                return onBackspace(options, event, editor, next);
            // case 'Tab':
            //     return onTab(options, event, editor, next);
            default:
                return next();
        }
    },
});

export default instantList;
