'use client';

import OrderCellAction from '@/app/(dashboard)/components/order/order-cell-actiom';
import { ColumnDef } from '@tanstack/react-table';

export type OrderColumn = {
	id: string;
	phone: string;
	address: string;
	products: string;
	totalPrice: string;
	createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'phone',
		header: 'Phone',
	},
	{
		accessorKey: 'address',
		header: 'Address',
	},
	{
		accessorKey: 'products',
		header: 'Products',
	},
	{
		accessorKey: 'totalPrice',
		header: 'Total Price',
	},
	{
		accessorKey: 'createdAt',
		header: 'Created At',
	},

	{
		id: 'actions',
		header: '',
		cell: ({ row }) => <OrderCellAction data={row.original} />,
	},
];
