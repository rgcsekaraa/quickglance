'use client';

import React, { useState, useRef } from 'react';
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
  const editorRef = useRef<HTMLDivElement>(null);

  // Handle toolbar button clicks to apply formatting
  const handleFormatChange = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: string[]
  ) => {
    setFormats(newFormats);
    if (editorRef.current) {
      editorRef.current.focus();
      // Apply each format based on whether it's in newFormats
      if (newFormats.includes('bold')) {
        document.execCommand('bold', false, undefined);
      }
      if (newFormats.includes('italic')) {
        document.execCommand('italic', false, undefined);
      }
      if (newFormats.includes('underlined')) {
        document.execCommand('underline', false, undefined);
      }
      if (newFormats.includes('bullet')) {
        document.execCommand('insertUnorderedList', false, undefined);
      }
      if (newFormats.includes('numbered')) {
        document.execCommand('insertOrderedList', false, undefined);
      }
      if (newFormats.includes('left')) {
        document.execCommand('justifyLeft', false, undefined);
      }
      if (newFormats.includes('center')) {
        document.execCommand('justifyCenter', false, undefined);
      }
      if (newFormats.includes('right')) {
        document.execCommand('justifyRight', false, undefined);
      }
    }
    // Trigger onChange to update the parent component
    handleContentChange();
  };

  // Handle code and quote buttons
  const applyCodeFormat = () => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('formatBlock', false, 'pre');
      handleContentChange();
    }
  };

  const applyQuoteFormat = () => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('formatBlock', false, 'blockquote');
      handleContentChange();
    }
  };

  // Update parent component with the editor's HTML content
  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Initialize editor content when value prop changes
  React.useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

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

        <Box
          ref={editorRef}
          contentEditable
          onInput={handleContentChange}
          sx={{
            width: '100%',
            minHeight: '150px',
            p: 2,
            border: 'none',
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            backgroundColor: 'transparent',
            '&:empty:before': {
              content: '"Enter your answer here..."',
              color: 'grey.500',
            },
          }}
          dangerouslySetInnerHTML={{ __html: value }}
        />
      </Paper>
      {error && helperText && (
        <FormHelperText error>{helperText}</FormHelperText>
      )}
    </Box>
  );
}
