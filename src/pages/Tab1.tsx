import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  IonToast,
  useIonViewWillEnter
} from '@ionic/react';
import './Tab1.css';
import ReporItem from '../components/RepoItem';
import React, { useEffect } from 'react';
import { Repository } from '../interfaces/Repository';
import { deleteRepository, fetchRepositories, hasGithubAuthFailure } from '../services/GithubService';
import LoadingSpinner from '../components/LoadingSpinner';
import { useHistory, useLocation } from 'react-router';

type Tab1LocationState = {
  successMessage?: string;
};

const Tab1: React.FC = () => {
  const history = useHistory();
  const location = useLocation<Tab1LocationState>();

  const [repositoryList, setRepositorylist] = React.useState<Repository[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  const loadRepos = async () => {
    if (hasGithubAuthFailure()) {
      setErrorMsg("GitHub rechazó el token. Corrige el archivo .env y recarga la app.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMsg("");
    fetchRepositories().then((reposData) => setRepositorylist(reposData))
      .catch((error) => setErrorMsg("Error al cargar repositorios." + error) )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      history.replace({ pathname: "/tab1", state: {} });
    }
  }, [history, location.state]);

  const handleEditRepo = (repository: Repository) => {
    history.push("/tab2", { repo: repository });
  };

  const handleDeleteRepo = async (repository: Repository) => {
    const confirmed = window.confirm(`¿Eliminar el repositorio ${repository.name}?`);
    if (!confirmed) {
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      await deleteRepository(repository.owner.login, repository.name);
      setRepositorylist((currentRepos) => currentRepos.filter((repo) => repo.id !== repository.id));
    } catch (error) {
      setErrorMsg("Error al eliminar repositorio." + error);
    } finally {
      setLoading(false);
    }
  };

  useIonViewWillEnter(() => {
    loadRepos();
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Repositorios</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          {repositoryList.map((repo) => {
            return (
              <ReporItem
                key={repo.id}
                {...repo}
                onEdit={() => handleEditRepo(repo)}
                onDelete={() => handleDeleteRepo(repo)}
              />
            );
          })}
        </IonList>

        {loading && <LoadingSpinner />}

        {errorMsg !== "" && 
          (<IonText color="danger">
            <p>{errorMsg}</p>
          </IonText>)
        }

        <IonToast
          isOpen={successMessage !== ""}
          message={successMessage}
          duration={2500}
          color="success"
          onDidDismiss={() => setSuccessMessage("")}
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;