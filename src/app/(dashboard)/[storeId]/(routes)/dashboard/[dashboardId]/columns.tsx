'use client';

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
];
