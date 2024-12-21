import { useStoreModal } from '@/hooks/use-store-modal';
import { Button } from '../ui/button';

const User = () => {
	const isOpen = useStoreModal((state) => state.isOpen);
	const onOpen = useStoreModal((state) => state.onOpen);

	const handleButtonClick = () => {
		if (!isOpen) {
			onOpen();
		}
	};

	return (
		<div>
			<Button variant='secondary' onClick={handleButtonClick}>
				Admin
			</Button>
		</div>
	);
};

export default User;
