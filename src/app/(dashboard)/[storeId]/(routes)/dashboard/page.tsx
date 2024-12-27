import Dashboard from '@/app/(dashboard)/components/dashboard';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const DashboardPage = async () => {
	const { userId } = await auth();
	if (!userId) redirect('/auth');
	return (
		<div>
			<div className='flex-1 space-y-4 p-8'>
				<Dashboard />
			</div>
		</div>
	);
};
export default DashboardPage;
