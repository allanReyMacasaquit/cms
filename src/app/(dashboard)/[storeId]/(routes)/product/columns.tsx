'use client';

import ProductCellAction from '@/app/(dashboard)/components/product/product-cell-action';
import { ColumnDef } from '@tanstack/react-table';

export type ProductColumn = {
	id: string;
	name: string;
	priceId: string;
	categoryId: string;
	productNameId: string;
	sizeId: string;
	colorId: string;
	isFeatured: boolean;
	isArchived: boolean;
	createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
	{
		accessorKey: 'name',
		header: 'Store Name',
	},
	{
		accessorKey: 'productNameId',
		header: 'Product Name',
	},
	{
		accessorKey: 'categoryId',
		header: 'Category',
	},
	{
		accessorKey: 'priceId',
		header: 'Price',
	},

	{
		accessorKey: 'sizeId',
		header: 'Size',
	},
	{
		accessorKey: 'colorId',
		header: 'Color',
		cell: ({ row }) => (
			<div className='flex items-center gap-x-2'>
				{row.original.colorId}
				<div
					className='size-10 rounded-full border '
					style={{ backgroundColor: row.original.colorId }}
				></div>
			</div>
		),
	},
	{
		accessorKey: 'isFeatured',
		header: 'Featured',
	},
	{
		accessorKey: 'isArchived',
		header: 'Archived',
	},
	{
		accessorKey: 'createdAt',
		header: 'Date',
	},
	{
		id: 'actions',
		header: '',
		cell: ({ row }) => <ProductCellAction data={row.original} />,
	},
];
