import { db } from '@/app/db';
import { store } from '@/app/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

import { redirect } from 'next/navigation';

interface Props {
	children: React.ReactNode;
	params: { storeId: number };
}

const DashboardLayout = async ({ children, params }: Props) => {
	const { userId } = await auth();

	if (!userId) {
		redirect('/sign-in');
	}

	const data = await db.query.store.findFirst({
		where: eq(store.id, params.storeId),
	});

	if (!data) {
		redirect('/');
	}

	return (
		<div>
			{/* Pass store data to your child component */}
			<div>This is a Navbar for store: {params.storeId}</div>
			{children}
		</div>
	);
};

export default DashboardLayout;
