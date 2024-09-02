'use server'

import { ID, Query } from "node-appwrite";
import { databases, messaging } from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";

export const createAppointment = async (appointment: CreateAppointmentParams) => {
    try {
        const newAppointment = await databases.createDocument(
            '66d10484000d045fd546', // DATwABASE_ID!,
            '66d105150006aef354ff', // APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment
        )

        return parseStringify(newAppointment)
    } catch (error) {
        console.error('failed to create user: ', error);
        
    }
}

export const getAppointment = async (appointmentId: string) => {
    try {
        
        const appointment = await databases.getDocument(
            '66d10484000d045fd546', // DATABASE_ID!,
            '66d105150006aef354ff', // APPOINTMENT_COLLECTION_ID!,
            appointmentId
        )

        return parseStringify(appointment)

    } catch (error) {
        console.error('failed to get appointment: ', error);
    }
}

export const getRecentAppointmentList = async () => {
    console.log('Fetching recent appointments');
    
    try {
        const appointments = await databases.listDocuments(
            '66d10484000d045fd546', // DATABASE_ID!,
            '66d105150006aef354ff', // APPOINTMENT_COLLECTION_ID!,
            [Query.orderDesc('$createdAt')]
        )

        const initialCounts = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0
        }

        const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
            if (appointment.status === 'scheduled') {
                acc.scheduledCount++
            } else if (appointment.status === 'pending') {
                acc.pendingCount++
            } else if (appointment.status === 'cancelled') {
                acc.cancelledCount++
            }

            return acc;
        }, initialCounts)

        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents
        }

        return parseStringify(data)

    } catch (error) {
        console.error('failed to get recent appointment list: ', error);
        
    }
}

export const updateAppointment = async ({ appointmentId, userId, appointment, type }: UpdateAppointmentParams) => {
    try {
        const updatedAppointment = await databases.updateDocument(
            '66d10484000d045fd546', // DATABASE_ID!,
            '66d105150006aef354ff', // APPOINTMENT_COLLECTION_ID!,
            appointmentId,
            appointment
        )

        if (!updatedAppointment) {
            throw new Error('Appointment not found')
        }

        // TODO: Send SMS 
        const smsMessage = `
            Hi, it's CarePulse. 
            ${type === 'schedule' ? `Your appointment has been scheduled for ${formatDateTime(appointment.schedule!)}`
                : `We regret to inform you that your appointment has been cancelled for the following reason: ${appointment.cancellationReason}`
            }
        `

        await sendSMSNotification(userId, smsMessage)

        revalidatePath('/admin')

        return parseStringify(updatedAppointment)

    } catch (error) {
        console.error('failed to update appointment: ', error);
        
    }
}
export const sendSMSNotification = async (userId: string, content: string) => {
    try {
        const message = await messaging.createSms(
            ID.unique(),
            content,
            [],
            [userId]
        )

        return parseStringify(message)
    } catch (error) {
        console.error('failed to send sms notification: ', error);
        
    }
}