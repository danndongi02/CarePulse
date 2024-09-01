'use server'

import { ID } from "node-appwrite";
import { databases } from "../appwrite.config";
import { parseStringify } from "../utils";

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
            '66d10484000d045fd546', // DATwABASE_ID!,
            '66d105150006aef354ff', // APPOINTMENT_COLLECTION_ID!,
            appointmentId
        )

        return parseStringify(appointment)

    } catch (error) {
        console.error('failed to get appointment: ', error);
    }
}