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
  Skeleton, // Add Skeleton import
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import QuestionAccordion from '@/components/dashboard/question-accordion';
import CreateModal from '@/components/dashboard/create-modal';
import { createClient } from '@/utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import type { Question } from '@/lib/types';
import type { Category } from '@/lib/types';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [questionsData, setQuestionsData] = useState<Question[]>([]);
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const supabase = createClient();

  // Fetch user ID and initial data, set up real-time subscriptions
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Set loading to true before fetching
        // Get authenticated user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error(
            'Error fetching user:',
            userError?.message || 'No user found'
          );
          window.location.href = '/';
          return;
        }

        setUserId(user.id);

        // Fetch questions for the user
        const { data: questions, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .eq('user_id', user.id);

        if (questionsError) {
          console.error('Error fetching questions:', questionsError.message);
          return;
        }

        setQuestionsData(questions || []);
        setFilteredQuestions(questions || []);

        // Fetch categories for the user
        const { data: categories, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .eq('user_id', user.id);

        if (categoriesError) {
          console.error('Error fetching categories:', categoriesError.message);
          return;
        }

        // Build category tree for hierarchical display
        const buildCategoryTree = (categories: any[]): Category[] => {
          const categoryMap: { [key: string]: Category } = {};
          const tree: Category[] = [];

          categories.forEach((cat) => {
            categoryMap[cat.id] = { ...cat, subcategories: [] };
          });

          categories.forEach((cat) => {
            if (cat.parent_id) {
              categoryMap[cat.parent_id]?.subcategories?.push(
                categoryMap[cat.id]
              );
            } else {
              tree.push(categoryMap[cat.id]);
            }
          });

          return tree;
        };

        setCategoriesData(buildCategoryTree(categories || []));
      } catch (err) {
        console.error('Unexpected error fetching data:', err);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchData();
  }, []);

  // Set up real-time subscriptions for questions and categories
  useEffect(() => {
    if (!userId) return;

    const questionSubscription = supabase
      .channel('questions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'questions',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setQuestionsData((prev) => [...prev, payload.new as Question]);
            setFilteredQuestions((prev) => [...prev, payload.new as Question]);
          } else if (payload.eventType === 'UPDATE') {
            setQuestionsData((prev) =>
              prev.map((q) =>
                q.id === payload.new.id ? (payload.new as Question) : q
              )
            );
            setFilteredQuestions((prev) =>
              prev.map((q) =>
                q.id === payload.new.id ? (payload.new as Question) : q
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setQuestionsData((prev) =>
              prev.filter((q) => q.id !== payload.old.id)
            );
            setFilteredQuestions((prev) =>
              prev.filter((q) => q.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    const categorySubscription = supabase
      .channel('categories')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories',
          filter: `user_id=eq.${userId}`,
        },
        async () => {
          const { data: categories, error } = await supabase
            .from('categories')
            .select('*')
            .eq('user_id', userId);

          if (error) {
            console.error('Error fetching categories:', error.message);
            return;
          }

          const buildCategoryTree = (categories: any[]): Category[] => {
            const categoryMap: { [key: string]: Category } = {};
            const tree: Category[] = [];

            categories.forEach((cat) => {
              categoryMap[cat.id] = { ...cat, subcategories: [] };
            });

            categories.forEach((cat) => {
              if (cat.parent_id) {
                categoryMap[cat.parent_id]?.subcategories?.push(
                  categoryMap[cat.id]
                );
              } else {
                tree.push(categoryMap[cat.id]);
              }
            });

            return tree;
          };

          setCategoriesData(buildCategoryTree(categories || []));
        }
      )
      .subscribe();

    return () => {
      questionSubscription.unsubscribe();
      categorySubscription.unsubscribe();
    };
  }, [userId]);

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
          question.category_path
            .join(' > ')
            .toLowerCase()
            .includes(lowercaseQuery)
      );
      setFilteredQuestions(filtered);
    }
  }, [searchQuery, questionsData]);

  // Open/close create modal
  const handleCreateModalOpen = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
  };

  // Handle creating questions르 or categories
  const handleCreateContent = async (newData: {
    type: 'category' | 'question';
    categoryPath?: string[];
    question?: string;
    answer?: string;
    categoryName?: string;
    parentCategoryId?: string;
  }) => {
    if (!userId) {
      console.error('No user ID available');
      return;
    }

    try {
      if (
        newData.type === 'question' &&
        newData.categoryPath &&
        newData.question &&
        newData.answer
      ) {
        const newQuestion: Question = {
          id: uuidv4(),
          question: newData.question,
          answer: newData.answer,
          category_path: newData.categoryPath,
          user_id: userId,
        };

        const { error } = await supabase
          .from('questions')
          .insert([newQuestion]);

        if (error) {
          console.error('Error inserting question:', error.message);
          return;
        }

        setQuestionsData([...questionsData, newQuestion]);
        setFilteredQuestions([...filteredQuestions, newQuestion]);
      } else if (newData.type === 'category' && newData.categoryName) {
        const newCategory = {
          id: uuidv4(),
          name: newData.categoryName,
          parent_id: newData.parentCategoryId || null,
          user_id: userId,
        };

        const { error } = await supabase
          .from('categories')
          .insert([newCategory]);

        if (error) {
          console.error('Error inserting category:', error.message);
          return;
        }

        // Refresh categories
        const { data: categories, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .eq('user_id', userId);

        if (categoriesError) {
          console.error('Error fetching categories:', categoriesError.message);
          return;
        }

        const buildCategoryTree = (categories: any[]): Category[] => {
          const categoryMap: { [key: string]: Category } = {};
          const tree: Category[] = [];

          categories.forEach((cat) => {
            categoryMap[cat.id] = { ...cat, subcategories: [] };
          });

          categories.forEach((cat) => {
            if (cat.parent_id) {
              categoryMap[cat.parent_id]?.subcategories?.push(
                categoryMap[cat.id]
              );
            } else {
              tree.push(categoryMap[cat.id]);
            }
          });

          return tree;
        };

        setCategoriesData(buildCategoryTree(categories));
      }
    } catch (err) {
      console.error('Unexpected error during create:', err);
    }
  };

  // Handle editing a category
  const handleEditCategory = async (id: string, newName: string) => {
    if (!userId) return;

    try {
      // Update category name
      const { error } = await supabase
        .from('categories')
        .update({ name: newName })
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating category:', error.message);
        return;
      }

      // Update category_path in questions
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('user_id', userId);

      if (questionsError) {
        console.error('Error fetching questions:', questionsError.message);
        return;
      }

      const updatedQuestions = questions.map((question) => {
        const oldCategoryName = categoriesData.find(
          (cat) => cat.id === id
        )?.name;
        const updatedPath = question.category_path.map((path: string) =>
          path === oldCategoryName ? newName : path
        );
        return { ...question, category_path: updatedPath };
      });

      // Update questions in Supabase
      await Promise.all(
        updatedQuestions.map((question) =>
          supabase
            .from('questions')
            .update({ category_path: question.category_path })
            .eq('id', question.id)
            .eq('user_id', userId)
        )
      );

      // Refresh categories
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId);

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError.message);
        return;
      }

      const buildCategoryTree = (categories: any[]): Category[] => {
        const categoryMap: { [key: string]: Category } = {};
        const tree: Category[] = [];

        categories.forEach((cat) => {
          categoryMap[cat.id] = { ...cat, subcategories: [] };
        });

        categories.forEach((cat) => {
          if (cat.parent_id) {
            categoryMap[cat.parent_id]?.subcategories?.push(
              categoryMap[cat.id]
            );
          } else {
            tree.push(categoryMap[cat.id]);
          }
        });

        return tree;
      };

      setCategoriesData(buildCategoryTree(categories));
      setQuestionsData(updatedQuestions);
      setFilteredQuestions(updatedQuestions);
    } catch (err) {
      console.error('Unexpected error during category edit:', err);
    }
  };

  // Handle deleting a category
  const handleDeleteCategory = async (id: string) => {
    if (!userId) return;

    try {
      // Delete category (subcategories are deleted via on delete cascade)
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting category:', error.message);
        return;
      }

      // Delete associated questions
      const categoryName = categoriesData.find((cat) => cat.id === id)?.name;
      if (categoryName) {
        await supabase
          .from('questions')
          .delete()
          .eq('user_id', userId)
          .contains('category_path', [categoryName]);
      }

      // Refresh categories
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId);

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError.message);
        return;
      }

      // Refresh questions
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('user_id', userId);

      if (questionsError) {
        console.error('Error fetching questions:', questionsError.message);
        return;
      }

      const buildCategoryTree = (categories: any[]): Category[] => {
        const categoryMap: { [key: string]: Category } = {};
        const tree: Category[] = [];

        categories.forEach((cat) => {
          categoryMap[cat.id] = { ...cat, subcategories: [] };
        });

        categories.forEach((cat) => {
          if (cat.parent_id) {
            categoryMap[cat.parent_id]?.subcategories?.push(
              categoryMap[cat.id]
            );
          } else {
            tree.push(categoryMap[cat.id]);
          }
        });

        return tree;
      };

      setCategoriesData(buildCategoryTree(categories || []));
      setQuestionsData(questions || []);
      setFilteredQuestions(questions || []);
    } catch (err) {
      console.error('Unexpected error during category delete:', err);
    }
  };

  // Handle adding a subcategory
  const handleAddSubcategory = async (parentId: string, name: string) => {
    if (!userId) return;

    try {
      const newCategory = {
        id: uuidv4(),
        name,
        parent_id: parentId,
        user_id: userId,
      };

      const { error } = await supabase.from('categories').insert([newCategory]);

      if (error) {
        console.error('Error inserting subcategory:', error.message);
        return;
      }

      // Refresh categories
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId);

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError.message);
        return;
      }

      const buildCategoryTree = (categories: any[]): Category[] => {
        const categoryMap: { [key: string]: Category } = {};
        const tree: Category[] = [];

        categories.forEach((cat) => {
          categoryMap[cat.id] = { ...cat, subcategories: [] };
        });

        categories.forEach((cat) => {
          if (cat.parent_id) {
            categoryMap[cat.parent_id]?.subcategories?.push(
              categoryMap[cat.id]
            );
          } else {
            tree.push(categoryMap[cat.id]);
          }
        });

        return tree;
      };

      setCategoriesData(buildCategoryTree(categories));
    } catch (err) {
      console.error('Unexpected error during subcategory add:', err);
    }
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
            {isLoading ? (
              <Skeleton variant="text" width={200} height={60} />
            ) : (
              <Typography
                variant="h1"
                sx={{ fontSize: { xs: '1.5rem', md: '2.5rem' } }}
              >
                Dashboard
              </Typography>
            )}
            {isLoading ? (
              <Skeleton variant="rectangular" width={120} height={40} />
            ) : (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateModalOpen}
                sx={{ height: 40 }}
              >
                Create
              </Button>
            )}
          </Box>

          {isLoading ? (
            <Skeleton variant="rectangular" height={56} sx={{ mb: 4 }} />
          ) : (
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
          )}

          <Box
            sx={{
              mb: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {isLoading ? (
              <Skeleton variant="text" width={150} height={40} />
            ) : (
              <Typography variant="h5">All Questions</Typography>
            )}
            {isLoading ? (
              <Skeleton variant="text" width={100} height={20} />
            ) : (
              <Typography variant="body2" color="text.secondary">
                {filteredQuestions.length} questions
              </Typography>
            )}
          </Box>

          <Box sx={{ mb: 4 }}>
            {isLoading ? (
              // Render skeleton placeholders for questions
              Array.from(new Array(3)).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  height={80}
                  sx={{ mb: 2, borderRadius: 2 }}
                />
              ))
            ) : filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => (
                <QuestionAccordion
                  key={question.id}
                  question={question.question}
                  answer={question.answer}
                  categoryPath={question.category_path}
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

        {isLoading ? (
          <Skeleton
            variant="circular"
            width={56}
            height={56}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              display: { xs: 'flex', md: 'none' },
            }}
          />
        ) : (
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
        )}

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
