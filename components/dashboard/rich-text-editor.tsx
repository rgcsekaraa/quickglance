'use client';

import type React from 'react';

import { useState } from 'react';
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

  const handleFormatChange = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: string[]
  ) => {
    setFormats(newFormats);

    // This is a simplified implementation
    // In a real app, you would apply the formatting to the selected text
    // For demo purposes, we're just showing the toolbar UI
  };

  // In a real implementation, you would use a proper rich text editor library
  // like Quill, TinyMCE, or Draft.js. This is a simplified version for demo purposes.
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

          <IconButton size="small">
            <Code fontSize="small" />
          </IconButton>
          <IconButton size="small">
            <FormatQuote fontSize="small" />
          </IconButton>
        </Toolbar>

        <Box
          component="textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          sx={{
            width: '100%',
            height: 'calc(100% - 48px)',
            minHeight: '150px',
            p: 2,
            border: 'none',
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            backgroundColor: 'transparent',
          }}
          placeholder="Enter your answer here..."
        />
      </Paper>
      {error && helperText && (
        <FormHelperText error>{helperText}</FormHelperText>
      )}
    </Box>
  );
}
