import React from 'react';

interface SwitchProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange, disabled }) => {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={() => onCheckedChange(!checked)}
            className={`
        relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none 
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${checked ? 'bg-red-600' : 'bg-slate-300 dark:bg-slate-700'}
      `}
        >
            <span
                className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
            />
        </button>
    );
};