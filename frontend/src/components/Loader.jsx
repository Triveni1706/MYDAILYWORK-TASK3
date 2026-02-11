const Loader = ({ text = "Loading..." }) => {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <p>{text}</p>
    </div>
  );
};

const styles = {
  container: {
    height: "60vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #ddd",
    borderTop: "4px solid #333",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

export default Loader;
