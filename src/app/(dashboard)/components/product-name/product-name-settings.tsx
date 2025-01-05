'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { SelectProductName } from '@/app/schema';
import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Save, Trash } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
	Form,
	FormControl,
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

// Zod Schema
const settingsSchema = z.object({
	name: z.string().nonempty('Name is required'),
	value: z.string().nonempty('Value is Required'),
});

type ProductNameFormValues = z.infer<typeof settingsSchema>;

interface Props {
	initialData: SelectProductName;
}

// Settings Form Component
const ProductNameSettings = ({ initialData }: Props) => {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [productNameData, setProductNameData] = useState(initialData);
	const params = useParams();
	const router = useRouter();

	const title = productNameData.storeId
		? 'Edit Product-Name'
		: 'Create Product-Name';

	const form = useForm<ProductNameFormValues>({
		resolver: zodResolver(settingsSchema),
		defaultValues: productNameData || {
			name: '',
			value: '',
		},
	});

	useEffect(() => {
		const fetchProductName = async () => {
			if (params.productNameId) {
				setLoading(true);
				try {
					const response = await axios.get(
						`/api/${params.storeId}/product-name/${params.productNameId}`
					);
					setProductNameData(response.data);
					form.reset(response.data);
					router.refresh();
				} catch (error) {
					if (error) toast.error('Failed to fetch product name data.');
					router.push(`/${params.storeId}/product-name`);
				} finally {
					setLoading(false);
				}
			} else {
				toast.error('No Product Name ID provided.');
			}
		};
		fetchProductName();
	}, [params.storeId, form, router, params.productNameId]);

	const onSubmit = async (data: ProductNameFormValues) => {
		setLoading(true);
		try {
			if (productNameData.storeId) {
				await axios.patch(
					`/api/${params.storeId}/product-name/${params.productNameId}`,
					data
				);
				toast.success('product-name updated successfully.');
				router.refresh();
				router.push(`/${params.storeId}/product-name`);
			} else {
				// Create New product-name
				await axios.post(`/api/${params.storeId}/product-name`, data);
				toast.success('New product-name created successfully.');
				router.refresh();
				router.push(`/${params.storeId}/product-name`);
			}
		} catch (error) {
			if (error)
				toast.error('An error occurred while saving the product-name.');
		} finally {
			setLoading(false);
		}
	};

	// Delete Product name
	const onDelete = async () => {
		setLoading(true);
		try {
			const response = await axios.delete(
				`/api/${params.storeId}/product-name/${params.productNameId}`
			);
			if (response.status === 200) {
				toast.success('Product name deleted successfully');
				router.refresh();
				router.push('/');
			} else {
				toast.error('Error deleting Product name:', response.data);
			}
		} catch (error) {
			if (error)
				toast.error('An error occurred while deleting the Product name!');
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

				{productNameData.storeId && (
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
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder='Enter Name' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='value'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Input placeholder='Enter description' {...field} />
									</FormControl>
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

export default ProductNameSettings;
