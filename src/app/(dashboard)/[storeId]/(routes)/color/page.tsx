import { db } from '@/app/db';
import { size } from '@/app/schema';
import { eq } from 'drizzle-orm';

import { format } from 'date-fns';

import Color from '@/app/(dashboard)/components/color/color';
import { ColorColumn } from './columns';

const ColorPage = async ({ params }: { params: { storeId: string } }) => {
	const { storeId } = await params;
	const data = await db.query.color.findMany({
		where: eq(size.storeId, storeId),
	});

	const formattedData: ColorColumn[] = data.map((item) => ({
		id: item.id,
		name: item.name,
		value: item.value,
		createdAt: item.createdAt ? format(item.createdAt, 'MMM do, yyyy') : 'N/A',
	}));

	return (
		<div>
			<div className='flex-1 space-y-4 p-8'>
				<Color data={formattedData} />
			</div>
		</div>
	);
};
export default ColorPage;
