const Spinner: React.FC = (): JSX.Element => {
  return (
    <div className="d-flex justify-content-center">
      <div className="ClipLoader">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default Spinner;
