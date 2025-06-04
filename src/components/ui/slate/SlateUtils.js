import { Text, Transforms, Editor, Element } from 'slate';

// Default empty value for Slate editor
export const createEmptyValue = () => [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

// Convert plain text to Slate value
export const textToSlateValue = (text) => {
  if (!text || text.trim() === '') {
    return createEmptyValue();
  }

  // Split text by line breaks and create paragraphs
  const lines = text.split('\n');
  return lines.map(line => ({
    type: 'paragraph',
    children: [{ text: line }],
  }));
};

// Convert Slate value to plain text (for backward compatibility)
export const slateValueToText = (value) => {
  if (!value || !Array.isArray(value)) {
    return '';
  }

  return value
    .map(node => {
      if (node.type === 'paragraph') {
        return node.children.map(child => child.text || '').join('');
      }
      return '';
    })
    .join('\n');
};

// Convert Slate value to JSON string for storage
export const slateValueToJSON = (value) => {
  if (!value || !Array.isArray(value)) {
    return JSON.stringify(createEmptyValue());
  }
  return JSON.stringify(value);
};

// Convert JSON string to Slate value
export const jsonToSlateValue = (jsonString) => {
  if (!jsonString || jsonString.trim() === '') {
    return createEmptyValue();
  }

  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return createEmptyValue();
  } catch (error) {
    console.error('Error parsing Slate JSON:', error);
    // If it's not JSON, treat it as plain text
    return textToSlateValue(jsonString);
  }
};

// Check if text is formatted
export const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

// Toggle text formatting
export const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

// Check if block is active
export const isBlockActive = (editor, format) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === format,
    })
  );

  return !!match;
};

// Toggle block type
export const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = ['numbered-list', 'bulleted-list'].includes(format);

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      ['numbered-list', 'bulleted-list'].includes(n.type),
    split: true,
  });

  const newProperties = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  };
  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

// Serialize Slate value for display (used by renderer)
export const serialize = (nodes) => {
  return nodes.map(node => serializeNode(node));
};

const serializeNode = (node) => {
  if (Text.isText(node)) {
    let text = node.text;
    if (node.bold) {
      return { type: 'bold', text };
    }
    if (node.italic) {
      return { type: 'italic', text };
    }
    if (node.underline) {
      return { type: 'underline', text };
    }
    return { type: 'text', text };
  }

  const children = node.children ? node.children.map(child => serializeNode(child)) : [];

  switch (node.type) {
    case 'paragraph':
      return { type: 'paragraph', children };
    case 'heading-one':
      return { type: 'heading-one', children };
    case 'heading-two':
      return { type: 'heading-two', children };
    case 'bulleted-list':
      return { type: 'bulleted-list', children };
    case 'numbered-list':
      return { type: 'numbered-list', children };
    case 'list-item':
      return { type: 'list-item', children };
    default:
      return { type: 'paragraph', children };
  }
};
