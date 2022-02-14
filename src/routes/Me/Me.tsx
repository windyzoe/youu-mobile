import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input, Cell, Button, Message, Icon } from 'zarm';

const Me: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const onSubmit = (data: any) => console.log(data);
  console.log('%c 🚀 xuzh me', 'color: red; font-size: 18px;', 11);

  return <div style={{ width: '100vw', height: '100%', overflow: 'hidden' }}>11</div>;
};

export default Me;
