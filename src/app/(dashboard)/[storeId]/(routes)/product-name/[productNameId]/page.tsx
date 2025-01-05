import { db } from '@/app/db';
import { eq } from 'drizzle-orm';
import { productName, SelectProductName } from '@/app/schema';
import ProductNameSettings from '@/app/(dashboard)/components/product-name/product-name-settings';

interface Props {
	params: SelectProductName;
}

const ProductNameFormIdPage = async ({ params }: Props) => {
	const { id } = await params;
	const data = await db.query.size.findFirst({
		where: eq(productName.id, id),
	});

	const initialData = data
		? {
				id: data.id,
				storeId: data.storeId,
				name: data.name,
				value: data.value,
				createdAt: data.createdAt || null,
				updatedAt: data.updatedAt || null,
			}
		: {
				id: '',
				storeId: '',
				name: '',
				value: '',
				createdAt: null,
				updatedAt: null,
			};

	return (
		<div>
			<div className='space-y-4 p-8'>
				<ProductNameSettings initialData={initialData} />
			</div>
		</div>
	);
};

export default ProductNameFormIdPage;
