import { IonContent, IonHeader,IonList,IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';
import { repositoryList } from '../interfaces/Repository';
import ReporItem from '../components/RepoItem';

const Tab1: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Repositorios</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
        {repositoryList.map((repo) => {
          return <ReporItem {...repo} />;
        })}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
