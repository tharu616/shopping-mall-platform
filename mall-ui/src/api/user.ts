import http from "./http";

export type UserDto = { id: number; email: string; fullName: string; role: string; active: boolean };

export async function getMe() {
  const { data } = await http.get<UserDto>("/users/me");
  return data;
}

export async function updateMe(fullName: string) {
  const { data } = await http.put<UserDto>("/users/me", { fullName });
  return data;
}
