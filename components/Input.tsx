import React, { useCallback, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

const Input = forwardRef((props, ref) => {
    const { onInputChange } = props;
    const [inputValue, setInputValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const maxChars = 15;

    const handleReset = () => {
        setInputValue('');
        setErrorMessage('');
    };
    useImperativeHandle(ref, () => ({ handleReset }));

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;

            if (value.length <= maxChars) {
                setInputValue(value);
                onInputChange(value)
                setErrorMessage('');
            } else {
                setErrorMessage(`최대 ${maxChars}자까지만 입력할 수 있습니다.`);
            }
        },
        []);


    return (
        <div className="mb-4">
            <input
                type="text"
                onChange={handleChange}
                value={inputValue}
                className="border-b w-full p-2"
                placeholder="여기에 입력하세요"
            />
            <div className="char-count">
                {inputValue.length}/{maxChars}자
                {errorMessage && (
                    <div className="error-message">{errorMessage}</div>
                )}
            </div>
        </div>
    );
});

export default Input;