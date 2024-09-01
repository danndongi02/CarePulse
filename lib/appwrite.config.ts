import * as sdk from 'node-appwrite'

export const {
    PROJECT_ID, API_KEY, DATABASE_ID, PATIENT_COLLECTION_ID, DOCTOR_COLLECTION_ID, APPOINTMENT_COLLECTION_ID,
    NEXT_PUBLIC_BUCKED_ID: BUCKET_ID,
    NEXT_PUBLIC_ENDPOINT: ENDPOINT
} = process.env

const client = new sdk.Client()

client
    // .setEndpoint(ENDPOINT!)
    // .setProject(PROJECT_ID!)
    // .setKey(API_KEY!)
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('66d103e3000a5d6e0de9')
    .setKey('f51791a6b547ea43b707f1c7c220f959b3b4c2c033d96b2f5f3488f09ea101159c45037c46f927556920a49b5d0ccc3b3e7e9c6af8d04fdc6eaaac5815e1fefb095288ea50c9da53db37230afe845c96607d67e5b3b115cabd357322d356be1dc3ea048cd82d77cd2566456fd5c7c0aac63c014109024a0d01488220023d7bc6')

export const databases = new sdk.Databases(client)
export const storage = new sdk.Storage(client)
export const messaging = new sdk.Messaging(client)
export const users = new sdk.Users(client)
