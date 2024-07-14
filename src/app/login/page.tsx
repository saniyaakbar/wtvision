"use client"
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, selectAuth } from '@/app/lib/features/auth/authSlice';
import { AppDispatch } from '@/app/lib/store';
import styles from './login.module.scss';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Github, LinkedinIcon } from 'lucide-react';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { error, status, user } = useSelector(selectAuth);
  useEffect(() => {
    if(user){
      router.push('/items')
    }
  }, [])
  
const router = useRouter()
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
   
   const data = await  dispatch(login({ username, password }));
  if(data.type.split('/')[2] === 'fulfilled'){
    router.push('/items')
  }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginLeft}>
      <Image
              src="/vision1.webp"
              alt=""
              width={930}
              height={740}
            />
      </div>
      <div className={styles.loginRight}>
      <Image
              src="/logo.png"
              alt=""
              width={100}
              height={20}
            />
            <h1 className={styles.loginTitle}>Login Portal</h1>
            <form className={styles.form} >
        <div className={styles.input}>
          <input className={styles.loginInput}
            type="text"
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className={styles.input}>
          <input className={styles.loginInput}
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.buttons}>
        <p>Forgot Password</p>
        <button className={styles.button} onClick={(e) => handleLogin(e)}>Login</button>
        </div>
              </form>
              <div className={styles.bottom}>
                <p style={{letterSpacing: "0.3rem"}}>Or Login With</p>
                <p className={styles.icons}><LinkedinIcon /> LinkedIn</p>
               <p className={styles.icons}> <Github /> Github</p>
              </div>
      {status === 'loading' && <p>Loading...</p>}
      {error && <p>{error}</p>}
   
      </div>
        
      
    </div>
  );
};

export default LoginPage;
