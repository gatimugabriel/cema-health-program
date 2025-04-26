import {ClientService} from '../ClientService';
import {IClientRepository} from '../../../domain/repositories/IClientRepository';
import {Client} from '../../../domain/entities/Client';
import {CreateClientDto} from '../../dtos/ClientDto';

/**
 * Client Service Unit tests
 * @group unit/program
 * @description: tests for client creation, and searching for clients
 * */
describe('ClientService', () => {
    let clientService: ClientService;
    let mockClientRepository: jest.Mocked<IClientRepository>;

    beforeEach(() => {
        jest.clearAllMocks();

        mockClientRepository = {
            findAll: jest.fn(),
            findById: jest.fn(),
            findByIdentificationNumber: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            search: jest.fn()
        };

        clientService = new ClientService(mockClientRepository);
    });


    //--------- 1. CREATE CLIENT ------------//
    describe('createClient', () => {
        it('should create a new client when identification number is unique', async () => {
            const clientData: CreateClientDto = {
                firstName: 'James',
                lastName: 'Bond',
                email: "bondj007@gmail.com",
                identificationNumber: '1122334455',
                dateOfBirth: new Date('2000-11-01'),
                gender: 'male'
            };

            const expectedClient: Client = {
                id: 'uuid-uuid-uuid-uuid',
                firstName: 'James',
                lastName: 'Bond',
                email: "bondj007@gmail.com",
                identificationNumber: '1122334455',
                dateOfBirth: new Date('2000-11-01'),
                gender: 'male',
                createdAt: new Date(),
                updatedAt: new Date(),
                enrollments: [],
                phone: '',
                address: '',
                validateContactInfo: function (): void {
                    throw new Error('Function not implemented.');
                }
            };

            mockClientRepository.findByIdentificationNumber.mockResolvedValue(null);
            mockClientRepository.create.mockResolvedValue(expectedClient);

            const result = await clientService.createClient(clientData);

            // Assert
            expect(mockClientRepository.findByIdentificationNumber).toHaveBeenCalledWith('1122334455');
            expect(mockClientRepository.create).toHaveBeenCalledWith(clientData);
            expect(result).toEqual(expectedClient);
        });

        it('should throw an error when identification number already exists', async () => {
            const clientDto: CreateClientDto = {
                firstName: 'Mary',
                lastName: 'Jane',
                identificationNumber: '123456789',
                dateOfBirth: new Date('1990-01-01'),
                gender: 'female'
            };

            const existingClient: Client = {
                id: 'uuid-uuid-uuid-uui2',
                firstName: 'Ada',
                lastName: 'Lovelace',
                identificationNumber: '123456789',
                dateOfBirth: new Date('1985-05-05'),
                gender: 'female',
                createdAt: new Date(),
                updatedAt: new Date(),
                enrollments: [],
                email: '',
                phone: '',
                address: '',
                validateContactInfo: function (): void {
                    throw new Error('Function not implemented.');
                }
            };

            mockClientRepository.findByIdentificationNumber.mockResolvedValue(existingClient);

            // Act & Assert
            await expect(clientService.createClient(clientDto)).rejects.toThrow(
                'A client with this identification number already exists!'
            );
            expect(mockClientRepository.create).not.toHaveBeenCalled();
        });
    });

    describe('getAllClients', () => {
        it('should return all clients', async () => {
            const clients: Client[] = [
                {
                    id: 'uuid-uuid-uuid-uuid',
                    firstName: 'James',
                    lastName: 'Bond',
                    email: "bondj007@gmail.com",
                    identificationNumber: '1122334455',
                    dateOfBirth: new Date('2000-11-01'),
                    gender: 'male',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    enrollments: [],
                    phone: '',
                    address: '',
                    validateContactInfo: function (): void {
                        throw new Error('Function not implemented.');
                    }
                },
                {
                    id: 'uuid-uuid-uuid-uui2',
                    firstName: 'Ada',
                    lastName: 'Lovelace',
                    identificationNumber: '123456789',
                    dateOfBirth: new Date('1985-05-05'),
                    gender: 'female',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    enrollments: [],
                    email: '',
                    phone: '',
                    address: '',
                    validateContactInfo: function (): void {
                        throw new Error('Function not implemented.');
                    }
                }
            ];

            mockClientRepository.findAll.mockResolvedValue({clients: clients, totalCount: clients.length});


            const result = await clientService.getAllClients();

            expect(mockClientRepository.findAll).toHaveBeenCalled();
            expect(result).toEqual(clients);
        })
        ;
    });


    describe('searchClients', () => {
        it('should return matching clients when query is provided', async () => {
            const query = 'Bond';
            const clients: Client[] = [
                {
                    id: 'uuid-uuid-uuid-uuid',
                    firstName: 'James',
                    lastName: 'Bond',
                    email: "bondj007@gmail.com",
                    identificationNumber: '1122334455',
                    dateOfBirth: new Date('2000-11-01'),
                    gender: 'male',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    enrollments: [],
                    phone: '',
                    address: '',
                    validateContactInfo: function (): void {
                        throw new Error('Function not implemented.');
                    }
                },
            ];

            mockClientRepository.search.mockResolvedValue({clients, totalCount: clients.length});

            const result = await clientService.searchClients(query);

            expect(mockClientRepository.search).toHaveBeenCalledWith(query);
            expect(result).toEqual(clients);
        });
    });
});