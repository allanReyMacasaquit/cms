'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogClose,
} from '@/components/ui/dialog';

interface ModalProps {
	title: string;
	description: string;
	isOpen: boolean;
	onClose: () => void;
	children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
	title,
	description,
	isOpen,
	onClose,
	children,
}) => {
	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className='rounded-lg shadow-lg max-w-lg mx-auto p-6 bg-white dark:bg-gray-800'>
				<DialogHeader>
					<DialogTitle className='text-lg font-semibold text-gray-800 dark:text-white'>
						{title}
					</DialogTitle>
					<DialogDescription className='text-sm text-gray-600 dark:text-gray-400'>
						{description}
					</DialogDescription>
				</DialogHeader>
				<div className='mt-4'>{children}</div>
				<DialogClose asChild>
					<button
						className='w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-400 to-teal-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300'
						aria-label='Close'
					>
						Close
					</button>
				</DialogClose>
			</DialogContent>
		</Dialog>
	);
};
