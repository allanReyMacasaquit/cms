import { db } from '@/app/db';
import { productName } from '@/app/schema';
import { eq } from 'drizzle-orm';
import { format } from 'date-fns';
import { ProductNameColumn } from './columns';
import ProductName from '@/app/(dashboard)/components/product-name/product-name';

const ProductNamePage = async ({ params }: { params: { storeId: string } }) => {
	const { storeId } = await params;
	const data = await db.query.productName.findMany({
		where: eq(productName.storeId, storeId),
	});

	const formattedData: ProductNameColumn[] = data.map((item) => ({
		id: item.id,
		name: item.name,
		value: item.value,
		createdAt: item.createdAt ? format(item.createdAt, 'MMM do, yyyy') : 'N/A',
	}));

	return (
		<div>
			<div className='flex-1 space-y-4 p-8'>
				<ProductName data={formattedData} />
			</div>
		</div>
	);
};
export default ProductNamePage;
