import React, { useEffect, useState } from 'react';
import { Carousel, Cell, Icon, SearchBar } from 'zarm';
import { useMount } from 'ahooks';
import dayjs from 'dayjs';
import { useGlobalData } from '@/components/StoreContext';
import BasicContentLayout from '@/layouts/BasicContentLayout';
import IconPro from '@/components/IconPro';
import CircleIcon from '@/components/IconPro/CircleIcon';
import { InfiniteScroll } from '@/components/InfiniteScroll';
import { juejinList } from '@/services/juejin';
import styles from './Home.less';

const ITEMS = [
  'https://static.zhongan.com/website/health/zarm/images/banners/1.png',
  'https://static.zhongan.com/website/health/zarm/images/banners/2.png',
  'https://static.zhongan.com/website/health/zarm/images/banners/3.png',
];

const contentRender = () => {
  return ITEMS.map((item, i) => {
    return (
      <div className={styles.pic} key={+i}>
        <img src={item} alt="" draggable={false} />
      </div>
    );
  });
};

const Card: React.FC<{
  user: string;
  time: string;
  desc: string;
  share: number;
  star: number;
  comment: number;
  avatar: string;
  title?: string;
}> = ({ user, time, desc, share, star, comment, avatar, title }) => {
  return (
    <div className={styles.card}>
      <div className={styles.bar}>
        <div className={styles.avatar}>
          <img src={avatar} alt="avatar" />
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{user}</div>
          <div className={styles.time}>{time}</div>
        </div>
      </div>
      <div className={styles.title}>{title}</div>
      <div className={styles.desc}>{desc}</div>
      <div className={styles.action}>
        <div className={styles.share}>
          <IconPro type="icon-fenxiang" />
          {share}
        </div>
        <div className={styles.comment}>
          <IconPro type="icon-pinglun" />
          {comment}
        </div>
        <div className={styles.star}>
          <IconPro type="icon-dianzan" />
          {star}
        </div>
        <div className={styles.close}>x</div>
      </div>
    </div>
  );
};

const Home = () => {
  const [cursor, setCursor] = useState('0');
  const [data, setData] = useState<Array<any>>([]);
  const [hasMore, setHasMore] = useState(true);
  const { state, dispatch } = useGlobalData();
  const loadMore = async () => {
    const res: any = await juejinList(cursor);
    setData(val => [...val, ...(res?.data ?? [])?.filter((v: any) => v.item_type === 2)]);
    setCursor(res?.cursor);
    setHasMore(res?.has_more);
  };

  return (
    <BasicContentLayout>
      <div className={styles.dash}>
        <SearchBar shape="round" />
        <IconPro
          type="icon-tixing"
          onClick={() =>
            dispatch({
              type: 'changeData',
              payload: { theme: state.theme === 'light' ? 'dark' : 'light' },
            })
          }
        />
      </div>
      <Carousel className={styles.carousel} autoPlay>
        {contentRender()}
      </Carousel>
      <div className={styles.toolBar}>
        <CircleIcon>
          <IconPro type="icon-tixing" />
        </CircleIcon>
        <CircleIcon>
          <IconPro type="icon-remen" />
        </CircleIcon>
        <CircleIcon>
          <IconPro type="icon-erweima2" />
        </CircleIcon>
        <CircleIcon>
          <IconPro type="icon-qiche" />
        </CircleIcon>
        <CircleIcon>
          <IconPro type="icon-huojian_2" />
        </CircleIcon>
      </div>
      <InfiniteScroll hasMore={hasMore} loadMore={loadMore}>
        {data.map((v: any) => {
          return (
            <Card
              user={v?.item_info?.author_user_info?.user_name}
              desc={v?.item_info?.article_info?.brief_content}
              star={v?.item_info?.article_info?.digg_count}
              comment={v?.item_info?.article_info?.comment_count}
              share={v?.item_info?.article_info?.collect_count}
              time={dayjs.unix(v?.item_info?.article_info?.ctime).format('YYYY-MM-DD')}
              avatar={v?.item_info?.author_user_info?.avatar_large}
            />
          );
        })}
      </InfiniteScroll>
    </BasicContentLayout>
  );
};

export default Home;
