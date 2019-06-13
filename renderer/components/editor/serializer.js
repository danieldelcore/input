import marked from 'marked';
import Html from 'slate-html-serializer';
import TurndownService from 'turndown';

const BLOCK_TAGS = {
    p: 'paragraph',
    blockquote: 'block-quote',
    pre: 'code-block',
    ul: 'bulleted-list',
    ol: 'ordered-list',
    h1: 'heading-one',
    h2: 'heading-two',
    h3: 'heading-three',
    h4: 'heading-four',
    h5: 'heading-five',
    h6: 'heading-six',
    li: 'list-item',
    ol: 'ordered-list-item',
    hr: 'separator',
};

const MARK_TAGS = {
    em: 'emphasis',
    strong: 'bold',
    u: 'underline',
    code: 'code',
    strike: 'strike',
};

const rules = [
    {
        deserialize(el, next) {
            const type = BLOCK_TAGS[el.tagName.toLowerCase()];

            if (!type) return;

            return {
                object: 'block',
                type: type,
                data: {
                    className: el.getAttribute('class'),
                },
                nodes: next(el.childNodes),
            };
        },
        serialize(obj, children) {
            if (obj.object == 'block') {
                switch (obj.type) {
                    case 'paragraph':
                        return <p>{children}</p>;
                    case 'block-quote':
                        return <blockquote>{children}</blockquote>;
                    case 'code-block':
                        return (
                            <pre>
                                <code>{children}</code>
                            </pre>
                        );
                    case 'bulleted-list':
                        return <ul>{children}</ul>;
                    case 'ordered-list':
                        return <ol>{children}</ol>;
                    case 'heading-one':
                        return <h1>{children}</h1>;
                    case 'heading-two':
                        return <h2>{children}</h2>;
                    case 'heading-three':
                        return <h3>{children}</h3>;
                    case 'heading-four':
                        return <h4>{children}</h4>;
                    case 'heading-five':
                        return <h5>{children}</h5>;
                    case 'heading-six':
                        return <h6>{children}</h6>;
                    case 'list-item':
                    case 'ordered-list-item':
                        return <li>{children}</li>;
                    case 'separator':
                        return <hr />;
                    default:
                        break;
                }
            }
        },
    },
    {
        deserialize(el, next) {
            const type = MARK_TAGS[el.tagName.toLowerCase()];

            if (!type) return;

            return {
                object: 'mark',
                type: type,
                nodes: next(el.childNodes),
            };
        },
        serialize(obj, children) {
            if (obj.object == 'mark') {
                switch (obj.type) {
                    case 'bold':
                        return <strong>{children}</strong>;
                    case 'emphasis':
                        return <em>{children}</em>;
                    case 'underline':
                        return <u>{children}</u>;
                    case 'strike':
                        return <strike>{children}</strike>;
                    case 'code':
                        return <code>{children}</code>;
                    case 'anchor':
                        return <a>{children}</a>;
                }
            }
        },
    },
];

function deserialize(markdown) {
    const serializer = new Html({ rules });
    const tokens = marked.lexer(markdown);
    const html = marked.parser(tokens);

    return serializer.deserialize(html);
}

function serialize(value) {
    const turndownService = new TurndownService();
    const serializer = new Html({ rules });
    const html = serializer.serialize(value);

    return turndownService.turndown(html);
}

export default { deserialize, serialize };
