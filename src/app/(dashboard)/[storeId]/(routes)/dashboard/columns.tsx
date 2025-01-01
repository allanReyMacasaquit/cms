'use client';

import DashboardCellAction from '@/app/(dashboard)/components/dashboard/dashboard-cell-action';
import { ColumnDef } from '@tanstack/react-table';

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
		cell: ({ row }) => <DashboardCellAction data={row.original} />,
	},
];
