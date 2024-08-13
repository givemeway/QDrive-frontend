import { useState } from "react";
export const Image = ({
  src,
  srcSet,
  alt,
  ShowLoading,
  ErrorIcon,
  sizes,
  style,
  className,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <>
      {loading && <ShowLoading />}
      {
        <img
          alt={alt}
          src={src}
          srcSet={srcSet}
          style={loading || error ? { display: "none" } : {}}
          onLoad={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
          sizes={sizes}
          {...style}
          className={`${className ? className : ""}`}
        />
      }
      {error && <ErrorIcon />}
    </>
  );
};
