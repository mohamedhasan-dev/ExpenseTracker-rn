
export default async function login(
  nameoremail: string,
  password: string,
  setLoading: (arg:boolean) => void
): Promise<any> {
  try {
    setLoading(true)
    const res = await fetch("http://10.183.217.54:5001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nameoremail,
        password,
      }),
    });
    const isSucces:string = await res.json()
    setLoading(false)
    if (isSucces.toLowerCase() === 'success') {
        return true
    } return false
  } catch (error) {
    console.error(error);
    console.log(`from login API ${nameoremail} ${password}`);
    return false
  }
}
