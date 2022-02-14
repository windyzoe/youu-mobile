import img from '@/assets/statusImg/建设中.svg';

export default () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'auto' }}>
    <img src={img} style={{ width: '80vw' }} alt="建设中" />
    <div>
      <h1 style={{ fontSize: '3rem' }}>功能建设中...</h1>
    </div>
  </div>
);
