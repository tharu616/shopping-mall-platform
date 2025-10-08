import http from "./http";

export async function loginApi(email: string, password: string) {
  const { data } = await http.post("/auth/login", { email, password });
  // Expect { token: string }
  if (!data?.token) throw new Error("No token in response");
  return data as { token: string };
}

export async function registerApi(payload: { email: string; password: string; fullName: string; role?: string }) {
  const { data } = await http.post("/auth/register", payload);
  // Expect { token: string }
  if (!data?.token) throw new Error("No token in response");
  return data as { token: string };
}
