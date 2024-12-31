'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { category, dashboard } from '@/app/schema';
import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Save, Trash } from 'lucide-react';
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
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import AlertModal from '@/components/modals/alert-modal';
import {
	Select,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { SelectContent } from '@radix-ui/react-select';

// Zod Schema
const settingsSchema = z.object({
	name: z.string().nonempty('Name is Required'),
	dashboardId: z.string().nonempty('Dashboard is not selected'),
});

type CategoryFormValues = z.infer<typeof settingsSchema>;

interface Props {
	initialData: typeof category.$inferSelect;
	dashboard: (typeof dashboard.$inferSelect)[];
}

// Settings Form Component
const CategorySettings = ({ initialData, dashboard }: Props) => {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	const params = useParams();
	const router = useRouter();

	const title = initialData.storeId ? 'Edit Category' : 'Create Category';

	const form = useForm<CategoryFormValues>({
		resolver: zodResolver(settingsSchema),
		defaultValues: initialData || {
			name: '',
			dashboardId: '',
		},
	});

	const onSubmit = async (data: CategoryFormValues) => {
		setLoading(true);
		try {
			if (initialData.storeId) {
				// Update Dashboard
				await axios.patch(
					`/api/${params.storeId}/category/${params.categoryId}`,
					data
				);
				toast.success('Dashboard updated successfully.');
				router.push(`/${params.storeId}/category`);
				router.refresh();
			} else {
				// Create New Dashboard
				await axios.post(`/api/${params.storeId}/category`, data);
				toast.success('New Category Created Successfully.');
				router.push(`/${params.storeId}/category`);
				router.refresh();
			}
		} catch (error) {
			console.error('Failed to Save Category:', error);
			toast.error('An error occurred while saving the category.');
		} finally {
			setLoading(false);
		}
	};

	// Delete Dashboard
	const onDelete = async () => {
		setLoading(true);
		try {
			const response = await axios.delete(
				`/api/${params.storeId}/category/${params.categoryId}`
			);
			if (response.status === 200) {
				toast.success('Category deleted successfully');
				router.refresh();
				router.push('/');
			} else {
				toast.error('Error deleting category:', response.data);
			}
		} catch (error) {
			console.error('Failed to delete category:', error);
			toast.error(
				'An error occurred while deleting the category. Make sure no products associated to this category.'
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

				{initialData.storeId && (
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
					<div className=' flex justify-end mb-12'>
						<Button
							type='submit'
							disabled={loading}
							className='bg-gradient-to-r from-blue-500 to-purple-600 mt-8'
						>
							{loading ? (
								'Saving...'
							) : (
								<p className='flex items-center'>
									<Save />{' '}
									<span className='hidden md:flex ml-2'>Save Changes</span>
								</p>
							)}
						</Button>
					</div>
					<Separator className='mb-10' />
					<div className='md:flex items-center justify-between'>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder='Category Name...' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='dashboardId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Dashboard</FormLabel>
									<div>
										<Select
											value={field.value}
											onValueChange={field.onChange}
											disabled={loading}
										>
											<FormControl>
												<SelectTrigger
													className='w-[310px]'
													aria-expanded={Boolean(field.value)}
												>
													<SelectValue
														defaultValue={field.value}
														placeholder='Select a Dashboard'
													/>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectGroup>
													{dashboard.map((item) => (
														<SelectItem value={item.id} key={item.id}>
															{item.label}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>
					</div>
				</form>
			</Form>
		</>
	);
};

export default CategorySettings;
