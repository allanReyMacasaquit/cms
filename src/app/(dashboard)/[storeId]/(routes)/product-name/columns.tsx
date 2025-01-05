'use client';

import ProductNameCellAction from '@/app/(dashboard)/components/product-name/product-name-cell-action';
import { ColumnDef } from '@tanstack/react-table';

export type ProductNameColumn = {
	id: string;
	name: string;
	value: string;
	createdAt: string;
};

export const columns: ColumnDef<ProductNameColumn>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => row.original.name,
	},
	{
		accessorKey: 'value',
		header: 'Value',
	},
	{
		accessorKey: 'createdAt',
		header: 'Date',
	},
	{
		id: 'actions',
		header: '',
		cell: ({ row }) => <ProductNameCellAction data={row.original} />,
	},
];
