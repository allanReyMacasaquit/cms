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

interface Props {
	initialData: typeof store.$inferSelect;
}

// Zod Schema
const settingsSchema = z.object({
	name: z.string().nonempty('Name is required'),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const SettingsForm = ({ initialData }: Props) => {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	const form = useForm<SettingsFormValues>({
		resolver: zodResolver(settingsSchema),
		defaultValues: {
			name: initialData.name || '',
		},
	});

	const onSubmit = async (data: SettingsFormValues) => {
		setLoading(true);
		try {
			console.log('Form submitted:', data);
			// Add logic to update the database here
		} catch (error) {
			console.error('Failed to update settings:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className='flex items-center justify-between'>
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
			<Separator />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
					<div className='grid md:grid-cols-3 gap-8'>
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
		</>
	);
};

export default SettingsForm;
