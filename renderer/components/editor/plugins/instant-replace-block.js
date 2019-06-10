import { detectTrigger } from './common';

const instantReplaceBlock = ({
    triggers = 'Enter',
    pattern,
    block,
    onFormat = () => {},
    passive = true,
}) => ({
    onKeyDown: (event, editor, next) => {
        if (!detectTrigger(event.key, triggers)) return next();

        const { text } = editor.value.startBlock;

        if (!pattern.test(text)) return next();

        editor.deleteBackward(text.length);

        const formattedText =
            typeof onFormat === 'function' ? onFormat(text) : text;

        const formattedBlock =
            typeof block === 'function' ? block(text, formattedText) : block;

        editor.setBlocks(formattedBlock).insertText(formattedText);

        if (!passive) {
            editor.insertBlock('paragraph').moveFocusToStartOfNextBlock();
        }
    },
});

export default instantReplaceBlock;
