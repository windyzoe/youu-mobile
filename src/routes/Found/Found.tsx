import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input, Cell, Button, Message, Icon } from 'zarm';

const Found: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
  });

  const onSubmit = (data: any) => console.log(data);
  console.log('%c π xuzh found', 'color: red; font-size: 18px;', 1);

  return (
    <div style={{ margin: '20px' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Cell
          title="ε§ε"
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
            render={({ field }) => <Input placeholder="θ―·θΎε₯ε§ε" {...field} />}
          />
        </Cell>
        <Button htmlType="submit" block>
          ζδΊ€
        </Button>
      </form>
    </div>
  );
};

export default Found;
