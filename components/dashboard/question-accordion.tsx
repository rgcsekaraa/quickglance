"use client"

import { useState } from "react"
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Divider } from "@mui/material"
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material"

interface QuestionAccordionProps {
  question: string
  answer: string
  categoryPath: string[]
}

export default function QuestionAccordion({ question, answer, categoryPath }: QuestionAccordionProps) {
  const [expanded, setExpanded] = useState(false)

  const handleChange = () => {
    setExpanded(!expanded)
  }

  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
      elevation={0}
      sx={{
        mb: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "8px !important",
        overflow: "hidden",
        "&:before": {
          display: "none",
        },
        "&.Mui-expanded": {
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          borderColor: "primary.main",
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="question-content"
        id="question-header"
        sx={{
          backgroundColor: expanded ? "rgba(0, 0, 0, 0.02)" : "transparent",
          transition: "background-color 0.2s",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {categoryPath.join(" > ")}
            </Typography>
          </Box>
          <Typography variant="body1" fontWeight={500}>
            {question}
          </Typography>
        </Box>
      </AccordionSummary>
      <Divider />
      <AccordionDetails sx={{ p: 3 }}>
        <Typography
          variant="body1"
          component="div"
          sx={{ whiteSpace: "pre-line" }}
          dangerouslySetInnerHTML={{ __html: answer }}
        />
      </AccordionDetails>
    </Accordion>
  )
}
