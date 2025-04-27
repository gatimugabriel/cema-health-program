interface Program {
    id: string;
    name: string;
    description?: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

interface CreateProgramDto {
    name: string;
    description?: string;
    active: boolean;
}

interface UpdateProgramDto {
    name?: string;
    description?: string;
    active?: boolean;
}

interface ProgramDetailPageProps {
    params: {
        id: string;
    };
}