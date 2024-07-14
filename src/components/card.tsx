"use client";
import React, { useEffect, useState } from 'react';
import styles from './ItemCarousel.module.scss';
import { parseJSONObjects } from './parseObject';
import {useDispatch, useSelector } from 'react-redux';
import {logout, selectAuth } from '@/app/lib/features/auth/authSlice';
import { useRouter } from 'next/navigation';

// Define types for the JSON data
type ItemType = {
  created: string;
  failure_reason: string | null;
  id: string;
  key: string;
  modified: string;
  status: string;
  type: string;
  value: string;
};

type ParsedData = {
  id: string;
  key: string;
  type: {
    properties: Record<string, any>;
  };
  value: Record<string, any>;
};

const ItemCarousel: React.FC = () => {
  const [data, setData] = useState<ParsedData[] | null>(null);
  const { user } = useSelector(selectAuth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout()); 
    router.push('/login')
  };
  const handleLogin = () => {
    router.push('/login')
  };

  useEffect(() => {
    fetch('/data/data.json')
      .then((response) => response.json())
      .then((jsonData: ItemType[]) => setData(parseJSONObjects(jsonData)));
  }, []);

  const formatTypeProperties = (obj: Record<string, any>, prefix = '', val: Record<string, any>, onChange: (key: string, value: any) => void) => {
    let result: any[] = [];
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key].type === 'array' && obj[key].items) {
          if (obj[key].items.type === 'object' && obj[key].items.properties) {
            for (let key2 in val[key]) {
              let result2: any[] = [];
              result2 = result2.concat(formatTypeProperties(obj[key].items.properties, `${prefix}`, val[key][key2], onChange));
              result.push(result2);
            }
          } else {
            result.push(
              <div key={key}>
                <label>{prefix}{key}: </label>
                <textarea className={styles.itemInput}
                
                  defaultValue={val[key]}
                  onChange={(e) => onChange(key, e.target.value)}
                />
              </div>
            );
          }
        } else {
          if (obj[key].type === 'object' && obj[key].properties) {
            result = result.concat(formatTypeProperties(obj[key].properties, `${prefix}`, val[key], onChange));
          } else {
            result.push(
              <div key={key}>
                <label>{prefix}{key}: </label>
                <textarea className={styles.itemInput}
                
                  defaultValue={val[key]}
                  onChange={(e) => onChange(key, e.target.value)}
                />
              </div>
            );
          }
        }
      }
    }
    return result;
  };

  const handleValueChange = (index: number, key: string, value: any) => {
    if (data) {
      console.log(data, value)
      const newData = [...data];
      newData[index].value[key] = value;
      setData(newData);
    }
  };

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.allTitles}> 
        <h1 className={styles.title}>All Items</h1>
      {user?
      <button className={styles.logout}
      onClick={() => handleLogout()}
      >Logout</button> : 
      <button className={styles.logout}
      onClick={() => handleLogin()}
      >Login</button>} </div>
      
      {data ? (
        <>
          <div>
            {data.map((item, index) => (
              <div key={item.id}>
                <h2>{index + 1}. {item.key}</h2>
                <div className={styles.parentCards}>
                  {formatTypeProperties(item.type.properties, '', item.value, (key, value) => handleValueChange(index, key, value)).map((prop, idx) => (
                    <div className={styles.card} key={idx}>
                      {prop}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default ItemCarousel;
