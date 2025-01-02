import { db } from '@/app/db';
import { eq } from 'drizzle-orm';
import { SelectColor, color } from '@/app/schema';
import SizeSettings from '@/app/(dashboard)/components/color/color-settings';

interface Props {
	params: SelectColor;
}

const SizeFormIdPage = async ({ params }: Props) => {
	const { id } = await params;
	const data = await db.query.color.findFirst({
		where: eq(color.id, id), // Use the correct field name from the schema
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
