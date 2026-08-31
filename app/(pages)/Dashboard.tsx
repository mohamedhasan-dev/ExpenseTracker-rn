import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import useAuth from '@/hooks/useAuth'
const Dashboard = () => {

  const {logout}  = useAuth()
  // useEffect(()=>{
  //   logout()
  // })

  return (
    <View>
      <Text>Dashboard</Text>
    </View>
  )
}

export default Dashboard