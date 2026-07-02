import { IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonThumbnail } from '@ionic/react';
import './ReporItem.css'
import React from 'react'
import { pencil, trash } from 'ionicons/icons';
import { Repository } from '../interfaces/Repository';


type RepoItemProps = Repository & {
    onEdit: () => void;
    onDelete: () => void;
};


const ReporItem: React.FC<RepoItemProps> = ({ onEdit, onDelete, ...repository }) => {
    return (
        <IonItemSliding>
            <IonItem>
                <IonThumbnail slot='start'>
                    <img src={repository.owner.avatar_url} alt={repository.name} />
                </IonThumbnail>

                <IonLabel>
                    <h3>{repository.name}</h3>
                    <p>{repository.description}</p>
                    <p><strong>lenguaje: </strong>{repository.language}</p>
                </IonLabel>
            </IonItem>

            <IonItemOptions>
                <IonItemOption color="light" onClick={onEdit}>
                    <IonIcon icon={pencil} slot='icon-only' />
                </IonItemOption>

                <IonItemOption color="danger" onClick={onDelete}>
                    <IonIcon icon={trash} slot='icon-only' />
                </IonItemOption>
            </IonItemOptions>
        </IonItemSliding>
    )
}

export default ReporItem