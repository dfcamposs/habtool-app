import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import * as Notifications from "expo-notifications";

import { HabitProps, StorageHabitProps } from "./schema.storage";

export function formatWeekDay(weekDay: number): string | undefined {
    if (weekDay === 1) return "sun";
    if (weekDay === 2) return "mon";
    if (weekDay === 3) return "tue";
    if (weekDay === 4) return "wed";
    if (weekDay === 5) return "thu";
    if (weekDay === 6) return "fri";
    if (weekDay === 7) return "sat";
}

export async function addSchedulePushNotification(habit: HabitProps): Promise<void> {
    const schedules = habit.notificationHours;
    const newNotifications: string[] = [];

    if (!schedules?.length) return;

    if (habit.notificationIds) {
        await cancelSchedulePushNotifications(habit.notificationIds);
    }

    for (let i = 1; i <= 7; i++) {
        const weekDay = formatWeekDay(i);
        if (!weekDay) continue;

        if (habit.frequency[weekDay]) {
            for (const schedule of schedules) {
                const notificationId = await Notifications.scheduleNotificationAsync({
                    content: {
                        title: habit.name,
                        body: habit.motivation ?? 'Já executou este hábito hoje?',
                        sound: true,
                        priority: Notifications.AndroidNotificationPriority.HIGH,
                    },
                    trigger: {
                        hour: Number(format(schedule, "HH")),
                        minute: Number(format(schedule, "mm")),
                        repeats: true,
                        weekday: i
                    },
                });

                newNotifications.push(notificationId);
            }
        }
    }

    const data = await AsyncStorage.getItem('@habtool:habits');
    const habits = data ? (JSON.parse(data) as StorageHabitProps) : {};

    await AsyncStorage
        .setItem('@habtool:habits',
            JSON.stringify({
                [habit.id]: {
                    ...habits[habit.id],
                    notificationIds: newNotifications
                },
                ...habits
            })
        );
}

export async function cancelSchedulePushNotifications(notificationIds: string[]) {
    notificationIds.forEach(notification => Notifications.cancelScheduledNotificationAsync(notification));
}