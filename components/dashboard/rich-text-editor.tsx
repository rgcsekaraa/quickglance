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
import { marked } from 'marked';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to wrap selected text with Markdown syntax
  const wrapSelectedText = (prefix: string, suffix: string = prefix) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.slice(start, end);
    const newText =
      value.slice(0, start) + prefix + selectedText + suffix + value.slice(end);

    onChange(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  // Handle toolbar button clicks
  const handleFormatChange = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: string[]
  ) => {
    setFormats(newFormats);
    if (textareaRef.current) {
      textareaRef.current.focus();
      if (newFormats.includes('bold')) {
        wrapSelectedText('**');
      }
      if (newFormats.includes('italic')) {
        wrapSelectedText('*');
      }
      if (newFormats.includes('underlined')) {
        wrapSelectedText('<u>', '</u>');
      }
      if (newFormats.includes('bullet')) {
        wrapSelectedText('- ');
      }
      if (newFormats.includes('numbered')) {
        wrapSelectedText('1. ');
      }
      if (newFormats.includes('left')) {
        wrapSelectedText('<div style="text-align: left;">', '</div>');
      }
      if (newFormats.includes('center')) {
        wrapSelectedText('<div style="text-align: center;">', '</div>');
      }
      if (newFormats.includes('right')) {
        wrapSelectedText('<div style="text-align: right;">', '</div>');
      }
    }
  };

  // Handle code and quote buttons
  const applyCodeFormat = () => {
    wrapSelectedText('```\n', '\n```');
  };

  const applyQuoteFormat = () => {
    wrapSelectedText('> ');
  };

  // Convert Markdown to HTML for preview
  const htmlPreview = marked(value || '', { breaks: true });

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
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100% - 48px)',
          }}
        >
          <Box
            component="textarea"
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            sx={{
              width: '100%',
              minHeight: '100px',
              p: 2,
              border: 'none',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              backgroundColor: 'transparent',
            }}
            placeholder="Enter your answer here (use Markdown, e.g., **bold**, *italic*)..."
          />
          <Box
            sx={{
              p: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'grey.50',
              overflowY: 'auto',
            }}
            dangerouslySetInnerHTML={{ __html: htmlPreview }}
          />
        </Box>
      </Paper>
      {error && helperText && (
        <FormHelperText error>{helperText}</FormHelperText>
      )}
    </Box>
  );
}
