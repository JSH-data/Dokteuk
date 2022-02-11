type ImgProps = {
  url: string;
};

const ImgComponent: React.FC<ImgProps> = ({ url }) => {
  return (
    <div style={{ flex: 1, display: 'flex', padding: '10px 0' }}>
      <img
        style={{ objectFit: 'cover', width: '100%' }}
        src={`${url}`}
        alt="test"
      />
    </div>
  );
};

export default ImgComponent;
