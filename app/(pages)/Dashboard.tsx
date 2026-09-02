import { View, Text } from "react-native";
import useFetch from "@/services/useFetch";
import { useEffect, useState } from "react";
// import useAuth from "@/hooks/useAuth";
const Dashboard = () => {
  const fetchAPI = useFetch();
  // const { logout } = useAuth();

  const [users, setUsers] = useState([]);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetchAPI("http://10.136.47.54:5001/users", "GET");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error);

      }
    };
    fetchUsers();
  },[fetchAPI]);
  return (
    <View>
      <Text>{users.toString()}</Text>
    </View>
  );
};

export default Dashboard;
