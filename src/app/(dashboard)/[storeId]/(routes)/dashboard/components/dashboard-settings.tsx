'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { dashboard } from '@/app/schema';
import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios from 'axios'; // Import axios
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import AlertModal from '@/components/modals/alert-modal';
import ImageUpload from '@/components/image-upload';
import { Textarea } from '@/components/ui/textarea';

// Zod Schema
const settingsSchema = z.object({
	label: z.string().nonempty('Name is required'),
	description: z.string().optional(),
	imageUrl: z.string().nonempty('Image is Required'),
});

type DashboardFormValues = z.infer<typeof settingsSchema>;

interface Props {
	initialData: typeof dashboard.$inferSelect;
}

// Settings Form Component
const DashboardSettings = ({ initialData }: Props) => {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const params = useParams();
	const router = useRouter();

	const title = !initialData ? 'Edit Dashboard' : 'Create Dashboard';

	const form = useForm<DashboardFormValues>({
		resolver: zodResolver(settingsSchema),
		defaultValues: initialData || {
			label: '',
			description: '',
			imageUrl: '',
		},
	});

	const onSubmit = async (data: DashboardFormValues) => {
		setLoading(true);
		try {
			const response = await axios.patch(
				`/api/dashboard/${params.dashboardId}`,
				data
			);
			router.refresh();
			if (response.status === 200) {
				toast.success('Store updated successfully');
			} else {
				toast.error('Error updating store:', response.data);
			}
		} catch (error) {
			console.error('Failed to update settings:', error);
		} finally {
			setLoading(false);
		}
	};
	// Delete store
	const onDelete = async () => {
		setLoading(true);
		try {
			const response = await axios.delete(`/api/dashboard/${params.storeId}`);
			if (response.status === 200) {
				toast.success('Store deleted successfully');
				router.refresh();
				router.push('/');
			} else {
				toast.error('Error deleting store:', response.data);
			}
		} catch (error) {
			console.error('Failed to delete store:', error);
			toast.error('An error occurred while deleting the store.');
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

				{!initialData && (
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
					<div className='flex-col items-center md:grid-cols-3 gap-8 space-y-8'>
						<FormField
							control={form.control}
							name='imageUrl'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Upload Image</FormLabel>
									<FormControl>
										<ImageUpload
											disabled={loading}
											onChange={(url) => {
												console.log('FormField onChange:', url); // Log the URL change
												field.onChange(url);
											}}
											value={field.value ? [field.value] : []}
											onRemove={() => {
												console.log('FormField onRemove'); // Log the remove action
												field.onChange('');
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='label'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Label</FormLabel>
									<FormControl>
										<Input
											{...field}
											className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className='flex items-center justify-end'>
						<Button
							type='submit'
							disabled={loading}
							className='bg-gradient-to-r from-blue-500 to-purple-600 mt-8'
						>
							{loading ? ' Created' : 'Save Changes'}
						</Button>
					</div>
				</form>
			</Form>
		</>
	);
};

export default DashboardSettings;
