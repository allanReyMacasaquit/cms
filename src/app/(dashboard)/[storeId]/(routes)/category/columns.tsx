'use client';

import CategoryCellAction from '@/app/(dashboard)/components/category/category-cell-actions';
import { ColumnDef } from '@tanstack/react-table';

export type CategoryColumn = {
	id: string;
	name: string;
	label: string;
	createdAt: string;
};

export const columns: ColumnDef<CategoryColumn>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'label',
		header: 'Dashbard',
		cell: ({ row }) => row.original.label,
	},
	{
		accessorKey: 'createdAt',
		header: 'Date',
	},
	{
		id: 'actions',
		header: '',
		cell: ({ row }) => <CategoryCellAction data={row.original} />,
	},
];
