import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/modal';
import { useStoreModal } from '@/hooks/use-store-modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';

const formSchema = z.object({
	name: z.string().min(1),
});

export const StoreModal = () => {
	const storeModal = useStoreModal(); // Assuming you have a custom hook for managing modal state

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		// Handle form submission, e.g., send data to server
		console.log(values);
		storeModal.onClose(); // Close the modal after successful submission
	};

	return (
		<Modal
			title='Create store'
			description='Add a new store to manage products and categories'
			isOpen={storeModal.isOpen}
			onClose={storeModal.onClose}
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input placeholder='E-Shop' {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<div className='flex items-center justify-between mt-4'>
						<Button variant='outline' onClick={storeModal.onClose}>
							Cancel
						</Button>
						<Button
							className='bg-gradient-to-r from-blue-500 to-purple-600'
							type='submit'
						>
							Continue
						</Button>
					</div>
				</form>
			</Form>
		</Modal>
	);
};
