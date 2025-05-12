export interface Question {
  id: string; // UUIDs are strings
  question: string;
  answer: string;
  category_path: string[];
  user_id: string;
}

export interface Category {
  id: string; // UUIDs are strings
  name: string;
  parent_id?: string | null;
  user_id: string;
  subcategories?: Category[];
}
