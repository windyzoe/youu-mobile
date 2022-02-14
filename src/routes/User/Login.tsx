import React, { useState, useEffect } from 'react';
import { useMount } from 'ahooks';
import { Carousel } from 'zarm';

const ITEMS = [
  'https://static.zhongan.com/website/health/zarm/images/banners/1.png',
  'https://static.zhongan.com/website/health/zarm/images/banners/2.png',
  'https://static.zhongan.com/website/health/zarm/images/banners/3.png',
];

const contentRender = () =>
  ITEMS.map((item, i) => (
    <div className="carousel__item__pic" key={+i}>
      <img src={item} alt="" draggable={false} />
    </div>
  ));

const Login = () => {
  const [submitting, setSubmitting] = useState(false);

  useMount(() => {
    // 检查是否在登陆状态,就直接进应用
    // validateToken();
  });

  return (
    <Carousel
      autoPlay
      loop
      onChange={index => {
        console.log(`onChange: ${index}`);
      }}
    >
      {contentRender()}
    </Carousel>
  );
};

export default Login;
