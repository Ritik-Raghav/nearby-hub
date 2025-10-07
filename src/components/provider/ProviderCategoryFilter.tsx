import React from "react";
import { CategoryFilter } from "@/components/CategoryFilter";

interface ProviderCategoryFilterProps {
	selectedCategory: string;
	onCategoryChange: (value: string) => void;
}

export const ProviderCategoryFilter = ({
	selectedCategory,
	onCategoryChange,
}: ProviderCategoryFilterProps) => {
	return (
		<CategoryFilter
			selectedCategory={selectedCategory}
			onCategoryChange={onCategoryChange}
		/>
	);
};



