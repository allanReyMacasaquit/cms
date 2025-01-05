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
import { OrderColumn } from '../../[storeId]/(routes)/order/columns';
import { Separator } from '@/components/ui/separator';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import AlertModal from '@/components/modals/alert-modal';

interface Props {
	data: OrderColumn;
}

const OrderCellAction = ({ data }: Props) => {
	const router = useRouter();
	const params = useParams();

	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(data.id);
		toast.success('Order Id copied to the clipboard');
	};
	const handleEdit = () => {
		router.push(`/${params.storeId}/order/${data.id}`);
	};

	const handleDelete = async () => {
		setLoading(true);
		try {
			const response = await axios.delete(
				`/api/${params.storeId}/order/${data.id}`
			);
			if (response.status === 200) {
				toast.success('Order deleted successfully');
				router.refresh();
				router.push(`/${params.storeId}/order`);
			} else {
				toast.error('Error deleting order:', response.data);
			}
		} catch (error) {
			console.error('Failed to delete order:', error);
			toast.error(
				'An error occurred while deleting the order. Delete all Categories first!'
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

export default OrderCellAction;
