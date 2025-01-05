'use client';

import Heading from '@/components/ui/heading';

import { Separator } from '@/components/ui/separator';
import DataTable from '../data-table';
import { columns, OrderColumn } from '../../[storeId]/(routes)/order/columns';

interface Props {
	data: OrderColumn[];
}

const Order = ({ data }: Props) => {
	return (
		<>
			<div className='flex items-center justify-between min-w-[340px] md:max-w-5xl mx-auto'>
				<Heading
					title={`Orders (${data.length})`}
					description='Manage Orders for your Store'
				/>
			</div>
			<Separator className='max-w-5xl mx-auto' />
			<DataTable columns={columns} data={data} searchKey='name' />
		</>
	);
};
export default Order;
