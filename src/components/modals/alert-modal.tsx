'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '../ui/modal';

interface AlertModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm?: () => void;
	loading: boolean;
}

const AlertModal: React.FC<AlertModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	loading,
}) => {
	// Manage whether the component is mounted
	const [isMounted, setIsMounted] = React.useState(false);

	React.useEffect(() => {
		setIsMounted(true);
	}, []);

	// Prevent rendering if not mounted
	if (!isMounted) return null;

	return (
		<Modal
			title='Are you sure?'
			description='This action cannot be undone.'
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className='flex items-center justify-end w-full pt-6 space-x-2'>
				<Button
					className='w-full'
					variant='destructive'
					disabled={loading}
					onClick={onConfirm}
				>
					Continue
				</Button>
			</div>
		</Modal>
	);
};

export default AlertModal;
