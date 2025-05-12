'use client';
import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Paper,
  Button,
  Fab,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import QuestionAccordion from '@/components/dashboard/question-accordion';
import CreateModal from '@/components/dashboard/create-modal';
import { questionsData as initialQuestionsData } from '@/lib/dummy-data';
import { categoriesData as initialCategoriesData } from '@/lib/dummy-data';
import type { Question } from '@/lib/dummy-data';
import type { Category } from '@/components/dashboard/category-tree';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [questionsData, setQuestionsData] = useState(initialQuestionsData);
  const [categoriesData, setCategoriesData] = useState(initialCategoriesData);
  const [filteredQuestions, setFilteredQuestions] = useState(questionsData);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter questions based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredQuestions(questionsData);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = questionsData.filter(
        (question) =>
          question.question.toLowerCase().includes(lowercaseQuery) ||
          question.answer.toLowerCase().includes(lowercaseQuery) ||
          question.categoryPath
            .join(' > ')
            .toLowerCase()
            .includes(lowercaseQuery)
      );
      setFilteredQuestions(filtered);
    }
  }, [searchQuery, questionsData]);

  const handleCreateModalOpen = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateContent = (newData: {
    type: 'category' | 'question';
    categoryPath?: string[];
    question?: string;
    answer?: string;
    categoryName?: string;
    parentCategoryId?: string;
  }) => {
    if (
      newData.type === 'question' &&
      newData.categoryPath &&
      newData.question &&
      newData.answer
    ) {
      // Add new question
      const newQuestion: Question = {
        id: `q${questionsData.length + 1}`,
        question: newData.question,
        answer: newData.answer,
        categoryPath: newData.categoryPath,
      };
      setQuestionsData([...questionsData, newQuestion]);
    } else if (newData.type === 'category' && newData.categoryName) {
      // Add new category or subcategory
      const newCategory = {
        id: `cat-${Date.now()}`,
        name: newData.categoryName,
        subcategories: [],
      };

      if (newData.parentCategoryId) {
        // Add as subcategory
        const updatedCategories = addSubcategory(
          categoriesData,
          newData.parentCategoryId,
          newCategory
        );
        setCategoriesData(updatedCategories);
      } else {
        // Add as top-level category
        setCategoriesData([...categoriesData, newCategory]);
      }
    }
  };

  // Helper function to add subcategory
  const addSubcategory = (
    categories: Category[],
    parentId: string,
    newCategory: Category
  ): Category[] => {
    return categories.map((category) => {
      if (category.id === parentId) {
        return {
          ...category,
          subcategories: [...(category.subcategories || []), newCategory],
        };
      }

      if (category.subcategories && category.subcategories.length > 0) {
        return {
          ...category,
          subcategories: addSubcategory(
            category.subcategories,
            parentId,
            newCategory
          ),
        };
      }

      return category;
    });
  };

  // Handle edit category
  const handleEditCategory = (id: string, newName: string) => {
    const updateCategoryName = (categories: Category[]): Category[] => {
      return categories.map((category) => {
        if (category.id === id) {
          return { ...category, name: newName };
        }

        if (category.subcategories && category.subcategories.length > 0) {
          return {
            ...category,
            subcategories: updateCategoryName(category.subcategories),
          };
        }

        return category;
      });
    };

    setCategoriesData(updateCategoryName(categoriesData));

    // Update category path in questions
    setQuestionsData((prevQuestions) => {
      return prevQuestions.map((question) => {
        // This is a simplified approach - in a real app, you'd need more robust path handling
        return question;
      });
    });
  };

  // Handle delete category
  const handleDeleteCategory = (id: string) => {
    // Find and remove the category
    const removeCategory = (categories: Category[]): Category[] => {
      return categories.filter((category) => {
        if (category.id === id) {
          return false;
        }

        if (category.subcategories && category.subcategories.length > 0) {
          category.subcategories = removeCategory(category.subcategories);
        }

        return true;
      });
    };

    setCategoriesData(removeCategory(categoriesData));

    // Remove questions in that category
    // This is a simplified approach - in a real app, you'd need more robust handling
    setQuestionsData((prevQuestions) => {
      return prevQuestions.filter((question) => {
        // Simple filtering - would need improvement in a real app
        return true;
      });
    });
  };

  // Handle add subcategory
  const handleAddSubcategory = (parentId: string, name: string) => {
    const newCategory = {
      id: `cat-${Date.now()}`,
      name,
      subcategories: [],
    };

    const updatedCategories = addSubcategory(
      categoriesData,
      parentId,
      newCategory
    );

    setCategoriesData(updatedCategories);
  };

  return (
    <DashboardLayout
      categoriesData={categoriesData}
      onEditCategory={handleEditCategory}
      onDeleteCategory={handleDeleteCategory}
      onAddSubcategory={handleAddSubcategory}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography
              variant="h1"
              sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}
            >
              Dashboard
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateModalOpen}
              sx={{ height: 40 }}
            >
              Create
            </Button>
          </Box>

          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search questions, answers, or categories..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 4 }}
          />

          {/* Questions Count */}
          <Box
            sx={{
              mb: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5">All Questions</Typography>
            <Typography variant="body2" color="text.secondary">
              {filteredQuestions.length} questions
            </Typography>
          </Box>

          {/* Questions and Answers */}
          <Box sx={{ mb: 4 }}>
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => (
                <QuestionAccordion
                  key={question.id}
                  question={question.question}
                  answer={question.answer}
                  categoryPath={question.categoryPath}
                />
              ))
            ) : (
              <Paper
                elevation={0}
                sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}
              >
                <Typography variant="h6" color="text.secondary">
                  No questions found matching your search.
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Try adjusting your search terms or browse categories in the
                  sidebar.
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>

        {/* Floating Action Button for mobile */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            display: { xs: 'flex', md: 'none' },
          }}
          onClick={handleCreateModalOpen}
        >
          <AddIcon />
        </Fab>

        {/* Create Modal */}
        <CreateModal
          open={isCreateModalOpen}
          onClose={handleCreateModalClose}
          onCreate={handleCreateContent}
          categories={categoriesData}
        />
      </Container>
    </DashboardLayout>
  );
}
