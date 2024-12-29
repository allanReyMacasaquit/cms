'use client';

import { dashboard } from '@/app/schema';
import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

interface Props {
	data: (typeof dashboard.$inferSelect)[];
}

const Dashboard = ({ data }: Props) => {
	const router = useRouter();
	const params = useParams();

	return (
		<div className='flex items-center justify-between min-w-[340px] md:max-w-5xl mx-auto'>
			<Heading
				title={`Dashboard (${data.length})`}
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
