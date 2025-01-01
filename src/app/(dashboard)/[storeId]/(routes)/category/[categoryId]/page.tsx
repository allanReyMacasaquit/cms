import { db } from '@/app/db';
import { eq } from 'drizzle-orm';

import { category, dashboard } from '@/app/schema';
import CategorySettings from '@/app/(dashboard)/components/category/category-settings';

interface Props {
	params: {
		storeId: string;
	};
}

const CategoryFormIdPage = async ({ params }: Props) => {
	const { storeId } = await params;

	const categoryData = await db.query.category.findFirst({
		where: eq(category.storeId, storeId),
	});

	const initialData = categoryData
		? {
				id: categoryData.id,
				name: categoryData.name,
				storeId: categoryData.storeId,
				dashboardId: categoryData.dashboardId,
				createdAt: categoryData.createdAt || null,
				updatedAt: categoryData.updatedAt || null,
			}
		: {
				id: '',
				name: '',
				storeId: '',
				dashboardId: '',
				createdAt: null,
				updatedAt: null,
			};

	const dashboardData = await db.query.dashboard.findMany({
		where: eq(dashboard.storeId, storeId),
	});

	return (
		<div>
			<div className='space-y-4 p-8'>
				<CategorySettings dashboard={dashboardData} initialData={initialData} />
			</div>
		</div>
	);
};

export default CategoryFormIdPage;
