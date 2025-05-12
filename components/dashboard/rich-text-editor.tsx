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
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

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
    // Apply formatting via Quill's API
    const quill = quillRef.current?.getEditor();
    if (quill) {
      newFormats.forEach((format) => {
        if (['bold', 'italic', 'underline'].includes(format)) {
          quill.format(format, !quill.getFormat()[format]);
        } else if (format === 'bullet') {
          quill.format('list', 'bullet');
        } else if (format === 'numbered') {
          quill.format('list', 'ordered');
        } else if (['left', 'center', 'right'].includes(format)) {
          quill.format('align', format === 'left' ? false : format);
        }
      });
    }
  };

  const quillRef = React.useRef<ReactQuill>(null);

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
            <ToggleButton value="underline" aria-label="underlined">
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

          <IconButton
            size="small"
            onClick={() => {
              const quill = quillRef.current?.getEditor();
              quill?.format('code-block', !quill.getFormat()['code-block']);
            }}
          >
            <Code fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              const quill = quillRef.current?.getEditor();
              quill?.format('blockquote', !quill.getFormat()['blockquote']);
            }}
          >
            <FormatQuote fontSize="small" />
          </IconButton>
        </Toolbar>

        <ReactQuill
          ref={quillRef}
          value={value}
          onChange={onChange}
          style={{ height: '150px', border: 'none' }}
          modules={{
            toolbar: false, // Disable Quill's default toolbar
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
