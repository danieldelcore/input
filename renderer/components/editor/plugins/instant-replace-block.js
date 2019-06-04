const instantReplaceBlock = ({
    triggerKey = 'Enter',
    pattern,
    block,
    onFormat = () => {},
    passive = true,
}) => ({
    onKeyDown: (event, editor, next) => {
        if (event.key.toLowerCase() !== triggerKey.toLowerCase()) return next();

        const { text } = editor.value.startBlock;
        const match = pattern.exec(text);

        if (!match) return next();

        const matchText = match[0];

        editor.deleteBackward(matchText.length);

        const formattedText = onFormat(matchText);
        const formattedBlock =
            typeof block === 'function'
                ? block(matchText, formattedText)
                : block;

        editor.setBlocks(formattedBlock).insertText(formattedText);

        if (!passive) {
            editor.insertBlock('paragraph').moveFocusToStartOfNextBlock();
        }
    },
});

export default instantReplaceBlock;
