import { db } from '@/app/db';
import { product } from '@/app/schema';
import { eq } from 'drizzle-orm';
import { format } from 'date-fns';
import { formattedPrice } from '@/lib/utils';
import Product from '@/app/(dashboard)/components/product/product';
import { ProductColumn } from './columns';

const ProductPage = async ({ params }: { params: { storeId: string } }) => {
	const { storeId } = await params;
	const data = await db.query.product.findMany({
		where: eq(product.storeId, storeId),
		with: {
			category: true,
			size: true,
			color: true,
			productName: true,
		},
	});

	const formattedData: ProductColumn[] = data.map((item) => ({
		id: item.id,
		name: item.name,
		priceId: formattedPrice.format(Number(item.price)),
		categoryId: item.category.name,
		productNameId: item.productName.name,
		sizeId: item.size.name,
		colorId: item.color.value,
		isFeatured: item.isFeatured,
		isArchived: item.isArchived,
		createdAt: item.createdAt ? format(item.createdAt, 'MMM do, yyyy') : 'N/A',
	}));
	return (
		<div>
			<div className='flex-1 space-y-4 p-8'>
				<Product data={formattedData} />
			</div>
		</div>
	);
};
export default ProductPage;
