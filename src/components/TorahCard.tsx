
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TorahCardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: 'primary' | 'accent' | 'amber';
}

const TorahCard = ({ children, className, gradient = 'primary' }: TorahCardProps) => {
  const gradientClasses = {
    primary: 'from-primary/10 to-primary/5',
    accent: 'from-accent/10 to-accent/5',
    amber: 'from-amber-500/10 to-amber-500/5',
  };

  return (
    <Card 
      className={cn(
        "border-0 overflow-hidden transition-all duration-300 shadow-md hover:shadow-lg",
        "bg-gradient-to-br backdrop-blur-sm",
        gradientClasses[gradient],
        className
      )}
    >
      {children}
    </Card>
  );
};

const TorahCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardHeader 
    ref={ref} 
    className={cn(
      "pb-3 border-b border-primary/10", 
      className
    )} 
    {...props} 
  />
));
TorahCardHeader.displayName = "TorahCardHeader";

const TorahCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardContent 
    ref={ref} 
    className={cn("pt-4", className)} 
    {...props} 
  />
));
TorahCardContent.displayName = "TorahCardContent";

const TorahCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardFooter 
    ref={ref} 
    className={cn(
      "pt-3 border-t border-primary/10", 
      className
    )} 
    {...props} 
  />
));
TorahCardFooter.displayName = "TorahCardFooter";

export { TorahCard, TorahCardHeader, TorahCardContent, TorahCardFooter };
