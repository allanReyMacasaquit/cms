import { db } from '@/app/db';

const DashbboardPage = async () => {
	const data = await db.query.store.findFirst({});

	return <div>Active Store: {data?.name} </div>;
};
export default DashbboardPage;
