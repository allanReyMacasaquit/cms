import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'; // Named exports
import { Copy, Server } from 'lucide-react';
import { Badge, BadgeProps } from './ui/badge';
import { Button } from './ui/button';
import toast from 'react-hot-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface ApiAlertProps {
	title: string;
	description: string;
	variant: 'public' | 'admin';
}

const textMap: Record<ApiAlertProps['variant'], string> = {
	public: 'Public',
	admin: 'Admin',
};

const variantMap: Record<ApiAlertProps['variant'], BadgeProps['variant']> = {
	public: 'secondary',
	admin: 'destructive',
};

export const ApiAlert: React.FC<ApiAlertProps> = ({
	title,
	description,
	variant = 'public',
}) => {
	const onCopy = () => {
		navigator.clipboard.writeText(description);
		toast.success('API Route copied to the clipboard');
	};
	return (
		<Alert className='px-2'>
			<Server className='h-4 w-4' />
			<AlertTitle className='flex items-center gap-x-2 justify-between'>
				{title}
				<Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
			</AlertTitle>
			<AlertDescription className='mt-4 flex items-center justify-between'>
				<code className='relative rounded-sm'>{description}</code>
			</AlertDescription>
			<div className='flex items-center justify-end'>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant='outline' onClick={onCopy}>
							<Copy className='size-4' />
						</Button>
					</TooltipTrigger>
					<TooltipContent className='bg-neutral-100 text-black'>
						<p>Copy API Link</p>
					</TooltipContent>
				</Tooltip>
			</div>
		</Alert>
	);
};
