'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { store } from '@/app/schema';
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
import { ApiAlert } from '@/components/api-alert';
import { useOrigin } from '@/hooks/use-origin';

// Zod Schema
const settingsSchema = z.object({
	name: z.string().nonempty('Name is required'),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface Props {
	initialData: typeof store.$inferSelect;
}

// Settings Form Component
const StoreSettings = ({ initialData }: Props) => {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const params = useParams();
	const router = useRouter();
	const origin = useOrigin();

	const form = useForm<SettingsFormValues>({
		resolver: zodResolver(settingsSchema),
		defaultValues: {
			name: initialData.name || '',
		},
	});

	const onSubmit = async (data: SettingsFormValues) => {
		setLoading(true);
		try {
			const response = await axios.patch(`/api/stores/${params.storeId}`, data);
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
			const response = await axios.delete(`/api/stores/${params.storeId}`);
			if (response.status === 200) {
				toast.success('Store deleted successfully');
				router.refresh();
				router.push(`/${params.storeId}/dashboard`);
			} else {
				toast.error('Error deleting store:', response.data);
			}
		} catch (error) {
			if (error) toast.error('Remove all dashboards before deleting store!');
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
				<Heading title='Settings' description='Manage Store Preferences' />
				<Button
					disabled={loading}
					variant='destructive'
					size='sm'
					onClick={() => setOpen(true)}
				>
					<Trash className='size-3' />
				</Button>
			</div>
			<Separator className='max-w-5xl mx-auto' />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-4 mt-4 max-w-5xl mx-auto'
				>
					<div className='flex md:grid md:grid-cols-3 gap-8'>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
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
					</div>

					<Button
						type='submit'
						disabled={loading}
						className='bg-gradient-to-r from-blue-500 to-purple-600'
					>
						{loading ? 'Saving...' : 'Save Changes'}
					</Button>
				</form>
			</Form>
			<Separator className='max-w-5xl mx-auto' />
			<ApiAlert
				title='NEXT_PUBLIC_API_URL'
				description={`${origin}/api/${params.storeId}`}
				variant='public'
			/>
		</>
	);
};

export default StoreSettings;
