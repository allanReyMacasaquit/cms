import { db } from '@/app/db';
import { eq } from 'drizzle-orm';
import { dashboard } from '@/app/schema';
import DashboardSettings from '../components/dashboard-settings';

interface Props {
	params: typeof dashboard.$inferSelect;
}

const DashBoardFormIdPage = async ({ params }: Props) => {
	const { id } = await params;
	const data = await db.query.dashboard.findFirst({
		where: eq(dashboard.id, id), // Use the correct field name from the schema
	});

	const initialData = data
		? {
				id: data.id,
				storeId: data.storeId,
				label: data.label,
				imageUrl: data.imageUrl,
				createdAt: data.createdAt || null,
				updatedAt: data.updatedAt || null,
			}
		: {
				id: '',
				storeId: '',
				label: '',
				imageUrl: '',
				createdAt: null,
				updatedAt: null,
			};

	return (
		<div>
			<div className='space-y-4 p-8'>
				<DashboardSettings initialData={initialData} />
			</div>
		</div>
	);
};

export default DashBoardFormIdPage;
