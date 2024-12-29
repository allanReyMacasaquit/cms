import Dashboard from '@/app/(dashboard)/components/dashboard';
import { db } from '@/app/db';
import { dashboard } from '@/app/schema';
import { eq } from 'drizzle-orm';

const DashboardPage = async ({ params }: { params: { storeId: string } }) => {
	const { storeId } = await params;
	const data = await db.query.dashboard.findMany({
		where: eq(dashboard.storeId, storeId),
	});
	return (
		<div>
			<div className='flex-1 space-y-4 p-8'>
				<Dashboard data={data} />
			</div>
		</div>
	);
};
export default DashboardPage;
