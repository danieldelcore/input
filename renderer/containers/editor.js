import React, {
    useRef,
    forwardRef,
    useState,
    useEffect,
    useImperativeHandle,
} from 'react';
import ReactDOM from 'react-dom';
import { Editor as SlateEditor } from 'slate-react';
import { KeyUtils, Value } from 'slate';
import { useStyles, styleCollector } from 'trousers';

const styles = styleCollector('editor').element`
        width: 100%;
        height: 100%;
        position: absolute;
        padding: 20px;
    `;

const getType = chars => {
    switch (chars) {
        case '*':
        case '-':
        case '+':
        case '1.':
        case '[ ]':
        case '[x]':
            return 'list-item';
        case '1.':
            return 'ordered-list-item';
        case '>':
            return 'block-quote';
        case '#':
            return 'heading-one';
        case '##':
            return 'heading-two';
        case '###':
            return 'heading-three';
        case '####':
            return 'heading-four';
        case '#####':
            return 'heading-five';
        case '######':
            return 'heading-six';
        case '---':
            return 'separator';
        default:
            return null;
    }
};

const getMarkType = key => {
    switch (key) {
        case 'b':
            return 'bold';
        case 'i':
            return 'emphasis';
        case 'u':
            return 'underline';
        case 'x':
            return 'strike';
        case '`':
            return 'code';
        default:
            return null;
    }
};

const renderBlock = (props, editor, next) => {
    const { attributes, children, node } = props;

    switch (node.type) {
        case 'block-quote':
            return <blockquote {...attributes}>{children}</blockquote>;
        case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>;
        case 'ordered-list':
            return <ol {...attributes}>{children}</ol>;
        case 'heading-one':
            return <h1 {...attributes}>{children}</h1>;
        case 'heading-two':
            return <h2 {...attributes}>{children}</h2>;
        case 'heading-three':
            return <h3 {...attributes}>{children}</h3>;
        case 'heading-four':
            return <h4 {...attributes}>{children}</h4>;
        case 'heading-five':
            return <h5 {...attributes}>{children}</h5>;
        case 'heading-six':
            return <h6 {...attributes}>{children}</h6>;
        case 'list-item':
        case 'ordered-list-item':
            return <li {...attributes}>{children}</li>;
        case 'separator':
            return <hr {...attributes} />;
        default:
            return next();
    }
};

const renderMark = (props, editor, next) => {
    const { attributes, children, mark } = props;

    switch (mark.type) {
        case 'bold':
            return <strong {...attributes}>{children}</strong>;
        case 'emphasis':
            return <em {...attributes}>{children}</em>;
        case 'underline':
            return <u {...attributes}>{children}</u>;
        case 'strike':
            return <strike {...attributes}>{children}</strike>;
        case 'code':
            return <code {...attributes}>{children}</code>;
        case 'anchor':
            return <a {...attributes}>{children}</a>;
        default:
            return next();
    }
};

const onKeyDown = (event, editor, next) => {
    if (event.ctrlKey || event.metaKey) {
        const mark = getMarkType(event.key);

        if (mark) {
            event.preventDefault();
            return editor.toggleMark(mark);
        }
    }

    switch (event.key) {
        case ' ':
            return onSpace(event, editor, next);
        case 'Backspace':
            return onBackspace(event, editor, next);
        case 'Enter':
            return onEnter(event, editor, next);
        default:
            return next();
    }
};

const onSpace = (event, editor, next) => {
    const { value } = editor;
    const { selection, startBlock } = value;

    if (selection.isExpanded) return next();

    const { start } = selection;
    const chars = startBlock.text.slice(0, start.offset).replace(/\s*/g, '');
    const type = getType(chars);

    if (!type) return next();
    if (type === 'list-item' && startBlock.type === 'list-item') return next();

    event.preventDefault();

    if (type === 'separator') {
        editor
            .moveFocusToStartOfNode(startBlock)
            .delete()
            .setBlocks({ type: 'separator' })
            .insertBlock('paragraph');
    } else {
        editor.setBlocks(type);

        if (type === 'list-item') {
            editor.wrapBlock('bulleted-list');
        }

        if (type === 'ordered-list-item') {
            editor.wrapBlock('ordered-list');
        }

        editor.moveFocusToStartOfNode(startBlock).delete();
    }
};

const onBackspace = (event, editor, next) => {
    const { value } = editor;
    const { selection } = value;

    if (selection.isExpanded) return next();
    if (selection.start.offset !== 0) return next();

    const { startBlock } = value;

    if (startBlock.type === 'paragraph') return next();

    event.preventDefault();
    editor.setBlocks('paragraph');

    if (startBlock.type === 'list-item') {
        editor.unwrapBlock('bulleted-list');
    }

    if (startBlock.type === 'ordered-list-item') {
        editor.unwrapBlock('ordered-list');
    }
};

const onEnter = (event, editor, next) => {
    const { value } = editor;
    const { selection, startBlock } = value;
    const { start, end, isExpanded } = selection;

    if (isExpanded) return next();
    if (start.offset === 0 && startBlock.text.length === 0)
        return onBackspace(event, editor, next);
    if (end.offset !== startBlock.text.length) return next();

    if (
        startBlock.type !== 'heading-one' &&
        startBlock.type !== 'heading-two' &&
        startBlock.type !== 'heading-three' &&
        startBlock.type !== 'heading-four' &&
        startBlock.type !== 'heading-five' &&
        startBlock.type !== 'heading-six' &&
        startBlock.type !== 'block-quote' &&
        startBlock.type !== 'separator'
    ) {
        return next();
    }

    event.preventDefault();
    editor.splitBlock().setBlocks('paragraph');
};

const schema = {
    blocks: {
        separator: {
            isVoid: true,
        },
        image: {
            isVoid: true,
        },
    },
};

const Editor = forwardRef(({ onChange, value }, ref) => {
    const editorRef = useRef(null);
    const className = useStyles(styles);

    useEffect(() => KeyUtils.resetGenerator(), []);

    useImperativeHandle(ref, () => ({
        toggleMark: mark => editorRef.current.toggleMark(mark),
    }));

    return (
        <SlateEditor
            ref={editorRef}
            className={className}
            defaultValue={value}
            onKeyDown={onKeyDown}
            renderBlock={renderBlock}
            renderMark={renderMark}
            schema={schema}
            onChange={value => onChange(value)}
            autoFocus
            spellCheck
        />
    );
});

export default Editor;
