import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';

interface LoadingProps {
	message?: string;
	className?: string;
}

function Loading({ message = 'Loading...', className }: LoadingProps) {
	return (
		<div
			className={cn(
				'min-h-screen fixed inset-0 flex items-center justify-center z-50 bg-black/50',
				className
			)}
		>
			<div className='bg-white p-4 rounded-lg shadow-md'>
				<Loader size={20} className='animate-spin mb-4' />
				{message && <p className='text-sm text-muted-foreground'>{message}</p>}
			</div>
		</div>
	);
}

export default Loading;
