import { db } from '@/app/db';
import { auth } from '@clerk/nextjs/server';

import { redirect } from 'next/navigation';
import Navbar from '../components/navbar';

interface Props {
	children: React.ReactNode;
}

const DashboardLayout = async ({ children }: Props) => {
	const { userId } = await auth();

	if (!userId) {
		redirect('/sign-in');
	}

	const data = await db.query.store.findFirst();

	if (!data) {
		redirect('/');
	}

	return (
		<div>
			<Navbar />
			{children}
		</div>
	);
};

export default DashboardLayout;
