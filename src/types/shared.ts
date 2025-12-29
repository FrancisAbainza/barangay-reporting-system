export interface Image {
  uri: string;
}

export interface Reply {
  id: string;
  userId: string;
  userName: string;
  content: string;
  isAdmin?: boolean;
  likes?: string[];
  dislikes?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  isAdmin?: boolean;
  likes?: string[];
  dislikes?: string[];
  replies?: Reply[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunitySentiment {
  sentiment: 'supportive' | 'positive' | 'negative' | 'neutral';
  summary: string;
}
