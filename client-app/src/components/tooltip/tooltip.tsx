import React, { ReactNode } from 'react';

interface TooltipComponentProps {
  message: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const TooltipComponent: React.FC<TooltipComponentProps> = ({
  message,
  children,
  position = 'bottom', // default value is 'bottom'
}) => {
  const positionClasses = {
    top: 'dropdown-top',
    bottom: 'dropdown-bottom',
    left: 'dropdown-left',
    right: 'dropdown-right'
  };

  // Determine the position class based on the position prop
  const positionClass = positionClasses[position];

  return (
    <div className={`dropdown dropdown-hover ${positionClass}` }>
      <div tabIndex={0} role="button" className="btn btn-circle disabled btn-ghost btn-xs text-info cursor-default">
        {children}
      </div>
      <div tabIndex={0} className="card compact dropdown-content z-[3] rounded-box w-20 bg-gray-750">
        <div tabIndex={0} className="card-body flex items-center justify-center">
          <p className="font-roboto text-xs text-black">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default TooltipComponent;
