import { z } from 'zod';

export const formDataArray = [
    {
        id: '1',
        FirstName: "Prashant",
        LastName: "Kharade",
        CountryCode: "+91",
        Phone: 9876543210,
        Email: "prashantkharade3721@gmail.com",
        Username: "PrashantKharade",
        Password: "password123",
    },
    {
        id: '2',
        FirstName: 'Johnas',
        LastName: 'Doeee',
        CountryCode: 'US',
        Phone: 1234567890,
        Email: 'john@example.com',
        Username: 'johndoe',
        Password: 'password123'
    },
    {
        id: '3',
        FirstName: 'Janeas',
        LastName: 'Smith',
        CountryCode: 'UK',
        Phone: 9876543210,
        Email: 'jane@example.com',
        Username: 'janesmith',
        Password: 'password123'
    }
];

export const formDataArray_ =
{
    id: 1,
    FirstName_: "Jon",
    LastName_: "Kharade",
    CountryCode_: "+91",
    Phone_: 9876543210,
    Email_: "prashantkharade3721@gmail.com",
    Username_: "PrashantKharade",
    Password_: "password123",
}

// export const schema = z.object({
//     FirstName: z
//         .string()
//         .min(5, { message: 'First name must be at least 5 characters long.' })
//         .max(20, { message: 'First name must be at most 20 characters long.' }),
//     LastName: z.string()
//         .min(5, { message: 'Last name must be at least 5 characters long.' })
//         .max(20, { message: 'Last name must be at most 20 characters long.' }),
//     CountryCode: z
//         .string(),
//     // .startsWith("+", { message: "Must provide country code" }),
//     Phone: z
//         .number()
//         .gt(1000000000, { message: "Phone number must be at least 10 digits long" })
//         .lt(9999999999, { message: "Phone number must be at most 10 digits long" }),
//     Email: z
//         .string()
//         .email({ message: "Invalid email address" }),
//     Username: z
//         .string(),
//     Password: z
//         .string(),
//     // Image: z
//     //     .instanceof(File, { message: 'Please upload a file.' })
//     //     .refine((f) => f.size < 100_000, 'Max 100 kB upload size.')
// });

export const schema = z.object({
    image: z
        .instanceof(File, { message: 'Please upload a file.' })
        .refine((f) => f.size < 100_000, 'Max 100 kB upload size.')
});

export { draggable } from './utils/drag-and-drop.ts';
export { dropzone } from './utils/drag-and-drop.ts';
export { lazyLoad } from './utils/lazyload.ts';


export interface Card {
    id: number;
    content: string;
}

export enum ViewType {
    LIST = 'list',
    GRID = 'grid'
}

// Types
export type Button = {
    id: number;
    name: string;
    icon: string;
};

export type DroppedItem = Button & {
    dropTime: string;
    uniqueId: string;
};



