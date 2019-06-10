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

const onKeyDown = (event, editor, next) => {
    if (event.ctrlKey || event.metaKey) {
        const mark = getMarkType(event.key);

        if (mark) {
            event.preventDefault();
            return editor.toggleMark(mark);
        }
    }

    return next();
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
            plugins={plugins}
            onChange={change => onChange(change)}
            autoFocus
            spellCheck
        />
    );
});

export default Editor;
