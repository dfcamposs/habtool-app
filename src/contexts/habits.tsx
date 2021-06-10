import React, { createContext, useEffect, useState } from 'react';
import { getProgressStars, HabitProps, loadHabits } from '../libs/storage';

interface HabitsContextProps {
    myHabits: HabitProps[];
    percentageChecked: number;
    motivationalPhrase: string;
    refreshHistoryCalendar: number;
    handleUpdateMyHabits: (habits: HabitProps[]) => void;
    handleUpdatePercentageCheck: () => void;
    handleRefreshHistoryCalendar: () => void;
}

const motivationalPhrases = [
    "seja 1% melhor todos os dias",
    "troque hábitos ruins por bons hábitos",
    "comece com um pequeno hábito"
];

export const HabitsContext = createContext<HabitsContextProps>({} as HabitsContextProps);

export const HabitsProvider: React.FC = ({ children }) => {
    const [myHabits, setMyHabits] = useState<HabitProps[]>([]);
    const [percentageChecked, setPercentageChecked] = useState<number>(0);
    const [motivationalPhrase, setMotivationalPhrase] = useState<string>(motivationalPhrases[0]);
    const [refreshHistoryCalendar, setRefreshHistoryCalendar] = useState(0);

    async function getProgress(): Promise<void> {
        const percentage = await getProgressStars();
        setPercentageChecked(percentage);
    }

    useEffect(() => {
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

    function handleRefreshHistoryCalendar() {
        setRefreshHistoryCalendar(oldState => oldState + 1);
    }

    return (
        <HabitsContext.Provider value={{
            myHabits,
            percentageChecked,
            motivationalPhrase,
            refreshHistoryCalendar,
            handleUpdateMyHabits,
            handleUpdatePercentageCheck,
            handleRefreshHistoryCalendar
        }}>
            {children}
        </HabitsContext.Provider>
    )
}

