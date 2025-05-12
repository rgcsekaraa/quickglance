"use client"

import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  FormHelperText,
  Divider,
} from "@mui/material"
import type { Category } from "@/components/dashboard/category-tree"
import RichTextEditor from "@/components/dashboard/rich-text-editor"

interface CreateModalProps {
  open: boolean
  onClose: () => void
  onCreate: (data: any) => void
  categories: Category[]
}

const steps = ["Category Selection", "Question & Answer"]

export default function CreateModal({ open, onClose, onCreate, categories }: CreateModalProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [isNewCategory, setIsNewCategory] = useState(true)
  const [categoryName, setCategoryName] = useState("")
  const [isSubcategory, setIsSubcategory] = useState(false)
  const [parentCategoryId, setParentCategoryId] = useState("")
  const [selectedCategoryPath, setSelectedCategoryPath] = useState<string[]>([])
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [errors, setErrors] = useState({
    categoryName: false,
    categorySelection: false,
    question: false,
    answer: false,
  })

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate category selection
      if (isNewCategory) {
        if (!categoryName.trim()) {
          setErrors({ ...errors, categoryName: true })
          return
        }
      } else {
        if (selectedCategoryPath.length === 0) {
          setErrors({ ...errors, categorySelection: true })
          return
        }
      }
      setActiveStep((prevStep) => prevStep + 1)
    } else if (activeStep === 1) {
      // Validate question and answer
      const newErrors = {
        ...errors,
        question: !question.trim(),
        answer: !answer.trim(),
      }
      setErrors(newErrors)

      if (!newErrors.question && !newErrors.answer) {
        handleCreate()
      }
    }
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const resetForm = () => {
    setActiveStep(0)
    setIsNewCategory(true)
    setCategoryName("")
    setIsSubcategory(false)
    setParentCategoryId("")
    setSelectedCategoryPath([])
    setQuestion("")
    setAnswer("")
    setErrors({
      categoryName: false,
      categorySelection: false,
      question: false,
      answer: false,
    })
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleCreate = () => {
    let categoryPath: string[] = []

    if (isNewCategory) {
      if (isSubcategory && parentCategoryId) {
        // Find parent category path
        const parent = flatCategories.find((cat) => cat.id === parentCategoryId)
        if (parent) {
          categoryPath = [...parent.path, categoryName]
        } else {
          categoryPath = [categoryName]
        }
      } else {
        categoryPath = [categoryName]
      }

      // Create new category first
      onCreate({
        type: "category",
        categoryName,
        parentCategoryId: isSubcategory ? parentCategoryId : undefined,
      })
    } else {
      categoryPath = selectedCategoryPath
    }

    // Then create the question
    onCreate({
      type: "question",
      categoryPath,
      question,
      answer,
    })

    handleClose()
  }

  // Flatten categories for the select dropdown
  const flattenCategories = (
    cats: Category[],
    path: string[] = [],
    result: { id: string; name: string; path: string[] }[] = [],
  ) => {
    cats.forEach((cat) => {
      const currentPath = [...path, cat.name]
      result.push({ id: cat.id, name: cat.name, path: currentPath })
      if (cat.subcategories && cat.subcategories.length > 0) {
        flattenCategories(cat.subcategories, currentPath, result)
      }
    })
    return result
  }

  const flatCategories = flattenCategories(categories)

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Create New Question
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {activeStep === 0 ? "Select or create a category" : "Enter your question and answer"}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ pt: 2, pb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                Choose an option:
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  variant={isNewCategory ? "contained" : "outlined"}
                  onClick={() => setIsNewCategory(true)}
                  sx={{ flex: 1 }}
                >
                  Create New Category
                </Button>
                <Button
                  variant={!isNewCategory ? "contained" : "outlined"}
                  onClick={() => setIsNewCategory(false)}
                  sx={{ flex: 1 }}
                >
                  Use Existing Category
                </Button>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {isNewCategory ? (
              <Box>
                <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                  New Category Details
                </Typography>
                <TextField
                  autoFocus
                  margin="dense"
                  id="category-name"
                  label="Category Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  error={errors.categoryName}
                  helperText={errors.categoryName ? "Category name is required" : ""}
                  sx={{ mb: 3 }}
                />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Is this a subcategory? (Optional)
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                    <Button
                      variant={!isSubcategory ? "contained" : "outlined"}
                      color="primary"
                      onClick={() => setIsSubcategory(false)}
                      size="small"
                    >
                      No, Top-Level Category
                    </Button>
                    <Button
                      variant={isSubcategory ? "contained" : "outlined"}
                      color="primary"
                      onClick={() => setIsSubcategory(true)}
                      size="small"
                    >
                      Yes, Subcategory
                    </Button>
                  </Box>
                </Box>

                {isSubcategory && (
                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <InputLabel id="parent-category-label">Parent Category</InputLabel>
                    <Select
                      labelId="parent-category-label"
                      id="parent-category"
                      value={parentCategoryId}
                      onChange={(e) => setParentCategoryId(e.target.value as string)}
                      label="Parent Category"
                    >
                      {flatCategories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.path.join(" > ")}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Box>
            ) : (
              <Box>
                <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                  Select Existing Category
                </Typography>
                <FormControl fullWidth variant="outlined" error={errors.categorySelection}>
                  <InputLabel id="category-path-label">Category</InputLabel>
                  <Select
                    labelId="category-path-label"
                    id="category-path"
                    value={selectedCategoryPath.length > 0 ? selectedCategoryPath.join(" > ") : ""}
                    onChange={(e) => {
                      const selectedPath = e.target.value as string
                      setSelectedCategoryPath(selectedPath ? selectedPath.split(" > ") : [])
                    }}
                    label="Category"
                  >
                    {flatCategories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.path.join(" > ")}>
                        {cat.path.join(" > ")}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.categorySelection && <FormHelperText>Please select a category</FormHelperText>}
                </FormControl>
              </Box>
            )}
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom fontWeight={500}>
              Question & Answer Details
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              id="question"
              label="Question"
              type="text"
              fullWidth
              variant="outlined"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              error={errors.question}
              helperText={errors.question ? "Question is required" : ""}
              sx={{ mb: 3 }}
            />

            <Typography variant="subtitle1" gutterBottom fontWeight={500}>
              Answer
            </Typography>
            <RichTextEditor
              value={answer}
              onChange={setAnswer}
              error={errors.answer}
              helperText={errors.answer ? "Answer is required" : ""}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Box sx={{ flex: "1 1 auto" }} />
        {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}
        <Button variant="contained" onClick={handleNext}>
          {activeStep === steps.length - 1 ? "Save" : "Next"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
