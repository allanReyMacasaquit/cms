import Settings from '@/app/(dashboard)/components/settings';
import { db } from '@/app/db';
import { store } from '@/app/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

interface Props {
	params: { storeId: string };
}

const SettingsPage = async ({ params }: Props) => {
	const { userId } = await auth();
	if (!userId) redirect('/auth');

	// Fetch store data
	const data = await db.query.store.findFirst({
		where: eq(store.id, params.storeId),
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
		<div className='flex-col'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				<Settings initialData={initialData} />
			</div>
		</div>
	);
};

export default SettingsPage;
