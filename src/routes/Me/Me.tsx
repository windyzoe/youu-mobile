import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input, Cell, Button, Message, Icon } from 'zarm';

const Me: React.FC<{}> = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const onSubmit = (data: any) => console.log(data);

  return (
    <div style={{ margin: '20px' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Cell
          title="姓名"
          help={
            errors.name ? (
              <Message theme="danger" icon={<Icon type="warning-round" size="sm" />}>
                {errors.name.message ? errors.name.message : 'name is required'}
              </Message>
            ) : (
              ''
            )
          }
        >
          <Controller
            name="name"
            control={control}
            defaultValue="123555"
            rules={{ required: true }}
            render={({ field }) => <Input placeholder="请输入姓名" {...field} />}
          />
        </Cell>
        <Button htmlType="submit" block>
          提交
        </Button>
      </form>
    </div>
  );
};

export default Me;
