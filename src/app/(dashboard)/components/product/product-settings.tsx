'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
	SelectCategory,
	SelectColor,
	SelectImage,
	SelectProduct,
	SelectSize,
} from '@/app/schema';
import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Save, Trash } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
	Form,
	FormControl,
	FormDescription,
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
import { Checkbox } from '@/components/ui/checkbox';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import ProductUpload from '@/components/product-upload';
import { NextResponse } from 'next/server';

// Zod Schema
const settingsSchema = z.object({
	name: z.string().nonempty('Product Name is required'),
	price: z.coerce.number().min(1, 'Price must be a positive number'),
	categoryId: z.string().min(1, 'Category Name is required'),
	sizeId: z.string().min(1, 'Size is required'),
	colorId: z.string().min(1, 'Color is required'), // Fixed from 'color' to 'colorId' for consistency
	images: z.object({ url: z.string() }).array().nonempty(),
	isFeatured: z.boolean().optional(),
	isArchived: z.boolean().optional(),
});

type ProductFormValues = z.infer<typeof settingsSchema>;

interface Props {
	initialData: SelectProduct & {
		images: SelectImage[];
	};
	category: SelectCategory[];
	size: SelectSize[];
	color: SelectColor[];
}

// Settings Form Component
const ProductSettings = ({ initialData, category, size, color }: Props) => {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [productData, setDashboardData] = useState(initialData);
	const params = useParams();
	const router = useRouter();

	const title = productData.storeId ? 'Edit Product' : 'Create Product';

	const form = useForm<ProductFormValues>({
		resolver: zodResolver(settingsSchema),
		defaultValues: productData
			? { ...initialData, price: parseFloat(String(initialData.price)) }
			: {
					name: '',
					price: 0,
					categoryId: '',
					sizeId: '',
					colorId: '',
					isFeatured: false,
					isArchived: false,
					images: [],
				},
	});

	useEffect(() => {
		const fetchProduct = async () => {
			if (params.productId) {
				setLoading(true);
				try {
					const response = await axios.get(
						`/api/${params.storeId}/product/${params.productId}`
					);
					setDashboardData(response.data);
					form.reset(response.data);
					router.refresh();
				} catch (error) {
					if (error) toast.error('Failed to fetch product data.');
					router.push(`/${params.storeId}/product`);
				} finally {
					setLoading(false);
				}
			} else {
				toast.error('No product ID provided.');
			}
		};
		fetchProduct();
	}, [params.productId, params.storeId, form, router]);

	const onSubmit = async (data: ProductFormValues) => {
		setLoading(true);
		try {
			if (productData.storeId) {
				// Update Dashboard
				const patchUrl = `/api/${params.storeId}/product/${params.productId}`;
				await axios.patch(patchUrl, data);
				toast.success('Product Updated Successfully.');
				router.push(`/${params.storeId}/product`);
				router.refresh();
			} else {
				// Create New Dashboard
				await axios.post(`/api/${params.storeId}/product`, data);
				toast.success('New Product Created Successfully.');
				router.push(`/${params.storeId}/product`);
				router.refresh();
			}
		} catch (error) {
			if (error) toast.error('An error occurred while saving the product.');
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async () => {
		setLoading(true);
		try {
			const response = await axios.delete(
				`/api/${params.storeId}/product/${params.productId}`
			);

			if (response.status === 200) {
				toast.success('Product deleted successfully');
				router.refresh();
				router.push(`/${params.storeId}/product`);
			} else {
				toast.error('Error deleting Product:', response.data);
			}
		} catch (error) {
			console.error('Error occurred during product deletion:', error);
			toast.error('An error occurred while deleting the product.');
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

				{productData.storeId && (
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

					<FormField
						control={form.control}
						name='images'
						render={({ field }) => {
							const parsedValue = field.value.map((image) => {
								try {
									const parsedUrl = JSON.parse(image.url).url;
									return { ...image, url: parsedUrl };
								} catch (error) {
									if (error) NextResponse.json('ERROR');
									return image;
								}
							});

							return (
								<FormItem>
									<FormLabel>Upload Image</FormLabel>

									<FormControl>
										<ProductUpload
											value={parsedValue}
											disabled={loading}
											onChange={(url) =>
												field.onChange([...field.value, { url }])
											}
											onRemove={(url) =>
												field.onChange(
													field.value.filter((current) => current.url !== url)
												)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10 '>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder='Product Name' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='price'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Price</FormLabel>
									<FormControl>
										<Input
											type='number'
											placeholder='9.99'
											{...field}
											value={field.value || ''}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='categoryId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>
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
														placeholder='Select a Category'
													/>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectGroup>
													{category.map((item) => (
														<SelectItem value={item.id} key={item.id}>
															{item.name}
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

						<FormField
							control={form.control}
							name='sizeId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Size</FormLabel>
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
														placeholder='Select a Size'
													/>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectGroup>
													{size.map((item) => (
														<SelectItem value={item.id} key={item.id}>
															{item.name}
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

						<FormField
							control={form.control}
							name='colorId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Color</FormLabel>
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
														placeholder='Select a Color'
													/>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectGroup>
													{color.map((item) => (
														<SelectItem value={item.id} key={item.id}>
															{item.name}
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

						<FormField
							control={form.control}
							name='isFeatured'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Featured</FormLabel>
									<div className='flex place-items-center'>
										<Checkbox
											className='mr-2'
											checked={field.value}
											onCheckedChange={field.onChange}
										/>

										<FormDescription>
											This product will be featured on the homepage.
										</FormDescription>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='isArchived'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Archived</FormLabel>
									<div className='flex place-items-center'>
										<Checkbox
											className='mr-2'
											checked={field.value}
											onCheckedChange={field.onChange}
										/>

										<FormDescription>
											If checked, this product will be hidden from the store.
										</FormDescription>
									</div>
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

export default ProductSettings;
