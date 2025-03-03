import Dashboard from '@/app/(dashboard)/components/dashboard/dashboard';
import { db } from '@/app/db';
import { dashboard } from '@/app/schema';
import { eq } from 'drizzle-orm';
import { DashboardColumn } from './columns';
import { format } from 'date-fns';

const DashboardPage = async ({ params }: { params: { storeId: string } }) => {
	const { storeId } = await params;
	const data = await db.query.dashboard.findMany({
		where: eq(dashboard.storeId, storeId),
	});

	const formattedData: DashboardColumn[] = data.map((item) => ({
		id: item.id,
		label: item.label,
		description: item.description,
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
