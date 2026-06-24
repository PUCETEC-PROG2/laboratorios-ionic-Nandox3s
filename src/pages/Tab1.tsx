import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react';
import './Tab1.css';
//import { repositoryList } from '../interfaces/Repository';
import ReporItem from '../components/RepoItem';
import React from 'react';
import { Repository } from '../interfaces/Repository';
import { fetchRepositories } from '../services/GithubService';
import LoadingSpinner from '../components/LoadingSpinner';

const Tab1: React.FC = () => {

  const [repositoryList, setRepositorylist] = React.useState<Repository[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const loadRepos = async () => {
    setLoading(true);
    fetchRepositories().then((reposData) => setRepositorylist(reposData))
      .catch((error) => setErrorMsg("Error al cargar repositorios." + error) )
      .finally(() => setLoading(false));
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
            return <ReporItem key={repo.id} {...repo} />;
          })}
        </IonList>

        {loading && <LoadingSpinner />}

        {errorMsg !== "" && 
          (<IonText color="danger">
            <p>{errorMsg}</p>
          </IonText>)
        }
      </IonContent>
    </IonPage>
  );
};

export default Tab1;