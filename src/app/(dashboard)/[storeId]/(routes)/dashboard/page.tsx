import Dashboard from '@/app/(dashboard)/components/dashboard';
import { db } from '@/app/db';
import { dashboard } from '@/app/schema';
import { eq } from 'drizzle-orm';
import { DashboardColumn } from './[dashboardId]/columns';
import { format } from 'date-fns';

const DashboardPage = async ({ params }: { params: { storeId: string } }) => {
	const { storeId } = await params;
	const data = await db.query.dashboard.findMany({
		where: eq(dashboard.storeId, storeId),
	});

	const formattedData: DashboardColumn[] = data.map((item) => ({
		id: item.id,
		label: item.label,
		createdAt: item.createdAt ? format(item.createdAt, 'MMM do, yyyy') : 'N/A',
	}));
	return (
		<div>
			<div className='flex-1 space-y-4 p-8'>
				<Dashboard data={formattedData} />
			</div>
		</div>
	);
};
export default DashboardPage;
