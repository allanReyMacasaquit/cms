'use client';

import CellAction from '@/app/(dashboard)/components/cell-action';
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
		header: 'Label',
		cell: ({ row }) => row.original.label,
	},
	{
		accessorKey: 'createdAt',
		header: 'Date',
	},
	{
		id: 'actions',
		header: '',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
