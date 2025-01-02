'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { SelectColor } from '@/app/schema';
import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Check, Save, Trash } from 'lucide-react';
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
import {
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import Sketch from '@uiw/react-color-sketch';

// Zod Schema
const settingsSchema = z.object({
	name: z.string().nonempty('Name is required'),
	value: z
		.string()
		.min(4)
		.regex(/^#[0-9A-Fa-f]{6}$/, {
			message: 'Must be a valid 6-character hex code (e.g., #FFFFFF)',
		}),
});

type ColorFormValues = z.infer<typeof settingsSchema>;

interface Props {
	initialData: SelectColor;
}

// Settings Form Component
const SizeSettings = ({ initialData }: Props) => {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [hex, setHex] = useState('#fff');
	const [colorData, setColorData] = useState(initialData);
	const params = useParams();
	const router = useRouter();

	const title = colorData.storeId ? 'Edit Color' : 'Create Color';

	const form = useForm<ColorFormValues>({
		resolver: zodResolver(settingsSchema),
		defaultValues: colorData || {
			name: '',
			value: '',
		},
	});

	useEffect(() => {
		const fetchColor = async () => {
			if (params.colorId) {
				setLoading(true);
				try {
					const response = await axios.get(
						`/api/${params.storeId}/color/${params.colorId}`
					);
					setColorData(response.data);
					form.reset(response.data);
					router.refresh();
				} catch (error) {
					if (error) toast.error('Failed to fetch color data.');
					router.push(`/${params.storeId}/color`);
				} finally {
					setLoading(false);
				}
			} else {
				toast.error('No color ID provided.');
			}
		};
		fetchColor();
	}, [params.colorId, params.storeId, form, router]);

	const onSubmit = async (data: ColorFormValues) => {
		setLoading(true);
		try {
			if (colorData.storeId) {
				await axios.patch(
					`/api/${params.storeId}/color/${params.colorId}`,
					data
				);
				toast.success('Size updated successfully.');
				router.refresh();
				router.push(`/${params.storeId}/color`);
			} else {
				// Create New Size
				await axios.post(`/api/${params.storeId}/color`, data);
				toast.success('New color created successfully.');
				router.refresh();
				router.push(`/${params.storeId}/color`);
			}
		} catch (error) {
			if (error) toast.error('An error occurred while saving the color.');
		} finally {
			setLoading(false);
		}
	};

	// Delete Size
	const onDelete = async () => {
		setLoading(true);
		try {
			const response = await axios.delete(
				`/api/${params.storeId}/color/${params.colorId}`
			);
			if (response.status === 200) {
				toast.success('Color deleted successfully');
				router.refresh();
				router.push('/');
			} else {
				toast.error('Error deleting color:', response.data);
			}
		} catch (error) {
			if (error)
				toast.error(
					'An error occurred while deleting the color. Delete all related items first!'
				);
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleColorChange = (color: any) => {
		setHex(color.hex);
		form.setValue('value', color.hex);
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

				{colorData.storeId && (
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
									<FormLabel>Hex Color</FormLabel>
									{hex === '#fff' ? (
										''
									) : (
										<span className='flex items-center'>
											{hex} selected (<Check className='text-green-500' />)
										</span>
									)}
									<FormControl>
										<Select>
											<SelectTrigger>
												<SelectValue
													defaultValue={field.value}
													placeholder='Select a Color'
													className='w-[310px]'
													aria-expanded={Boolean(field.value)}
												/>
											</SelectTrigger>
											<SelectContent>
												<div>
													<Sketch
														style={{ marginLeft: 20 }}
														color={hex}
														onChange={handleColorChange}
													/>
												</div>
											</SelectContent>
										</Select>
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
