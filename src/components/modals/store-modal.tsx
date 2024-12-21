import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/modal';
import { useStoreModal } from '@/hooks/use-store-modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const formSchema = z.object({
	name: z.string().min(1),
});

export const StoreModal = () => {
	const storeModal = useStoreModal();

	const [loading, setLoading] = useState(false);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			setLoading(true);
			const res = await axios.post('/api/stores', values);
			console.log(res.data);
			toast.success('Store created');
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong');
		} finally {
			setLoading(false);
		}

		console.log(values);
		storeModal.onClose();
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
									<Input disabled={loading} placeholder='E-Shop' {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<div className='flex items-center justify-between mt-4'>
						<Button
							disabled={loading}
							variant='outline'
							onClick={storeModal.onClose}
						>
							Cancel
						</Button>
						<Button
							disabled={loading}
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
