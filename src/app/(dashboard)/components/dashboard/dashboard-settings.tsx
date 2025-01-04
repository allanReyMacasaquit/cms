'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { SelectDashboard } from '@/app/schema';
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
import ImageUpload from '@/components/image-upload';
import { Textarea } from '@/components/ui/textarea';

// Zod Schema
const settingsSchema = z.object({
	label: z.string().nonempty('Name is required'),
	description: z.string().max(255, 'Text cannot exceed 100 characters'),
	imageUrl: z.string().nonempty('Image is Required'),
});

type DashboardFormValues = z.infer<typeof settingsSchema>;

interface Props {
	initialData: SelectDashboard;
}

// Settings Form Component
const DashboardSettings = ({ initialData }: Props) => {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [dashboardData, setDashboardData] = useState(initialData);
	const params = useParams();
	const router = useRouter();

	const title = dashboardData.storeId ? 'Edit Dashboard' : 'Create Dashboard';

	const form = useForm<DashboardFormValues>({
		resolver: zodResolver(settingsSchema),
		defaultValues: dashboardData || {
			label: '',
			description: '',
			imageUrl: '',
		},
	});

	useEffect(() => {
		const fetchDashboard = async () => {
			if (params.dashboardId) {
				setLoading(true);
				try {
					const response = await axios.get(
						`/api/${params.storeId}/dashboard/${params.dashboardId}`
					);
					setDashboardData(response.data);
					form.reset(response.data);
					router.refresh();
				} catch (error) {
					if (error) toast.error('Failed to fetch dashboard data.');
					router.push(`/${params.storeId}/dashboard`);
				} finally {
					setLoading(false);
				}
			} else {
				console.warn('No dashboard ID provided.');
				toast.error('No dashboard ID provided.');
			}
		};
		fetchDashboard();
	}, [params.dashboardId, params.storeId, form, router]);

	const onSubmit = async (data: DashboardFormValues) => {
		setLoading(true);
		try {
			if (dashboardData.storeId) {
				// Update Dashboard
				await axios.patch(
					`/api/${params.storeId}/dashboard/${params.dashboardId}`,
					data
				);
				toast.success('Dashboard updated successfully.');
				router.push(`/${params.storeId}/dashboard`);
				router.refresh();
			} else {
				// Create New Dashboard
				await axios.post(`/api/${params.storeId}/dashboard`, data);
				toast.success('New dashboard created successfully.');
				router.push(`/${params.storeId}/dashboard`);
				router.refresh();
			}
		} catch (error) {
			console.error('Failed to save dashboard:', error);
			toast.error('An error occurred while saving the dashboard.');
		} finally {
			setLoading(false);
		}
	};

	// Delete Dashboard
	const onDelete = async () => {
		setLoading(true);
		try {
			const response = await axios.delete(
				`/api/${params.storeId}/dashboard/${params.dashboardId}`
			);
			if (response.status === 200) {
				toast.success('Dashboard deleted successfully');
				router.refresh();
				router.push('/');
			} else {
				toast.error('Error deleting dashboard:', response.data);
			}
		} catch (error) {
			if (error)
				toast.error(
					'An error occurred while deleting the dashboard. Delete all Categories first!'
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

				{dashboardData.storeId && (
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
							name='imageUrl'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Upload Image</FormLabel>
									<FormControl>
										<ImageUpload
											disabled={loading}
											onChange={(url) => field.onChange(url)}
											value={field.value ? [field.value] : []}
											onRemove={() => field.onChange('')}
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
										<Input {...field} />
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
										<Textarea {...field} />
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

export default DashboardSettings;
