import React, {
    useRef,
    forwardRef,
    useState,
    useEffect,
    useImperativeHandle,
} from 'react';
import { KeyUtils, Value } from 'slate';
import { Editor as SlateEditor } from 'slate-react';
import { useStyles, styleCollector } from 'trousers';

import schema from './schema';
import { getMarkType, renderMark } from './marks';
import { renderBlock } from './blocks';
import plugins from './plugins-config';

const styles = styleCollector('editor').element`
        width: 100%;
        height: 100%;
        position: absolute;
        padding: 20px;
    `;

const onBackspace = (event, editor, next) => {
    const { value } = editor;
    const { selection, startBlock } = value;

    if (selection.isExpanded) return next();
    if (selection.start.offset !== 0) return next();
    if (startBlock.type === 'paragraph') return next();

    event.preventDefault();
    editor.setBlocks('paragraph');
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
        startBlock.type !== 'code-block'
    ) {
        return next();
    }

    event.preventDefault();
    editor.splitBlock().setBlocks('paragraph');
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
        case 'Backspace':
            return onBackspace(event, editor, next);
        case 'Enter':
            return onEnter(event, editor, next);
        default:
            return next();
    }
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
            value={value}
            onKeyDown={onKeyDown}
            renderBlock={renderBlock}
            renderMark={renderMark}
            schema={schema}
            plugins={plugins}
            onChange={change => onChange(change)}
            autoFocus
            spellCheck
        />
    );
});

export default Editor;
