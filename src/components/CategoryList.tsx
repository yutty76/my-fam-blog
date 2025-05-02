"use client";
import React from 'react';
import Link from 'next/link';
import { CategoryType } from '../types';

interface CategoryListProps {
  categories: CategoryType[];
  currentCategoryId?: string;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, currentCategoryId }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => (
        <Link 
          key={category.id} 
          href={`/category/${category.id}`}
          className={`py-2 px-4 rounded-full transition duration-200 ${
            currentCategoryId === category.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
