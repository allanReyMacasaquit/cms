'use client';

import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

const Dashboard = () => {
	const router = useRouter();
	const params = useParams();

	return (
		<div className='flex items-center justify-between min-w-[340px] md:max-w-5xl mx-auto'>
			<Heading
				title='Dashboard (0)'
				description='Manage Dashboard for your Store'
			/>
			<Button
				variant='outline'
				size='sm'
				onClick={() => router.push(`/${params.storeId}/dashboard/new`)}
			>
				<Plus className='size-3' /> Add new
			</Button>
		</div>
	);
};
export default Dashboard;
