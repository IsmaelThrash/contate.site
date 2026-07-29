
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import * as React from 'react';

const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
	{
		variants: {
			variant: {
				default: 'bg-[#a78bfa] text-white hover:bg-[#9066fa] active:scale-[0.98] font-medium shadow-sm transition-all duration-100 ease-in-out rounded-lg',
				destructive: 'bg-red-600/90 text-white shadow-sm hover:bg-red-600 rounded-lg font-medium',
				outline: 'border border-[#404040] bg-[#262626] hover:bg-[#333333] text-[#eeeeee] hover:text-white transition-all duration-100 ease-in-out rounded-lg shadow-sm',
				secondary: 'bg-[#262626] text-[#eeeeee] hover:bg-[#333333] font-medium rounded-lg',
				ghost: 'hover:bg-[#262626] text-[#dadada] hover:text-[#eeeeee] transition-colors duration-100 ease-in-out rounded-lg',
				link: 'text-[#a78bfa] underline-offset-4 hover:underline',
				glass: 'bg-[#262626]/80 border border-[#404040] text-[#eeeeee] hover:bg-[#262626] shadow-sm rounded-lg',
			},
			size: {
				default: 'h-11 px-6 py-2',
				sm: 'h-9 px-4 text-xs',
				lg: 'h-14 px-10 text-base',
				icon: 'h-11 w-11',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	const Comp = asChild ? Slot : 'button';
	return (
		<Comp
			className={cn(buttonVariants({ variant, size, className }))}
			ref={ref}
			{...props}
		/>
	);
});
Button.displayName = 'Button';

export { Button, buttonVariants };
