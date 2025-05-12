"use client"

import { useState } from "react"
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, Box, Typography, Badge } from "@mui/material"
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
} from "@mui/icons-material"
import CategoryActions from "./category-actions"

export interface Category {
  id: string
  name: string
  subcategories?: Category[]
}

interface CategoryTreeProps {
  categories: Category[]
  level?: number
  totalCount?: number
  onEditCategory?: (id: string, newName: string) => void
  onDeleteCategory?: (id: string) => void
  onAddSubcategory?: (parentId: string, name: string) => void
}

export default function CategoryTree({
  categories,
  level = 0,
  totalCount,
  onEditCategory,
  onDeleteCategory,
  onAddSubcategory,
}: CategoryTreeProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  // Count total categories including subcategories
  const countAllCategories = (cats: Category[]): number => {
    let count = cats.length
    for (const cat of cats) {
      if (cat.subcategories && cat.subcategories.length > 0) {
        count += countAllCategories(cat.subcategories)
      }
    }
    return count
  }

  const calculatedTotalCount = totalCount !== undefined ? totalCount : countAllCategories(categories)

  // Get category path for a given category
  const getCategoryPath = (category: Category, cats: Category[], currentPath: string[] = []): string[] => {
    for (const cat of cats) {
      const newPath = [...currentPath, cat.name]
      if (cat.id === category.id) {
        return newPath
      }
      if (cat.subcategories && cat.subcategories.length > 0) {
        const foundPath = getCategoryPath(category, cat.subcategories, newPath)
        if (foundPath.length > 0) {
          return foundPath
        }
      }
    }
    return []
  }

  if (level === 0) {
    return (
      <>
        <ListItem sx={{ mt: 2, mb: 1 }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ fontWeight: 600, textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.1em" }}
          >
            Categories <Badge badgeContent={calculatedTotalCount} color="primary" sx={{ ml: 1 }} />
          </Typography>
        </ListItem>
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            level={level}
            isExpanded={expandedCategories[category.id] || false}
            toggleCategory={toggleCategory}
            allCategories={categories}
            onEditCategory={onEditCategory}
            onDeleteCategory={onDeleteCategory}
            onAddSubcategory={onAddSubcategory}
          />
        ))}
      </>
    )
  }

  return (
    <>
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          level={level}
          isExpanded={expandedCategories[category.id] || false}
          toggleCategory={toggleCategory}
          allCategories={categories}
          onEditCategory={onEditCategory}
          onDeleteCategory={onDeleteCategory}
          onAddSubcategory={onAddSubcategory}
        />
      ))}
    </>
  )
}

interface CategoryItemProps {
  category: Category
  level: number
  isExpanded: boolean
  toggleCategory: (id: string) => void
  allCategories: Category[]
  onEditCategory?: (id: string, newName: string) => void
  onDeleteCategory?: (id: string) => void
  onAddSubcategory?: (parentId: string, name: string) => void
}

function CategoryItem({
  category,
  level,
  isExpanded,
  toggleCategory,
  allCategories,
  onEditCategory,
  onDeleteCategory,
  onAddSubcategory,
}: CategoryItemProps) {
  const hasSubcategories = category.subcategories && category.subcategories.length > 0

  // Get category path
  const getCategoryPath = (cat: Category, cats: Category[], currentPath: string[] = []): string[] => {
    for (const c of cats) {
      const newPath = [...currentPath, c.name]
      if (c.id === cat.id) {
        return newPath
      }
      if (c.subcategories && c.subcategories.length > 0) {
        const foundPath = getCategoryPath(cat, c.subcategories, newPath)
        if (foundPath.length > 0) {
          return foundPath
        }
      }
    }
    return [cat.name]
  }

  const categoryPath = getCategoryPath(category, allCategories)

  return (
    <Box key={category.id}>
      <ListItem
        disablePadding
        sx={{
          pl: level * 1.5,
        }}
      >
        <ListItemButton
          onClick={() => toggleCategory(category.id)}
          sx={{
            borderRadius: "8px",
            mb: 0.5,
            pl: 2,
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            {hasSubcategories ? (
              isExpanded ? (
                <FolderOpenIcon fontSize="small" />
              ) : (
                <FolderIcon fontSize="small" />
              )
            ) : (
              <FolderIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText
            primary={category.name}
            primaryTypographyProps={{
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          />
          {hasSubcategories &&
            (isExpanded ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />)}
        </ListItemButton>

        {onEditCategory && onDeleteCategory && onAddSubcategory && (
          <CategoryActions
            categoryId={category.id}
            categoryName={category.name}
            categoryPath={categoryPath}
            onEdit={onEditCategory}
            onDelete={onDeleteCategory}
            onAddSubcategory={onAddSubcategory}
          />
        )}
      </ListItem>

      {hasSubcategories && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <CategoryTree
            categories={category.subcategories || []}
            level={level + 1}
            onEditCategory={onEditCategory}
            onDeleteCategory={onDeleteCategory}
            onAddSubcategory={onAddSubcategory}
          />
        </Collapse>
      )}
    </Box>
  )
}
