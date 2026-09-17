export default async function login(
  nameoremail: string,
  password: string,
): Promise<string | false> {
  try {
    const res = await fetch("http://10.192.164.54:5001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nameoremail,
        password,
      }),
    });
    if (!res.ok) {
      return false;
    }
    const token = await res.json();
    if (token.token) {
      return token.token;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}
