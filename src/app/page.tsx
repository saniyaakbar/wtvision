"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { Provider } from 'react-redux';
import store from '@/app/lib/store';
import { useRouter } from "next/navigation";
export default function Home() {
  
  const router = useRouter()
  return (
    <Provider store={store}>
     
     <main className={styles.main}>
      <h1 className={styles.heading}>WeTvision Assignment</h1>
      <div className={styles.cards}>
      <div className={styles.card} onClick={()=> router.push('/login')}>
        Go to login page
      </div>
      <div className={styles.card} onClick={()=> router.push('/items')}>
       See All Items
      </div>
      </div>
     
    </main>
    </Provider>
    
  );
}
