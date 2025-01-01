'use client';

import SizeCellAction from '@/app/(dashboard)/components/size/size-cell-action';
import { ColumnDef } from '@tanstack/react-table';

export type SizeColumn = {
	id: string;
	name: string;
	value: string;
	createdAt: string;
};

export const columns: ColumnDef<SizeColumn>[] = [
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
		cell: ({ row }) => <SizeCellAction data={row.original} />,
	},
];
