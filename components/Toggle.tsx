import React from 'react';

interface ToggleProps {
    label: string;
    isToggled: boolean;
    onToggle: (value: boolean) => void;
}
const Toggle = ({ leftLabel, rightLabel, isToggled, onToggle }: {
    leftLabel: string;
    rightLabel: string;
    isToggled: boolean;
    onToggle: (value: boolean) => void;
}) => {
    return (
        <div className="fixed left-1/2 top-8 -translate-x-1/2 flex items-center gap-3 z-10">
            <span className={`text-base font-medium ${!isToggled ? 'text-[#00D5FF]' : 'text-gray-400'}`}>
                {leftLabel}
            </span>
            <div
                onClick={() => onToggle(!isToggled)}
                className={`relative w-14 h-7 transition-colors duration-300 rounded-full cursor-pointer ${isToggled ? 'bg-[#00D5FF]' : 'bg-gray-300'
                    } mx-4`}
            >
                <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${isToggled ? 'transform translate-x-7' : ''
                        }`}
                />
            </div>
            <span className={`text-base font-medium ${isToggled ? 'text-[#00D5FF]' : 'text-gray-400'}`}>
                {rightLabel}
            </span>
        </div>
    );
};

export default Toggle;