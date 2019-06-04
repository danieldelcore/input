const instantReplaceMark = ({
    triggerKey = ' ',
    pattern,
    mark,
    onFormat = () => {},
}) => ({
    onKeyDown: (event, editor, next) => {
        if (event.key.toLowerCase() !== triggerKey.toLowerCase()) return next();

        const { text } = editor.value.startText;
        const match = pattern.exec(text);

        if (!match) return next();

        const matchText = match[0];

        editor.deleteBackward(matchText.length);

        const formattedText = onFormat(matchText);

        editor
            .addMark(mark)
            .insertText(formattedText)
            .moveToEndOfBlock();
    },
});

export default instantReplaceMark;
