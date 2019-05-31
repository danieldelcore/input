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

export { getMarkType, renderMark };
