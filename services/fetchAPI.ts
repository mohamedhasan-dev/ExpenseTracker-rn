import useAuth from "@/hooks/useAuth";


async function fetchAPI(url: string, method: string) {

  const {authenticate} =   useAuth()
  const res = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res
}

export default fetchAPI;
