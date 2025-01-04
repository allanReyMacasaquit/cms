'use client';

import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import AlertModal from '@/components/modals/alert-modal';
import { ProductColumn } from '../../[storeId]/(routes)/product/columns';

interface Props {
	data: ProductColumn;
}

const ProductCellAction = ({ data }: Props) => {
	const router = useRouter();
	const params = useParams();

	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(data.id);
		toast.success('Product Id copied to the clipboard');
	};
	const handleEdit = () => {
		router.push(`/${params.storeId}/product/${data.id}`);
	};

	const handleDelete = async () => {
		setLoading(true);
		try {
			const response = await axios.delete(
				`/api/${params.storeId}/product/${data.id}`
			);
			if (response.status === 200) {
				toast.success('Product deleted successfully');
				router.refresh();
				router.push(`/${params.storeId}/product`);
			} else {
				toast.error('Error deleting Product:', response.data);
			}
		} catch (error) {
			console.error('Failed to delete Product:', error);
			toast.error(
				'An error occurred while deleting the dashboard. Delete all items first!'
			);
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};

	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={handleDelete}
				loading={loading}
			/>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost'>
						<MoreHorizontal size={16} />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end' className='w-40'>
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<Separator />
					<DropdownMenuItem
						onClick={handleCopy}
						className='hover:cursor-pointer'
					>
						<Copy />
						Copy
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={handleEdit}
						className='hover:cursor-pointer'
					>
						<Edit />
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => setOpen(true)}
						className='hover:cursor-pointer'
					>
						<Trash />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};

export default ProductCellAction;
