'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import isHotkey from 'is-hotkey';
import {
  toggleMark,
  toggleBlock,
  isMarkActive,
  isBlockActive,
  jsonToSlateValue,
  slateValueToJSON,
  textToSlateValue,
} from './SlateUtils';

// Hotkeys for formatting
const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
};

// Toolbar button component
const ToolbarButton = ({ active, onMouseDown, children, title }) => (
  <button
    type="button"
    title={title}
    className={`px-2 py-1 text-sm border border-gray-300 hover:bg-gray-100 transition-colors ${
      active ? 'bg-gray-200 text-gray-900' : 'bg-white text-gray-600'
    }`}
    onMouseDown={onMouseDown}
  >
    {children}
  </button>
);

// Toolbar component
const Toolbar = ({ editor }) => (
  <div className="flex gap-1 p-2 border-b border-gray-200 bg-gray-50">
    {/* Text formatting */}
    <ToolbarButton
      active={isMarkActive(editor, 'bold')}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, 'bold');
      }}
      title="Bold (Ctrl+B)"
    >
      <strong>B</strong>
    </ToolbarButton>
    
    <ToolbarButton
      active={isMarkActive(editor, 'italic')}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, 'italic');
      }}
      title="Italic (Ctrl+I)"
    >
      <em>I</em>
    </ToolbarButton>
    
    <ToolbarButton
      active={isMarkActive(editor, 'underline')}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, 'underline');
      }}
      title="Underline (Ctrl+U)"
    >
      <u>U</u>
    </ToolbarButton>

    <div className="w-px bg-gray-300 mx-1" />

    {/* Block formatting */}
    <ToolbarButton
      active={isBlockActive(editor, 'heading-one')}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, 'heading-one');
      }}
      title="Heading 1"
    >
      H1
    </ToolbarButton>
    
    <ToolbarButton
      active={isBlockActive(editor, 'heading-two')}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, 'heading-two');
      }}
      title="Heading 2"
    >
      H2
    </ToolbarButton>

    <div className="w-px bg-gray-300 mx-1" />

    {/* Lists */}
    <ToolbarButton
      active={isBlockActive(editor, 'bulleted-list')}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, 'bulleted-list');
      }}
      title="Bullet List"
    >
      •
    </ToolbarButton>
    
    <ToolbarButton
      active={isBlockActive(editor, 'numbered-list')}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, 'numbered-list');
      }}
      title="Numbered List"
    >
      1.
    </ToolbarButton>
  </div>
);

// Element renderer
const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'heading-one':
      return (
        <h1 {...attributes} className="text-xl font-bold mb-2">
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 {...attributes} className="text-lg font-semibold mb-2">
          {children}
        </h2>
      );
    case 'bulleted-list':
      return (
        <ul {...attributes} className="list-disc pl-6 mb-2">
          {children}
        </ul>
      );
    case 'numbered-list':
      return (
        <ol {...attributes} className="list-decimal pl-6 mb-2">
          {children}
        </ol>
      );
    case 'list-item':
      return (
        <li {...attributes} className="mb-1">
          {children}
        </li>
      );
    default:
      return (
        <p {...attributes} className="mb-2">
          {children}
        </p>
      );
  }
};

// Leaf renderer for text formatting
const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

// Main SlateEditor component
const SlateEditor = ({ value, onChange, placeholder = "Enter description..." }) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  
  // Convert input value to Slate format
  const slateValue = useMemo(() => {
    if (typeof value === 'string') {
      // Try to parse as JSON first, fallback to plain text
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed;
        }
        return textToSlateValue(value);
      } catch {
        return textToSlateValue(value);
      }
    }
    return value || [{ type: 'paragraph', children: [{ text: '' }] }];
  }, [value]);

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  const handleChange = (newValue) => {
    // Convert Slate value to JSON string for storage
    const jsonValue = slateValueToJSON(newValue);
    onChange(jsonValue);
  };

  const handleKeyDown = (event) => {
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event)) {
        event.preventDefault();
        const mark = HOTKEYS[hotkey];
        toggleMark(editor, mark);
      }
    }
  };

  return (
    <div className="border border-gray-300 rounded-md bg-white focus-within:ring-1 focus-within:ring-emerald-500 focus-within:border-emerald-500">
      <Slate editor={editor} initialValue={slateValue} onValueChange={handleChange}>
        <Toolbar editor={editor} />
        <div className="p-3">
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            className="min-h-[120px] focus:outline-none text-sm"
          />
        </div>
      </Slate>
    </div>
  );
};

export default SlateEditor;
