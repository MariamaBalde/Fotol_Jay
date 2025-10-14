import { Injectable } from '@angular/core';
import { 
  Camera, 
  CameraResultType, 
  CameraSource,
  CameraDirection
} from '@capacitor/camera';
import { Platform } from '@angular/cdk/platform';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface ImageUploadee {
  url: string;
  urlMiniature: string;
  ordre: number;
  metadata: {
    largeur: number;
    hauteur: number;
    taille: number;
  };
}

export interface ReponseUpload {
  message: string;
  images: ImageUploadee[];
}

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private apiUrl = `${environment.apiUrl}/produits/upload`;

  constructor(
    private http: HttpClient,
    private platform: Platform
  ) {}

  async prendrePhoto(): Promise<string> {
    try {
      // Check if running in Capacitor (native mobile app)
      if ((window as any).Capacitor && (window as any).Capacitor.isNativePlatform()) {
        return await this.prendrePhotoMobile();
      } else {
        return await this.prendrePhotoWeb();
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      throw new Error('Impossible de prendre la photo');
    }
  }

  private async prendrePhotoWeb(): Promise<string> {
    try {
      // Essayer d'abord la caméra web si disponible
      const base64FromCamera = await this.prendrePhotoWebCamera();
      return base64FromCamera;
    } catch (error) {
      console.warn('Caméra web non disponible, utilisation du sélecteur de fichiers:', error);
      // Fallback vers le sélecteur de fichiers
      return this.prendrePhotoWebFile();
    }
  }

  private async prendrePhotoWebCamera(): Promise<string> {
    return new Promise((resolve, reject) => {
      // Vérifier si getUserMedia est disponible
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Caméra non supportée sur ce navigateur');
      }

      // Créer un élément vidéo temporaire
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      // Demander l'accès à la caméra
      navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Caméra arrière
      })
      .then(stream => {
        video.srcObject = stream;
        video.play();

        video.onloadedmetadata = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // Prendre la photo automatiquement après 2 secondes
          setTimeout(() => {
            if (context) {
              context.drawImage(video, 0, 0, canvas.width, canvas.height);
              const base64 = canvas.toDataURL('image/jpeg', 0.9);

              // Arrêter le stream
              stream.getTracks().forEach(track => track.stop());

              resolve(base64);
            } else {
              reject(new Error('Impossible d\'accéder au contexte canvas'));
            }
          }, 2000);

          // Afficher un message à l'utilisateur
          alert('Photo prise automatiquement dans 2 secondes. Souriez ! 📸');
        };

        video.onerror = () => {
          stream.getTracks().forEach(track => track.stop());
          reject(new Error('Erreur lors de l\'accès à la caméra'));
        };
      })
      .catch(error => {
        reject(new Error('Permissions caméra refusées ou caméra indisponible'));
      });
    });
  }

  private async prendrePhotoWebFile(): Promise<string> {
    return new Promise((resolve, reject) => {
      // Créer un élément input file invisible
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment'; // Force l'utilisation de la caméra arrière

      input.onchange = async (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          reject(new Error('Aucune photo sélectionnée'));
          return;
        }

        try {
          // Convertir en base64
          const base64 = await this.fileToBase64(file);
          resolve(base64);
        } catch (error) {
          reject(error);
        }
      };

      // Déclencher le sélecteur de fichier
      input.click();
    });
  }

  private async prendrePhotoMobile(): Promise<string> {
    try {
      const permissions = await Camera.requestPermissions();

      if (permissions.camera !== 'granted') {
        throw new Error('Permissions caméra refusées. Veuillez autoriser l\'accès à la caméra dans les paramètres de l\'application.');
      }

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        direction: CameraDirection.Rear,
        correctOrientation: true,
        saveToGallery: false
      });

      if (!image.base64String) {
        throw new Error('Échec de capture de la photo');
      }

      return `data:image/jpeg;base64,${image.base64String}`;
    } catch (error: any) {
      console.error('Erreur dans prendrePhotoMobile:', error);
      if (error.message.includes('User cancelled')) {
        throw new Error('Capture annulée par l\'utilisateur');
      } else if (error.message.includes('Permission denied')) {
        throw new Error('Permissions caméra refusées. Veuillez autoriser l\'accès à la caméra dans les paramètres de l\'application.');
      } else {
        throw new Error('Erreur lors de la capture de la photo: ' + error.message);
      }
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  // Upload des images vers le serveur
  uploadImages(imagesBase64: string[]): Observable<ReponseUpload> {
    const formData = new FormData();
    
    imagesBase64.forEach((base64, index) => {
      const blob = this.base64ToBlob(base64);
      formData.append('images', blob, `photo_${index}.jpg`);
    });

    return this.http.post<ReponseUpload>(`${this.apiUrl}/images`, formData);
  }

  private base64ToBlob(base64: string): Blob {
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], { type: mimeString });
  }
}