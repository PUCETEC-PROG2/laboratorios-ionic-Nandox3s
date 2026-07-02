import { IonButton, IonContent, IonHeader, IonInput, IonPage, IonText, IonTextarea, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';

import './Tab2.css';
import { useHistory, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { createRepository, hasGithubAuthFailure, updateRepository } from '../services/GithubService';
import LoadingSpinner from '../components/LoadingSpinner';
import { Repository } from '../interfaces/Repository';

type LocationState = {
  repo?: Repository;
};

const Tab2: React.FC = () => {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const editingRepository = location.state?.repo ?? null;
  const [repositoryData, setRepositoryData] = useState({
    name: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (editingRepository) {
      setRepositoryData({
        name: editingRepository.name,
        description: editingRepository.description ?? ""
      });
      setErrorMsg("");
      return;
    }

    setRepositoryData({
      name: "",
      description: ""
    });
    setErrorMsg("");
  }, [editingRepository]);

  const resetToCreateMode = () => {
    setRepositoryData({
      name: "",
      description: ""
    });
    setErrorMsg("");
    history.replace("/tab1");
  };

  const saveRepo = async () => {
    if (hasGithubAuthFailure()) {
      setErrorMsg("GitHub rechazó el token. Corrige el archivo .env y recarga la app.");
      return;
    }

    if (repositoryData.name.trim() === '') {
      setErrorMsg("El nombre del repositorio es obligatorio");
      return;
    }

    setLoading(true);
    try {
      if (editingRepository) {
        await updateRepository(editingRepository.owner.login, editingRepository.name, repositoryData);
        history.replace("/tab1", {
          successMessage: "Repositorio actualizado correctamente"
        });
      } else {
        await createRepository(repositoryData);
        history.replace("/tab1", {
          successMessage: "Repositorio creado correctamente"
        });
      }
    } catch (error) {
      setErrorMsg("Error al guardar repositorio. " + error);
    } finally {
      setLoading(false);
    }
  };

  useIonViewWillEnter(() => {
    setErrorMsg("");
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{editingRepository ? "Actualizar Repositorio" : "Crear Repositorio"}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{editingRepository ? "Actualizar Repositorio" : "Crear Repositorio"}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="form container">
          {editingRepository && (
            <div className="ion-padding-bottom">
              <IonText color="medium">
                <p><strong>ID:</strong> {editingRepository.id}</p>
                <p><strong>Autor:</strong> {editingRepository.owner.login}</p>
                <p><strong>Lenguaje:</strong> {editingRepository.language || 'Sin definir'}</p>
              </IonText>
            </div>
          )}

          <IonInput
            className="form-field"
            label="Nombre del repositorio" 
            labelPlacement="floating"
            placeholder="Ingrese el nombre del repositorio"
            value={repositoryData.name}
            onIonChange={(e) => setRepositoryData({...repositoryData, name: e.detail.value ?? ""})}

          />
          <IonTextarea
            className="form-field"
            label="Descripcion del repositorio" 
            labelPlacement="floating"
            placeholder="Ingrese la descripcion del repositorio"
            value={repositoryData.description}
            onIonChange={(e) => setRepositoryData({...repositoryData, description: e.detail.value ?? ""})}
            rows={6}
          />
          {errorMsg !== "" && <IonText color="danger">{errorMsg}</IonText>}
          <IonButton
            className="form-field"
            expand='block'
            color="primary"
            onClick={saveRepo}
          >
            {editingRepository ? "Actualizar Repo" : "Crear Repo"}
          </IonButton>
          <IonButton
            className="form-field"
            expand='block'
            fill="outline"
            color="medium"
            onClick={resetToCreateMode}
          >
            Cancelar
          </IonButton>
        </div>
        {loading && <LoadingSpinner/>}
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
