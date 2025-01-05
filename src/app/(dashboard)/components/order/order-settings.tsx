'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { SelectOrder } from '@/app/schema';
import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Save, Trash } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import AlertModal from '@/components/modals/alert-modal';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

// Zod Schema
const settingsSchema = z.object({
	phone: z.string().nonempty('Phone is required'),
	address: z.string().max(255, 'Address cannot exceed 255 characters'),
	isPaid: z.boolean(),
});

type OrderFormValues = z.infer<typeof settingsSchema>;

interface Props {
	initialData: SelectOrder;
}

// Settings Form Component
const OrderSettings = ({ initialData }: Props) => {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [orderData, setOrderData] = useState(initialData);
	const params = useParams();
	const router = useRouter();

	const title = orderData.storeId ? 'Edit Order' : 'Create Order';

	const form = useForm<OrderFormValues>({
		resolver: zodResolver(settingsSchema),
		defaultValues: orderData || {
			phone: '',
			address: '',
			isPaid: false,
		},
	});

	useEffect(() => {
		const fetchOrder = async () => {
			if (params.orderId) {
				setLoading(true);
				try {
					const response = await axios.get(
						`/api/${params.storeId}/order/${params.orderId}`
					);
					setOrderData(response.data);
					form.reset(response.data);
					router.refresh();
				} catch (error) {
					if (error) toast.error('Failed to fetch order data.');
					router.push(`/${params.storeId}/order`);
				} finally {
					setLoading(false);
				}
			} else {
				console.warn('No order ID provided.');
				toast.error('No order ID provided.');
			}
		};
		fetchOrder();
	}, [params.orderId, params.storeId, form, router]);

	const onSubmit = async (data: OrderFormValues) => {
		setLoading(true);
		try {
			if (orderData.storeId) {
				// Update Order
				await axios.patch(
					`/api/${params.storeId}/order/${params.orderId}`,
					data
				);
				toast.success('Order updated successfully.');
				router.push(`/${params.storeId}/order`);
				router.refresh();
			} else {
				// Create New Order
				await axios.post(`/api/${params.storeId}/order`, data);
				toast.success('New order created successfully.');
				router.push(`/${params.storeId}/order`);
				router.refresh();
			}
		} catch (error) {
			console.error('Failed to save order:', error);
			toast.error('An error occurred while saving the order.');
		} finally {
			setLoading(false);
		}
	};

	// Delete Order
	const onDelete = async () => {
		setLoading(true);
		try {
			const response = await axios.delete(
				`/api/${params.storeId}/order/${params.orderId}`
			);
			if (response.status === 200) {
				toast.success('Order deleted successfully');
				router.refresh();
				router.push('/');
			} else {
				toast.error('Error deleting order:', response.data);
			}
		} catch (error) {
			if (error)
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
				loading={loading}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
			/>

			<div className='flex items-center justify-between max-w-5xl mx-auto'>
				<Heading title={title} description='' />

				{orderData.storeId && (
					<Button
						disabled={loading}
						variant='destructive'
						size='sm'
						onClick={() => setOpen(true)}
					>
						<Trash className='size-3' />
					</Button>
				)}
			</div>
			<Separator className='max-w-5xl mx-auto' />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='max-w-5xl mx-auto'
				>
					<div className='flex items-center justify-end mb-12'>
						<Button
							type='submit'
							disabled={loading}
							className='bg-gradient-to-r from-blue-500 to-purple-600 mt-8'
						>
							{loading ? (
								'Saving...'
							) : (
								<p className='flex items-center'>
									<Save />
									<span className='ml-2'>Save Changes</span>
								</p>
							)}
						</Button>
					</div>
					<Separator className='mb-10' />
					<div className='flex-col items-center md:grid-cols-3 gap-8 space-y-8'>
						<FormField
							control={form.control}
							name='phone'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='address'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Address</FormLabel>
									<FormControl>
										<Textarea {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='isPaid'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Paid</FormLabel>
									<div className='flex place-items-center'>
										<Checkbox
											className='mr-2'
											checked={field.value}
											onCheckedChange={field.onChange}
										/>

										<FormDescription>This product is paid.</FormDescription>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</form>
			</Form>
		</>
	);
};

export default OrderSettings;
