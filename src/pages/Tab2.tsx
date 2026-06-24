import { IonButton, IonContent, IonHeader, IonInput, IonPage, IonText, IonTextarea, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';

import './Tab2.css';
import { useHistory } from 'react-router';
import { useState } from 'react';
import { RepositoryPayload } from '../interfaces/RepositoryPayload';
import { create } from 'axios';
import { createRepository } from '../services/GithubService';
import LoadingSpinner from '../components/LoadingSpinner';

const Tab2: React.FC = () => {
  const history = useHistory();
  const [repositoryData, setRepositoryData] = useState<RepositoryPayload>({
    name:"",
    description:""
  });
  const [loading,setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState ("");
  const saveRepo = async() =>{
    if(repositoryData.name.trim() == ''){
      setErrorMsg("el nombre del repositorio es obligatorio");
      return;
    }
    setLoading(true);
    createRepository(repositoryData)
      .then(() => history.push("/tab1"))
      .catch((error) => setErrorMsg("Estas mal" + error))
      .finally(() => setLoading(false)); 
      setRepositoryData({
        name:"",
        description:""
      });
  };
  useIonViewWillEnter(() => {
    setErrorMsg("");
  })
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Formulario de repositorio</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Formulario de repositorios</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="form container">
          <IonInput
            className="form-field"
            label="Nombre del repositorio" 
            labelPlacement="floating"
            placeholder="Ingrese el nombre del repositorio"
            value={repositoryData.name}
            onIonChange={(e) => setRepositoryData({...repositoryData, name : e.detail.value!})}

          />
          <IonTextarea
            className="form-field"
            label="Descripcion del repositorio" 
            labelPlacement="floating"
            placeholder="Ingrese la descripcion del repositorio"
            value={repositoryData.description}
            onIonChange={(e) => setRepositoryData({...repositoryData, description : e.detail.value!})}
            rows={6}
          />
          {errorMsg != "" && <IonText color="danger">{errorMsg}</IonText>}
          <IonButton
          className="form-field"
          expand='block'
//          shape='round'
          color="primary"
          onClick={saveRepo}
          >
            Guardar
          </IonButton>
        </div>
        {loading && <LoadingSpinner/>}
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
