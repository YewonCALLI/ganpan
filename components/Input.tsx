import React, { useCallback, useEffect, useState } from 'react';

var Aromanize = require("aromanize");
const Input = ({ onGanpanImage, onAverageWidth }) => {
    const [result, setResult] = useState<ImageData[] | []>([])
    const [inputValue, setInputValue] = useState('');
    const [enterPositions, setEnterPositions] = useState<Number[]>([])
    const [averageWidth, setAverageWidth] = useState<Number>(0);


    const fetchSearchedImages = async (userInput: string) => {
        try {
            const response = await fetch(`/api/get-search-image?input=${encodeURIComponent(userInput)}`, { method: 'GET' });
            const data = await response.json();
            const randomIndex = Math.floor(Math.random() * data.results.length);
            return data.results[randomIndex];
        } catch (error) {
            console.log(error);
            return [];
        }
    };


    const handleInputText = (
        (newInput: string) => {

            let processedList: string[] = [];
            let newEnterPositions: number[] = [];
            let currentWordLength = 0;
            let wordLengths: number[] = [];

            newInput.split("").forEach((input, index) => {
                if (input === ' ') {
                    newEnterPositions.push(index);
                    // 현재 단어의 길이를 배열에 저장
                    wordLengths.push(currentWordLength);
                    // 단어 길이 리셋
                    currentWordLength = 0;
                } else {
                    currentWordLength++;

                    if (/[a-zA-Z]/.test(input)) {
                        processedList.push(input.toUpperCase());
                    } else if (input === "닭") {
                        processedList.push("dalg");
                    } else {
                        processedList.push(Aromanize.romanize(input));
                    }
                }
                // 마지막 단어의 길이도 추가
                if (currentWordLength > 0) {
                    wordLengths.push(currentWordLength);
                }
            });


            // 모든 단어 길이의 평균 계산
            const newAverage = wordLengths.length > 0
                ? wordLengths.reduce((sum, length) => sum + length, 0) / wordLengths.length
                : 0;

            setAverageWidth(newAverage);
            setEnterPositions(prevPositions => [...prevPositions, ...newEnterPositions]);

            return processedList;
        }
    );
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.target.value);
        },
        []);

    const handleComplete = async (e: React.KeyboardEvent | React.MouseEvent) => {
        if ('key' in e && e.key === 'Enter' || e.type === 'click') {
            const processedInputs = handleInputText(inputValue);
            const allResults = await Promise.all(processedInputs.map(fetchSearchedImages));
            // 각 위치에 빈 ImageData 객체 삽입
            enterPositions.forEach(position => {
                allResults.splice(Number(position), 0, {
                    file_name: '',
                    public_url: ''
                });
            });
            await setResult(allResults)

        }
    };
    useEffect(() => { onGanpanImage(result) }, [result]);
    useEffect(() => { onAverageWidth(averageWidth) }, [averageWidth])
    return (
        <div className="mb-4">
            <input
                type="text"
                onKeyDown={handleComplete}
                onChange={handleChange}
                value={inputValue}
                className="border-b w-full p-2"
                placeholder="검색어를 입력하세요"
            />
        </div>
    );
};

export default Input;