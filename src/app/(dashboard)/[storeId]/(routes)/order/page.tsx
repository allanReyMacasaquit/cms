import { db } from '@/app/db';
import { order } from '@/app/schema';
import { eq } from 'drizzle-orm';
import { format } from 'date-fns';
import { OrderColumn } from './columns';
import Order from '@/app/(dashboard)/components/order/order';
import { formattedPrice } from '@/lib/utils';

const OrderPage = async ({ params }: { params: { storeId: string } }) => {
	const { storeId } = await params;
	const data = await db.query.order.findMany({
		where: eq(order.storeId, storeId),
		with: {
			orderItem: true,
		},
	});

	const formattedData: OrderColumn[] = data.map((item) => ({
		id: item.id,
		phone: item.phone,
		address: item.address,
		products: item.orderItem.map((orderItem) => orderItem.productId).join(', '),
		totalPrice: formattedPrice.format(
			item.orderItem.reduce(
				(total, orderItem) => total + Number(orderItem.productId),
				0
			)
		),
		createdAt: item.createdAt ? format(item.createdAt, 'MMM do, yyyy') : 'N/A',
	}));
	return (
		<div>
			<div className='flex-1 space-y-4 p-8'>
				<Order data={formattedData} />
			</div>
		</div>
	);
};
export default OrderPage;
