import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { CldUploadWidget } from 'next-cloudinary';
import { Button } from './ui/button';
import { ImagePlus, Trash } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageUploadProps {
	disabled?: boolean;
	onChange: (value: string) => void;
	onRemove: (value: string) => void;
	value: { url: string }[];
}

const ProductUpload: React.FC<ImageUploadProps> = ({
	disabled,
	onChange,
	onRemove,
	value,
}) => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleUpload = (result: any) => {
		if (result.event === 'success' && result.info.secure_url) {
			onChange(result.info.secure_url);
		}
	};

	const handleDelete = (imageUrl: string) => {
		if (value.length > 1) {
			onRemove(imageUrl);
		} else {
			toast.error('Cannot delete the last remaining image.');
		}
	};

	if (!isMounted) {
		return null;
	}

	return (
		<div>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{value.map((imageObj, index) => (
					<div
						key={index}
						className='relative w-[320px] h-[180px] rounded-md overflow-hidden'
					>
						{index > 0 && (
							<div className='absolute top-2 right-2 z-50'>
								<Button
									variant='destructive'
									type='button'
									onClick={() => handleDelete(imageObj.url)}
								>
									<Trash className='size-10' />
								</Button>
							</div>
						)}
						<Image
							src={imageObj.url}
							alt='Uploaded'
							fill
							sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
							priority
							className='object-cover rounded-md'
						/>
					</div>
				))}
			</div>

			<CldUploadWidget
				uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME}
				onSuccess={handleUpload}
			>
				{({ open }) => {
					const handleClick = () => {
						open();
					};
					return (
						<Button
							className='bg-slate-600 mt-2'
							type='button'
							disabled={disabled}
							onClick={handleClick}
						>
							<ImagePlus className='size-10' />
							Upload Images
						</Button>
					);
				}}
			</CldUploadWidget>
		</div>
	);
};

export default ProductUpload;
