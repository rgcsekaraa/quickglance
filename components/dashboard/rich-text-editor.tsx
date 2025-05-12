'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Toolbar,
  IconButton,
  Divider,
  FormHelperText,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  Code,
  FormatQuote,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
} from '@mui/icons-material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  error,
  helperText,
}: RichTextEditorProps) {
  const [formats, setFormats] = useState<string[]>([]);

  // Initialize Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
        codeBlock: { HTMLAttributes: { class: 'tiptap-code-block' } },
        blockquote: { HTMLAttributes: { class: 'tiptap-blockquote' } },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
      }),
    ],
    content: value || '<p></p>',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    immediatelyRender: false,
  });

  // Handle toolbar button clicks
  const handleFormatChange = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: string[]
  ) => {
    setFormats(newFormats);
    if (editor) {
      editor.chain().focus();
      newFormats.forEach((format) => {
        if (format === 'bold') {
          editor.chain().focus().toggleBold().run();
        } else if (format === 'italic') {
          editor.chain().focus().toggleItalic().run();
        } else if (format === 'underlined') {
          editor.chain().focus().toggleUnderline().run();
        } else if (format === 'bullet') {
          editor.chain().focus().toggleBulletList().run();
        } else if (format === 'numbered') {
          editor.chain().focus().toggleOrderedList().run();
        } else if (format === 'left') {
          editor.chain().focus().setTextAlign('left').run();
        } else if (format === 'center') {
          editor.chain().focus().setTextAlign('center').run();
        } else if (format === 'right') {
          editor.chain().focus().setTextAlign('right').run();
        }
      });
    }
  };

  // Handle code and quote buttons
  const applyCodeFormat = () => {
    if (editor) {
      editor.chain().focus().toggleCodeBlock().run();
    }
  };

  const applyQuoteFormat = () => {
    if (editor) {
      editor.chain().focus().toggleBlockquote().run();
    }
  };

  // Update editor content when value prop changes
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '<p></p>');
    }
  }, [value, editor]);

  if (!editor) {
    return null; // Prevent rendering until editor is ready
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Paper
        variant="outlined"
        sx={{
          minHeight: 200,
          border: error ? '1px solid red' : undefined,
        }}
      >
        <Toolbar
          variant="dense"
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            flexWrap: 'wrap',
          }}
        >
          <ToggleButtonGroup
            value={formats}
            onChange={handleFormatChange}
            aria-label="text formatting"
          >
            <ToggleButton value="bold" aria-label="bold">
              <FormatBold fontSize="small" />
            </ToggleButton>
            <ToggleButton value="italic" aria-label="italic">
              <FormatItalic fontSize="small" />
            </ToggleButton>
            <ToggleButton value="underlined" aria-label="underlined">
              <FormatUnderlined fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>

          <Divider flexItem orientation="vertical" sx={{ mx: 1 }} />

          <ToggleButtonGroup
            value={formats}
            onChange={handleFormatChange}
            aria-label="list formatting"
          >
            <ToggleButton value="bullet" aria-label="bullet list">
              <FormatListBulleted fontSize="small" />
            </ToggleButton>
            <ToggleButton value="numbered" aria-label="numbered list">
              <FormatListNumbered fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>

          <Divider flexItem orientation="vertical" sx={{ mx: 1 }} />

          <ToggleButtonGroup
            value={formats}
            onChange={handleFormatChange}
            aria-label="text alignment"
          >
            <ToggleButton value="left" aria-label="align left">
              <FormatAlignLeft fontSize="small" />
            </ToggleButton>
            <ToggleButton value="center" aria-label="align center">
              <FormatAlignCenter fontSize="small" />
            </ToggleButton>
            <ToggleButton value="right" aria-label="align right">
              <FormatAlignRight fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>

          <Divider flexItem orientation="vertical" sx={{ mx: 1 }} />

          <IconButton size="small" onClick={applyCodeFormat}>
            <Code fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={applyQuoteFormat}>
            <FormatQuote fontSize="small" />
          </IconButton>
        </Toolbar>

        <EditorContent
          editor={editor}
          style={{
            width: '100%',
            minHeight: '150px',
            padding: '16px',
            border: 'none',
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            backgroundColor: 'transparent',
          }}
        />
      </Paper>
      {error && helperText && (
        <FormHelperText error>{helperText}</FormHelperText>
      )}
    </Box>
  );
}
