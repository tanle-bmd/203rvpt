import Expo, { ExpoPushMessage } from 'expo-server-sdk';
const expo = new Expo();

export class ExpoNotification {

    static getMessages(tokens: string[], body: string, title: string, data: object) {
        const messages: ExpoPushMessage[] = []
        for (let pushToken of tokens) {
            if (!Expo.isExpoPushToken(pushToken)) {
                console.error(`Push token ${pushToken} is not a valid Expo push token`);
                continue;
            }

            messages.push({
                to: pushToken,
                sound: {
                    name: "default",
                    critical: true
                },
                body: body || "Push notification description",
                title: title || "Push notification title",
                data,
            })
        }
        return messages
    }

    static async sentChunk(chunks: any) {
        let tickets = []
        for (let chunk of chunks) {
            try {
                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
            } catch (error) {
                console.log('error:', error)
            }
        }
        return tickets
    }

    static async pushNotification(tokens: string[], title: string, body: string, data: object) {
        data = { ...data }
        try {
            let messages = ExpoNotification.getMessages(tokens, body, title, data)
            let chunks = expo.chunkPushNotifications(messages);
            const tickets = await ExpoNotification.sentChunk(chunks);
            console.log('tickets:', tickets)
            return true
        } catch (error) {
            return false
        }
    }
}
