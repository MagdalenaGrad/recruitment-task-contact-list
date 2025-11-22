import { Contact } from '../types';

export const createMockContacts = (count: number, startId = 1): Contact[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `${startId + i}`,
    firstNameLastName: `Person ${startId + i}`,
    jobTitle: 'Developer',
    emailAddress: `person${startId + i}@example.com`,
  }));

export const mockContacts: Contact[] = [
  {
    id: '1',
    firstNameLastName: 'John Doe',
    jobTitle: 'Developer',
    emailAddress: 'john@example.com',
  },
  {
    id: '2',
    firstNameLastName: 'Jane Smith',
    jobTitle: 'Designer',
    emailAddress: 'jane@example.com',
  },
  {
    id: '3',
    firstNameLastName: 'Bob Johnson',
    jobTitle: 'Manager',
    emailAddress: 'bob@example.com',
  },
];

export const mockContact: Contact = {
  id: 'test-id-1',
  firstNameLastName: 'John Doe',
  jobTitle: 'Software Developer',
  emailAddress: 'john.doe@example.com',
};
