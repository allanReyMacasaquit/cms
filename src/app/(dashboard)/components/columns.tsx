'use client';

import { ColumnDef } from '@tanstack/react-table';
import CellAction from './cell-action';

export type DashboardColumn = {
	id: string;
	label: string;
	createdAt: string;
};

export const columns: ColumnDef<DashboardColumn>[] = [
	{
		accessorKey: 'label',
		header: 'Label',
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
