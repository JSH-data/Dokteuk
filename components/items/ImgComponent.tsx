type ImgProps = {
  urls: string[];
};

const ImgComponent: React.FC<ImgProps> = ({ urls }) => {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        margin: '10px 0',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
      }}
    >
      {urls.length > 1 && (
        <div
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <span style={{ color: 'white' }}>+{urls.length}</span>
        </div>
      )}

      <img
        style={{ objectFit: 'cover', width: '100%' }}
        src={`${urls[0]}`}
        alt="test"
      />
    </div>
  );
};

export default ImgComponent;
