import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonPage, IonText, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewWillEnter } from '@ionic/react';
import './Tab3.css';
import React from 'react';
import { fetchUserInfo, hasGithubAuthFailure } from '../services/GithubService';
import { GithubUser } from '../interfaces/GithubUser';
import LoadingSpinner from '../components/LoadingSpinner';

const Tab3: React.FC = () => {
    const [loading, setLoading] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState("");
    const [userInfo, setUserInfo] = React.useState<GithubUser | null>(null);

    useIonViewWillEnter(() => {
      if (hasGithubAuthFailure()) {
        setErrorMsg("GitHub rechazó el token. Corrige el archivo .env y recarga la app.");
        setUserInfo(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      fetchUserInfo()
        .then((githubUser) => setUserInfo(githubUser))
        .catch((error) => setErrorMsg("Error al cargar usuario. " + error))
        .finally(() => setLoading(false));
    })

    
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>perfil de Usuario</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Perfil de Usuario</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="card-container">
          {userInfo &&( 
            <IonCard className="card">
            <img src= {userInfo.avatar_url} alt={userInfo.login} />
            <IonCardHeader>
              <IonCardTitle> {userInfo.name} </IonCardTitle>
              <IonCardSubtitle> {userInfo.login}</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <p>{userInfo.bio}</p>
            </IonCardContent>
          </IonCard>
        )}
        {errorMsg != "" && <IonText color="danger">{errorMsg}</IonText>}
        </div>
        {loading && <LoadingSpinner/>}
      </IonContent>
    </IonPage>
  );
};

export default Tab3;