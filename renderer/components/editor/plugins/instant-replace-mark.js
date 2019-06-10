import { detectTrigger } from './common';

const instantReplaceMark = ({
    triggers = ' ',
    pattern,
    mark,
    onFormat = () => {},
}) => ({
    onKeyDown: (event, editor, next) => {
        if (!detectTrigger(event.key, triggers)) return next();

        const { text } = editor.value.startText;
        const match = pattern.exec(text);

        if (!match) return next();

        const matchText = match[0];

        editor.deleteBackward(matchText.length);

        const formattedText =
            typeof onFormat === 'function' ? onFormat(matchText) : matchText;

        editor
            .addMark(mark)
            .insertText(formattedText)
            .moveToEndOfBlock();
    },
});

export default instantReplaceMark;
