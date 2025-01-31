import { db } from '@/app/db';
import { eq } from 'drizzle-orm';
import { dashboard, SelectDashboard } from '@/app/schema';
import DashboardSettings from '@/app/(dashboard)/components/dashboard/dashboard-settings';

interface Props {
	params: SelectDashboard;
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
				description: data.description,
				imageUrl: data.imageUrl,
				createdAt: data.createdAt || null,
				updatedAt: data.updatedAt || null,
			}
		: {
				id: '',
				storeId: '',
				label: '',
				description: '',
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
