'use client';

import * as React from 'react';
import { store } from '@/app/schema';
import { useParams, useRouter } from 'next/navigation';
import { useStoreModal } from '@/hooks/use-store-modal';
import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { StoreIcon, PlusCircle, Check, ChevronsUpDown } from 'lucide-react';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';

type SwitcherProps = {
	items: (typeof store.$inferSelect)[]; // Ensure this is the correct type
};

export function Switcher({ items = [] }: SwitcherProps) {
	const [open, setOpen] = React.useState(false);
	const storeModal = useStoreModal();
	const params = useParams();
	const router = useRouter();

	const formattedItems = Array.isArray(items)
		? items.map((item) => ({
				label: item.name,
				value: item.id,
			}))
		: [];

	const currentStore = formattedItems.find(
		(item) => item.value === params.storeId
	);

	const onStoreSelect = (store: { value: string; label: string }) => {
		setOpen(false); // Close the popover after selection
		router.push(`/${store.value}`); // Navigate to selected store
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={open}
					aria-label='Select store'
					className='w-[200px] justify-between text-muted-foreground'
				>
					{currentStore ? (
						<>
							<StoreIcon className='mr-2 h-4 w-4' />
							{currentStore.label}
						</>
					) : (
						'Select Store'
					)}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>

			<PopoverContent className='w-[200px] p-0'>
				<Command>
					<CommandInput placeholder='Search store...' />
					<CommandEmpty>No store found.</CommandEmpty>
					<CommandList>
						<CommandGroup heading='Stores'>
							{formattedItems.map((store) => (
								<CommandItem
									key={store.value}
									onSelect={() => onStoreSelect(store)}
								>
									<StoreIcon className='mr-2 h-4 w-4' />
									{store.label}
									<Check
										className={cn(
											'ml-auto h-4 w-4',
											currentStore?.value === store.value
												? 'opacity-100'
												: 'opacity-0'
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
					<CommandSeparator />
					<CommandList>
						<CommandGroup>
							<CommandItem
								onSelect={() => {
									setOpen(false);
									storeModal.onOpen();
								}}
							>
								<PlusCircle className='mr-2 h-5 w-5' />
								Create Store
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
