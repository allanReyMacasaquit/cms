'use client';

import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Separator } from '@/components/ui/separator';
import DataTable from '../data-table';
import { ApiList } from '@/components/api-list';
import {
	CategoryColumn,
	columns,
} from '../../[storeId]/(routes)/category/columns';

interface Props {
	data: CategoryColumn[];
}

const Category = ({ data }: Props) => {
	const router = useRouter();
	const params = useParams();

	return (
		<>
			<div className='flex items-center justify-between min-w-[340px] md:max-w-5xl mx-auto'>
				<Heading
					title={`Category (${data.length})`}
					description='Manage Category for your Dashboard'
				/>
				<Button
					className='mr-7 md:mr-0'
					variant='outline'
					size='sm'
					onClick={() => router.push(`/${params.storeId}/category/new`)}
				>
					<Plus className='size-3' /> <p className='hidden md:flex'>Add new</p>
				</Button>
			</div>
			<Separator className='max-w-5xl mx-auto' />
			<DataTable columns={columns} data={data} searchKey='name' />
			<div className='max-w-5xl mx-auto'>
				<Heading title='API' description='API calls for Category' />
				<Separator />
				<ApiList entityName='category' entityIdName='categoryId' />
			</div>
		</>
	);
};
export default Category;
