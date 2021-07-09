import { ColorEnum } from "../components/ColorTrackList";

export interface FrequencyProps {
    [weekDay: string]: boolean
}

export interface HabitProps {
    id: string;
    name: string;
    motivation?: string;
    frequency: FrequencyProps;
    startDate: number;
    endDate?: number;
    notificationHours: number[];
    order: number;
    trackColor?: ColorEnum,
    notificationIds?: string[];
}

export interface StorageHabitProps {
    [id: string]: HabitProps
}

export interface StorageHabitSortProps {
    [id: string]: number;
}

export interface HabitHistoryProps {
    habit: HabitProps,
    history: number[]
}

export interface StorageHistoryHabitProps {
    [id: string]: number[]
}

export interface StorageUserProps {
    name: string;
    isPro: boolean;
}