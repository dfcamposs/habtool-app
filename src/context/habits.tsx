import React, { createContext, useEffect, useState } from 'react';
import { getProgressStars, getUserName, HabitProps, loadHabits } from '../libs/storage';

interface HabitsContextProps {
    myHabits: HabitProps[];
    userName: string;
    percentageChecked: number;
    motivationalPhrase: string;
    handleUpdateMyHabits: (habits: HabitProps[]) => void
    handleUpdatePercentageCheck: () => void
}

const motivationalPhrases = [
    "seja 1% melhor todos os dias",
    "troque hábitos ruins por bons hábitos",
    "comece com um pequeno hábito"
];

export const HabitsContext = createContext<HabitsContextProps>({} as HabitsContextProps);

export const HabitsProvider: React.FC = ({ children }) => {
    const [userName, setUserName] = useState<string>('');
    const [myHabits, setMyHabits] = useState<HabitProps[]>([]);
    const [percentageChecked, setPercentageChecked] = useState<number>(0);
    const [motivationalPhrase, setMotivationalPhrase] = useState<string>(motivationalPhrases[0]);

    async function getProgress(): Promise<void> {
        const percentage = await getProgressStars();
        setPercentageChecked(percentage);
    }

    useEffect(() => {
        async function getUser() {
            const user = await getUserName();
            setUserName(user);
        }

        async function getMyHabits() {
            const habitsStoraged = await loadHabits();
            const habitsSorted = habitsStoraged.sort((a, b) => a.order - b.order)
            setMyHabits(habitsSorted);
        }

        function getMotivationalPhrase() {
            setMotivationalPhrase(
                motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)]
            );
        }

        getUser();
        getMyHabits();
        getProgress();
        getMotivationalPhrase();
    }, [])

    function handleUpdateMyHabits(habits: HabitProps[]) {
        setMyHabits([]);
        setMyHabits(habits);
        handleUpdatePercentageCheck();
    }

    function handleUpdatePercentageCheck() {
        getProgress();
    }

    return (
        <HabitsContext.Provider value={{
            myHabits,
            userName,
            percentageChecked,
            motivationalPhrase,
            handleUpdateMyHabits,
            handleUpdatePercentageCheck
        }}>
            {children}
        </HabitsContext.Provider>
    )
}

