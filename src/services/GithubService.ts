import axios from "axios";
import { Repository } from "../interfaces/Repository";
import { GithubUser } from "../interfaces/GithubUser";
import { RepositoryPayload } from "../interfaces/RepositoryPayload";
const GITHUB_API_URL = import.meta.env.VITE_GITHUB_API_URL || "https://api.github.com";
const GITHUB_API_TOKEN = import.meta.env.VITE_GITHUB_API_TOKEN || import.meta.env.VITE_GITHUB_TOKEN;
let githubAuthFailed = false;

const githubClient = axios.create({
    baseURL : GITHUB_API_URL,
    headers:{
        Authorization : `Bearer ${GITHUB_API_TOKEN}`,
        Accept: "application/vnd.github.v3+json"
    }
})

const ensureGithubToken = () => {
    if (!GITHUB_API_TOKEN) {
        throw new Error("Falta configurar el token de GitHub. Crea un archivo .env con VITE_GITHUB_TOKEN o VITE_GITHUB_API_TOKEN.");
    }
};

export const hasGithubAuthFailure = () => githubAuthFailed;

export const clearGithubAuthFailure = () => {
    githubAuthFailed = false;
};

const getGithubErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
        githubAuthFailed = true;
        return "GitHub respondió 401. Verifica que el token sea válido y tenga permisos para repositorios y lectura de usuario.";
    }

    if (axios.isAxiosError(error) && error.response?.status === 403) {
        return "GitHub respondió 403. El token no tiene permisos para crear o modificar repositorios. Revisa que tenga alcance repo o permisos de administración de repositorios en GitHub.";
    }

    return `${(error as Error).message}`;
};


export const fetchRepositories = async (): Promise<Repository[]> => {
    try {
        ensureGithubToken();
        if (githubAuthFailed) {
            throw new Error("La autenticación de GitHub falló en esta sesión. Corrige el token y vuelve a cargar la app.");
        }
        const response = await githubClient.get("/user/repos", {
            params : {
                per_page:100,
                sort: "created",
                direction:"desc",
                affiliation:"owner",
                t: Date.now()
            }
        });

        return response.data as Repository[];
    } catch (error) {
        console.error("Error al repositorio", error);
        throw new  Error(getGithubErrorMessage(error))
    }
};
export const createRepository = async (repository : RepositoryPayload): Promise<Repository> =>{
    try{
        ensureGithubToken();
        if (githubAuthFailed) {
            throw new Error("La autenticación de GitHub falló en esta sesión. Corrige el token y vuelve a cargar la app.");
        }
        const response = await githubClient.post("/user/repos", repository);
        return response.data as Repository
    }catch(error){ 
        console.error("Error al leer repositorios",error);
        throw new Error (getGithubErrorMessage(error))

    }
}

export const updateRepository = async (
    owner: string,
    repositoryName: string,
    repository: RepositoryPayload
): Promise<Repository> => {
    try {
        ensureGithubToken();
        if (githubAuthFailed) {
            throw new Error("La autenticación de GitHub falló en esta sesión. Corrige el token y vuelve a cargar la app.");
        }
        const response = await githubClient.patch(`/repos/${owner}/${repositoryName}`, repository);
        return response.data as Repository;
    } catch (error) {
        console.error("Error al actualizar repositorio", error);
        throw new Error(getGithubErrorMessage(error));
    }
};

export const deleteRepository = async (owner: string, repositoryName: string): Promise<void> => {
    try {
        ensureGithubToken();
        if (githubAuthFailed) {
            throw new Error("La autenticación de GitHub falló en esta sesión. Corrige el token y vuelve a cargar la app.");
        }
        await githubClient.delete(`/repos/${owner}/${repositoryName}`);
    } catch (error) {
        console.error("Error al eliminar repositorio", error);
        throw new Error(getGithubErrorMessage(error));
    }
};
export const fetchUserInfo = async (): Promise<GithubUser | null> => {
    try{
        ensureGithubToken();
        if (githubAuthFailed) {
            throw new Error("La autenticación de GitHub falló en esta sesión. Corrige el token y vuelve a cargar la app.");
        }
        const response = await githubClient.get("/user");
        return response.data as GithubUser
    } catch(error){
            console.error("Error al repositorio", error);
            throw new  Error(getGithubErrorMessage(error))
        }
    }