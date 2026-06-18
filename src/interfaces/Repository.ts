export interface Repository {
    id: number;
    name: string;
    description: string;
    language: string;
    owner: {
        log: string;
        avatar_url:string;
    }
}

