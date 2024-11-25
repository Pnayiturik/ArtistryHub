import React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress'; // Radix for accessible progress bars (optional)
import classNames from 'classnames'; // Optional for combining class names

// Named export for Progress component
export const Progress = React.forwardRef(
  ({ value, className, ...props }, ref) => {
    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={classNames(
          "relative h-4 w-full overflow-hidden rounded bg-gray-200",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className="h-full bg-blue-500 transition-all"
          style={{ width: `${value}%` }}
        />
      </ProgressPrimitive.Root>
    );
  }
);

Progress.displayName = 'Progress';
