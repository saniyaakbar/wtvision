import styles from './page.module.scss';
import ItemCarousel from '@/components/card';

const ItemsPage = () => {

  return (
    <div className={styles.container}>
        <ItemCarousel  />
      
    </div>
  );
};

export default ItemsPage;
