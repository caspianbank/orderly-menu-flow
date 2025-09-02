export interface Story {
  id: string;
  type: 'interior' | 'meal';
  title: string;
  image: string;
  duration: number; // in seconds
  timestamp: Date;
  author: {
    name: string;
    avatar: string;
  };
  loves: number;
  isLoved: boolean;
  responses: StoryResponse[];
}

export interface StoryResponse {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  message: string;
  timestamp: Date;
}

export interface StoryCollection {
  id: string;
  restaurantName: string;
  avatar: string;
  stories: Story[];
  hasUnread: boolean;
}