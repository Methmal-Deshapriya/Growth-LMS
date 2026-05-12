export type Bootcamp = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  certificateEnabled: boolean;
  skills: string[];
  createdAt: string;
};

export type BootcampAdmin = Bootcamp & {
  isPublished: boolean;
  updatedAt: string;
};

export type CreateBootcampRequest = {
  title: string;
  slug: string;
  description?: string;
  price: number;
  certificateEnabled?: boolean;
  skills?: string[];
};

export type UpdateBootcampRequest = Partial<CreateBootcampRequest> & {
  isPublished?: boolean;
};