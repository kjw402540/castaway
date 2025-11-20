export async function login(email, password) {
  if (email !== "test@test.com" || password !== "1234") {
    throw new Error("Invalid credentials");
  }

  return {
    token: "dummy-token",
    user: {
      id: 1,
      email: "test@test.com",
    },
  };
}
