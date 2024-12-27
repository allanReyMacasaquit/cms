import { db } from '@/app/db';
import { store } from '@/app/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

interface Props {
	params: { storeId: string };
}

const OverviewPage = async ({ params }: Props) => {
	const { userId } = await auth();
	if (!userId) redirect('/auth');

	const { storeId } = await params;

	const data = await db.query.store.findFirst({
		where: eq(store.id, storeId),
	});

	return (
		<div className='max-w-5xl mx-auto flex-1 space-y-4 p-8'>
			<div className=''>Active Store: {data?.name} </div>
		</div>
	);
};
export default OverviewPage;
