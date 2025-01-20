"use client"
import { addUser } from '@/store/slice/user';
import { merastore } from '@/store/store';
import React from 'react'
import { Provider, useDispatch } from 'react-redux';

export default function Page(){
    return <Provider store={merastore}>
        <Info/>
    </Provider>
}
 function Info() {
    let dispatch = useDispatch()
     useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const decoded = jwtDecode(token);
            dispatch(
              addUser({ email: decoded.email, firstName: decoded.firstName })
            );
          } catch (error) {
            localStorage.removeItem("token");
            alert(error.message);
          }
        }
      }, [dispatch]);
  return (
    <div>
      
    </div>
  )
}
