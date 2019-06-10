function renderMark(mark, content) {
    switch (mark.type) {
        case 'bold':
            return `**${content}**`;
        case 'emphasis':
            return `_${content}_`;
        case 'underline':
            return `<u>${content}</u>`;
        case 'strike':
            return `~~${content}~~`;
        case 'code':
            return `\`${content}\``;
        case 'anchor':
            return `[${content}](${content})`;
        default:
            return content;
    }
}

function renderBlock(node, content) {
    let block = '';

    switch (node.type) {
        case 'paragraph':
            block = `${content}\n`;
            break;
        case 'block-quote':
            block = `> ${content}\n`;
            break;
        case 'code-block':
            block = `\`\`\`${content}\`\`\`\n`;
            break;
        case 'heading-one':
            block = `# ${content}`;
            break;
        case 'heading-two':
            block = `## ${content}`;
            break;
        case 'heading-three':
            block = `### ${content}`;
            break;
        case 'heading-four':
            block = `#### ${content}`;
            break;
        case 'heading-five':
            block = `##### ${content}`;
            break;
        case 'heading-six':
            block = `###### ${content}`;
            break;
        case 'list-item':
            block = `- ${content}`;
            break;
        case 'ordered-list-item':
            block = `1. ${content}`;
            break;
        case 'separator':
            block = `---`;
            break;
        case 'bulleted-list':
        case 'ordered-list':
            block = content;
            break;
        default:
            break;
    }

    return `${block}\n`;
}

function renderNode(currentNode, content) {
    switch (currentNode.object) {
        case 'block':
            return renderBlock(
                currentNode,
                currentNode.nodes.reduce(
                    (accum, node) => `${accum}${renderNode(node)}`,
                    '',
                ),
            );
        case 'text':
            return currentNode.marks.reduce(
                (accum, mark) => renderNode(mark, accum),
                currentNode.text,
            );
        case 'mark':
            return renderMark(currentNode, content);
        default:
            break;
    }
}

module.exports = {
    serialize: ({ nodes }) =>
        nodes.reduce((accum, node) => `${accum}${renderNode(node)}`, ''),
};
