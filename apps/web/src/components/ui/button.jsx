
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import * as React from 'react';

const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
	{
		variants: {
			variant: {
				default: 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 hover:opacity-90',
				destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md',
				outline: 'border-2 border-primary/20 bg-transparent shadow-sm hover:bg-primary/10 hover:border-primary hover:text-primary',
				secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md',
				ghost: 'hover:bg-primary/10 hover:text-primary',
				link: 'text-primary underline-offset-4 hover:underline',
                glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-foreground hover:bg-white/20 shadow-lg hover:shadow-xl',
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
