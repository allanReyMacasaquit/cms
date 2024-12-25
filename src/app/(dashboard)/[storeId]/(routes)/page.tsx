import { db } from '@/app/db';
import { store } from '@/app/schema';
import { eq } from 'drizzle-orm';
interface Props {
	params: { storeId: string };
}

const DashbboardPage = async ({ params }: Props) => {
	const data = await db.query.store.findFirst({
		where: eq(store.id, params.storeId),
	});

	return <div>Active Store: {data?.name} </div>;
};
export default DashbboardPage;
