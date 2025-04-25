export interface CreateProgramDto{
    name:string;
    description?:string;
    active?:boolean;
}

export interface UpdateProgramDto{
    name?:string;
    description?:string;
    active?:boolean;
}