import { auth } from "./firebase";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export type Profile = {
  _id: string;
  name: string;
  username: string;
  email: string;
  profileImage?: string;
  bio?: string;
  location?: string;
  college?: string;
  degree?: string;
  graduationYear?: number;
  skills?: string[];
  interests?: string[];
};

export type Comment = { _id: string; content: string; author: Pick<Profile, "_id" | "name" | "username" | "profileImage"> };
export type Post = { _id: string; content: string; image?: string; likes: string[]; comments: Comment[]; author: Pick<Profile, "_id" | "name" | "username" | "profileImage">; createdAt: string };

export async function apiRequest<T>(path: string, options: RequestInit = {}) {
  const token = auth.currentUser ? await auth.currentUser.getIdToken() : undefined;
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || `API request failed with ${response.status}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const skillCircleApi = {
  health: () => apiRequest<{ status: string; service: string }>("/health"),
  posts: (page = 1, limit = 20) => apiRequest<{ posts: Post[]; page: number; hasMore: boolean }>(`/posts?page=${page}&limit=${limit}`),
  me: () => apiRequest<{ user: Profile }>("/users/me"),
  createPost: (content: string, image?: string) => apiRequest<{ post: Post }>("/posts", { method: "POST", body: JSON.stringify({ content, ...(image ? { image } : {}) }) }),
  likePost: (postId: string) => apiRequest<{ liked: boolean; likeCount: number }>(`/posts/${postId}/like`, { method: "POST" }),
  commentPost: (postId: string, content: string) => apiRequest<{ comments: Comment[] }>(`/posts/${postId}/comments`, { method: "POST", body: JSON.stringify({ content }) }),
  uploadImage: (image: string, kind: "post" | "profile" = "post") => apiRequest<{ url: string }>("/uploads/image", { method: "POST", body: JSON.stringify({ image, kind }) }),
  updateProfile: (profile: Partial<Profile>) => apiRequest<{ user: Profile }>("/users/me", { method: "PATCH", body: JSON.stringify(profile) }),
};
