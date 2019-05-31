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
import { getBlockType, renderBlock } from './blocks';

const styles = styleCollector('editor').element`
        width: 100%;
        height: 100%;
        position: absolute;
        padding: 20px;
    `;

const onKeyDown = (event, editor, next) => {
    if (event.ctrlKey || event.metaKey) {
        const mark = getMarkType(event.key);

        if (mark) {
            event.preventDefault();
            return editor.toggleMark(mark);
        }
    }

    switch (event.key) {
        // case ' ':
        //     return onSpace(event, editor, next);
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

    const chars = startBlock.text
        .slice(0, selection.start.offset)
        .replace(/\s*/g, '');
    const type = getBlockType(chars);

    if (!type) return next();
    if (type === 'list-item' && startBlock.type === 'list-item') return next();

    event.preventDefault();

    if (type === 'separator' || type === 'image') {
        editor
            .moveFocusToStartOfNode(startBlock)
            .delete()
            .setBlocks({ type })
            .insertBlock('paragraph');

        return next();
    }

    editor.setBlocks(type);

    if (type === 'list-item') {
        editor.wrapBlock('bulleted-list');
    }

    if (type === 'ordered-list-item') {
        editor.wrapBlock('ordered-list');
    }

    editor.moveFocusToStartOfNode(startBlock).delete();
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

const InlineTypedMarkDetectorPlugin = options => {
    return {
        onKeyDown: (event, editor, next) => {
            console.log('EEEEEEEEEEEEEEEEEEEEEEE');

            if (event.key !== ' ') return next();

            console.log('KHAJSDHSADDKHKJDASHKDSHSHDKJKJA');

            const { text } = editor.value.startBlock;

            if (/`+.+`/.test(str)) {
                console.log('hAKSJDHASJKDHAS');
            }
            // get range of match
            // renderMarker at range
        },
    };
};

const plugins = [...InlineTypedMarkDetectorPlugin];

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
            plugins={plugins}
            schema={schema}
            onChange={value => onChange(value)}
            autoFocus
            spellCheck
        />
    );
});

export default Editor;
