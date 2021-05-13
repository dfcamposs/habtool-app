import React, { createContext, useEffect, useState } from 'react';
import { getProgressStars, getUserName, HabitProps, loadHabits } from '../libs/storage';

interface HabitsContextProps {
    myHabits: HabitProps[];
    userName: string;
    percentageChecked: number;
    handleUpdateMyHabits: (habits: HabitProps[]) => void
    handleUpdatePercentageCheck: () => void
}

export const HabitsContext = createContext<HabitsContextProps>({} as HabitsContextProps);

export const HabitsProvider: React.FC = ({ children }) => {
    const [userName, setUserName] = useState<string>('');
    const [myHabits, setMyHabits] = useState<HabitProps[]>([]);
    const [percentageChecked, setPercentageChecked] = useState<number>(0);

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
            setMyHabits(habitsStoraged);
        }

        getUser();
        getMyHabits();
        getProgress();
    }, [])

    function handleUpdateMyHabits(habits: HabitProps[]) {
        setMyHabits([])
        setMyHabits(habits)
    }

    function handleUpdatePercentageCheck() {
        getProgress();
    }

    return (
        <HabitsContext.Provider value={{
            myHabits,
            userName,
            percentageChecked,
            handleUpdateMyHabits,
            handleUpdatePercentageCheck
        }}>
            {children}
        </HabitsContext.Provider>
    )
}

