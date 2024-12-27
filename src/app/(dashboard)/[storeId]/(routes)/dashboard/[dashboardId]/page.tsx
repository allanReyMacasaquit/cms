import { db } from '@/app/db';
import DashboardForm from '../components/dashboard-settings';
import { eq } from 'drizzle-orm';
import { dashboard } from '@/app/schema';

interface Props {
	params: typeof dashboard.$inferSelect;
}

const DashBoardFormIdPage = async ({ params }: Props) => {
	const { id } = await params;
	const data = await db.query.dashboard.findFirst({
		where: eq(dashboard.id, id), // Use the correct field name from the schema
	});

	// Handle the case where no data is found (e.g., display a message or redirect)
	if (!data) {
		return (
			<div className='max-w-5xl mx-auto space-y-4 p-8'>
				Dashboard not found.
			</div>
		); // Or handle it differently
	}

	const initialData = {
		id: data.id,
		storeId: data.storeId,
		label: data.label,
		imageUrl: data.imageUrl,
		createdAt: data.createdAt || null,
		updatedAt: data.updatedAt || null,
	};

	return (
		<div>
			<div className='space-y-4 p-8'>
				<DashboardForm initialData={initialData} />
			</div>
		</div>
	);
};

export default DashBoardFormIdPage;
