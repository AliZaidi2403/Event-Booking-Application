import { Blocks } from "react-loader-spinner";
import "./Loader.css";
function Loader() {
  return (
    <div className="loader">
      <Blocks
        visible={true}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
      />
    </div>
  );
}

export default Loader;
