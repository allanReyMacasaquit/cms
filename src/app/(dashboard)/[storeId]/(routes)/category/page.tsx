import { db } from '@/app/db';
import { category } from '@/app/schema';
import { and, eq } from 'drizzle-orm';

import { format } from 'date-fns';
import { CategoryColumn } from './columns';
import Category from '@/app/(dashboard)/components/category';

const CategoryPage = async ({
	params,
}: {
	params: { storeId: string; dashboardId: string };
}) => {
	const { storeId, dashboardId } = await params;

	const data = await db.query.category.findMany({
		where: and(
			eq(category.storeId, storeId),
			eq(category.dashboardId, dashboardId)
		),
		with: {
			dashboard: true,
		},
	});

	const formattedData: CategoryColumn[] = data.map((item) => ({
		id: item.id,
		name: item.name,
		label: item.dashboard.label,
		createdAt: item.createdAt ? format(item.createdAt, 'MMM do, yyyy') : 'N/A',
	}));
	return (
		<div>
			<div className='flex-1 space-y-4 p-8'>
				<Category data={formattedData} />
			</div>
		</div>
	);
};
export default CategoryPage;
