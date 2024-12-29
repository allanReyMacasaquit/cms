import StoreSettings from '@/app/(dashboard)/components/store-settings';
import { db } from '@/app/db';
import { store } from '@/app/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { validate as isValidUUID } from 'uuid';
interface Props {
	params: { storeId: string };
}

const SettingsPage = async ({ params }: Props) => {
	const { userId } = await auth();
	if (!userId) redirect('/auth');
	const { storeId } = await params; // Await params to access storeId

	if (!isValidUUID(storeId)) {
		redirect('/');
	}

	// Fetch store data
	const data = await db.query.store.findFirst({
		where: eq(store.id, storeId),
	});

	const initialData = data
		? {
				id: data.id,
				name: data.name,
				userId: data.userId,
				createdAt: data.createdAt ? new Date(data.createdAt) : null,
				updatedAt: data.updatedAt ? new Date(data.updatedAt) : null,
			}
		: {
				id: '',
				name: '',
				userId: '',
				createdAt: null,
				updatedAt: null,
			};

	if (!initialData) redirect('/');

	return (
		<div>
			<div className='flex-1 space-y-4 p-8'>
				<StoreSettings initialData={initialData} />
			</div>
		</div>
	);
};

export default SettingsPage;
