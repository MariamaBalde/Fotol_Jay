export interface Notification {
  id: string;
  type: string;
  titre: string;
  message: string;
  estLu: boolean;
  dateCreation: Date;
}

export interface ReponseNotifications {
  notifications: Notification[];
  pagination: {
    page: number;
    limite: number;
    total: number;
    totalPages: number;
  };
  nonLues: number;
}