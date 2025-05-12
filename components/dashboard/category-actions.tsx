"use client"

import type React from "react"

import { useState } from "react"
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material"
import { MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material"

interface CategoryActionsProps {
  categoryId: string
  categoryName: string
  categoryPath: string[]
  onEdit: (id: string, newName: string) => void
  onDelete: (id: string) => void
  onAddSubcategory: (parentId: string, name: string) => void
}

export default function CategoryActions({
  categoryId,
  categoryName,
  categoryPath,
  onEdit,
  onDelete,
  onAddSubcategory,
}: CategoryActionsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState(categoryName)
  const [newSubcategoryName, setNewSubcategoryName] = useState("")
  const [error, setError] = useState(false)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  // Edit Dialog
  const handleEditOpen = () => {
    setNewCategoryName(categoryName)
    setError(false)
    setIsEditDialogOpen(true)
    handleMenuClose()
  }

  const handleEditClose = () => {
    setIsEditDialogOpen(false)
  }

  const handleEditSave = () => {
    if (!newCategoryName.trim()) {
      setError(true)
      return
    }
    onEdit(categoryId, newCategoryName)
    setIsEditDialogOpen(false)
  }

  // Delete Dialog
  const handleDeleteOpen = () => {
    setIsDeleteDialogOpen(true)
    handleMenuClose()
  }

  const handleDeleteClose = () => {
    setIsDeleteDialogOpen(false)
  }

  const handleDeleteConfirm = () => {
    onDelete(categoryId)
    setIsDeleteDialogOpen(false)
  }

  // Add Subcategory Dialog
  const handleAddOpen = () => {
    setNewSubcategoryName("")
    setError(false)
    setIsAddDialogOpen(true)
    handleMenuClose()
  }

  const handleAddClose = () => {
    setIsAddDialogOpen(false)
  }

  const handleAddSave = () => {
    if (!newSubcategoryName.trim()) {
      setError(true)
      return
    }
    onAddSubcategory(categoryId, newSubcategoryName)
    setIsAddDialogOpen(false)
  }

  return (
    <>
      <IconButton
        size="small"
        onClick={handleMenuOpen}
        sx={{
          ml: 1,
          opacity: 0.6,
          "&:hover": { opacity: 1 },
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEditOpen}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleAddOpen}>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add Subcategory</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteOpen}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            error={error}
            helperText={error ? "Category name is required" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={handleDeleteClose}>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{categoryName}"?
            {categoryPath.length > 1 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Path: {categoryPath.join(" > ")}
              </Typography>
            )}
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            This will also delete all subcategories and questions within this category.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Subcategory Dialog */}
      <Dialog open={isAddDialogOpen} onClose={handleAddClose}>
        <DialogTitle>Add Subcategory</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Parent: {categoryPath.join(" > ")}
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Subcategory Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newSubcategoryName}
            onChange={(e) => setNewSubcategoryName(e.target.value)}
            error={error}
            helperText={error ? "Subcategory name is required" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>Cancel</Button>
          <Button onClick={handleAddSave} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
