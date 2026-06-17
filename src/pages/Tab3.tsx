import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab3.css';

const Tab3: React.FC = () => {
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
          <IonCard className="card">
            <img src="https://avatars.githubusercontent.com/u/152243013?v=4" alt="avatar" />
            <IonCardHeader>
              <IonCardTitle> Fernando Socasi </IonCardTitle>
              <IonCardSubtitle> socasicaiza</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              Ingeniero en Sistemas
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
