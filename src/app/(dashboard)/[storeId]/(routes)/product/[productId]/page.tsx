import { db } from '@/app/db';
import { eq } from 'drizzle-orm';
import {
	category,
	color,
	product,
	productName,
	SelectProduct,
	size,
} from '@/app/schema';
import ProductSettings from '@/app/(dashboard)/components/product/product-settings';

interface Props {
	params: SelectProduct;
}

const ProductFormIdPage = async ({ params }: Props) => {
	const { storeId } = await params;
	const data = await db.query.product.findFirst({
		where: eq(product.storeId, storeId),
		with: {
			images: true,
		},
	});

	const initialData = data
		? {
				id: data.id,
				name: data.name,
				price: data.price,
				storeId: data.storeId,
				categoryId: data.categoryId,
				productNameId: data.productNameId,
				sizeId: data.sizeId,
				colorId: data.colorId,
				images: Array.isArray(data.images)
					? data.images.map((img) => ({
							id: img.id,
							url: img.url,
							createdAt: img.createdAt,
							updatedAt: img.updatedAt,
							productId: img.productId,
						}))
					: [],
				isFeatured: data.isFeatured,
				isArchived: data.isArchived,
				createdAt: data.createdAt || null,
				updatedAt: data.updatedAt || null,
			}
		: {
				id: '',
				name: '',
				price: '',
				storeId: '',
				categoryId: '',
				productNameId: '',
				sizeId: '',
				colorId: '',
				images: [],
				isFeatured: false,
				isArchived: false,
				createdAt: null,
				updatedAt: null,
			};

	const categoryData = await db.query.category.findMany({
		where: eq(category.storeId, storeId),
	});

	const ProductNameData = await db.query.productName.findMany({
		where: eq(productName.storeId, storeId),
	});

	const sizeData = await db.query.size.findMany({
		where: eq(size.storeId, storeId),
	});

	const colorData = await db.query.color.findMany({
		where: eq(color.storeId, storeId),
	});

	return (
		<div>
			<div className='space-y-4 p-8'>
				<ProductSettings
					category={categoryData}
					size={sizeData}
					color={colorData}
					productName={ProductNameData}
					initialData={initialData}
				/>
			</div>
		</div>
	);
};

export default ProductFormIdPage;
