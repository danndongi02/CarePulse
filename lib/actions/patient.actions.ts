import { ID, Query } from "node-appwrite"
import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config"
import { parseStringify } from "../utils";

import { InputFile } from "node-appwrite/file"

// create user
export const createUser = async (user: CreateUserParams) => {
    
    try {
        const newUser = await users.create(ID.unique(), user.email, user.phone, undefined, user.name)

        console.log({newUser});

        return parseStringify(newUser)
        
    } catch (error: any) {
        if (error && error?.code === 409) {
            const documents = await users.list([
                Query.equal('email', [user.email])
            ])

            return documents?.users[0]
        }

        console.error('Failed to create new user: ', error);
        
    }
}

export const getUser = async (userId: string) => {
    try {
        const user = await users.get(userId)

        return parseStringify(user)
        
    } catch (error: any) {
        console.error('Failed to get user: ', error);
        
    }
}

export const registerPatient = async ({ identificationDocument, ...patient }: RegisterUserParams) => {
    try {
        // upload file
        // let file;

        // if (identificationDocument) {
        //     const inputFile = identificationDocument && InputFile.fromBuffer(
        //         identificationDocument?.get('blobFile') as Blob,
        //         identificationDocument?.get('fileName') as string,
        //     )

        //     file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile)
        // }

        // Create new patient
        const newPatient = await databases.createDocument(
            '66d10484000d045fd546', // DATABASE_ID!,
            '66d104b7002e220cd35d', // PATIENT_COLLECTION_ID!,
            ID.unique(),
            {
                // identificationDocumentId: file?.$id || null,
                // identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
                ...patient
            }
        )

        return parseStringify(newPatient)

    } catch (error: any) {
        console.error('Failed to register patient: ', error);
        
    }
}