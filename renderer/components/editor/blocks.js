const getBlockType = chars => {
    switch (chars) {
        case '*':
        case '-':
        case '+':
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

export { renderBlock, getBlockType };
