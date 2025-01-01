'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { size } from '@/app/schema';
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

type SizeFormValues = z.infer<typeof settingsSchema>;

interface Props {
	initialData: typeof size.$inferSelect;
}

// Settings Form Component
const SizeSettings = ({ initialData }: Props) => {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [sizeData, setSizeData] = useState(initialData);
	const params = useParams();
	const router = useRouter();

	const title = sizeData.storeId ? 'Edit Size' : 'Create Size';

	const form = useForm<SizeFormValues>({
		resolver: zodResolver(settingsSchema),
		defaultValues: sizeData || {
			name: '',
			value: '',
		},
	});

	useEffect(() => {
		const fetchSize = async () => {
			if (params.sizeId) {
				setLoading(true);
				try {
					const response = await axios.get(
						`/api/${params.storeId}/size/${params.sizeId}`
					);
					setSizeData(response.data);
					form.reset(response.data);
					router.refresh();
				} catch (error) {
					if (error) toast.error('Failed to fetch size data.');
					router.push(`/${params.storeId}/size`);
				} finally {
					setLoading(false);
				}
			} else {
				toast.error('No size ID provided.');
			}
		};
		fetchSize();
	}, [params.sizeId, params.storeId, form, router]);

	const onSubmit = async (data: SizeFormValues) => {
		setLoading(true);
		try {
			if (sizeData.storeId) {
				await axios.patch(`/api/${params.storeId}/size/${params.sizeId}`, data);
				toast.success('Size updated successfully.');
				router.refresh();
				router.push(`/${params.storeId}/size`);
			} else {
				// Create New Size
				await axios.post(`/api/${params.storeId}/size`, data);
				toast.success('New size created successfully.');
				router.refresh();
				router.push(`/${params.storeId}/size`);
			}
		} catch (error) {
			if (error) toast.error('An error occurred while saving the size.');
		} finally {
			setLoading(false);
		}
	};

	// Delete Size
	const onDelete = async () => {
		setLoading(true);
		try {
			const response = await axios.delete(
				`/api/${params.storeId}/size/${params.sizeId}`
			);
			if (response.status === 200) {
				toast.success('Size deleted successfully');
				router.refresh();
				router.push('/');
			} else {
				toast.error('Error deleting size:', response.data);
			}
		} catch (error) {
			if (error)
				toast.error(
					'An error occurred while deleting the size. Delete all related items first!'
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

				{sizeData.storeId && (
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
									<FormLabel>Value</FormLabel>
									<FormControl>
										<Input placeholder='Enter Value' {...field} />
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

export default SizeSettings;
