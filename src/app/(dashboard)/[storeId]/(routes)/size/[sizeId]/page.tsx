import { db } from '@/app/db';
import { eq } from 'drizzle-orm';
import { size } from '@/app/schema';
import SizeSettings from '@/app/(dashboard)/components/size/size-settings';

interface Props {
	params: typeof size.$inferSelect;
}

const SizeFormIdPage = async ({ params }: Props) => {
	const { id } = await params;
	const data = await db.query.size.findFirst({
		where: eq(size.id, id), // Use the correct field name from the schema
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
				<SizeSettings initialData={initialData} />
			</div>
		</div>
	);
};

export default SizeFormIdPage;
