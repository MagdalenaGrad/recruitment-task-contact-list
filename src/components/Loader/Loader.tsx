import "./Loader.css";

interface LoaderProps {
  text?: string;
}

export const Loader = ({ text = "Loading..." }: LoaderProps) => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      {text && <div className="loader-text">{text}</div>}
    </div>
  );
};

