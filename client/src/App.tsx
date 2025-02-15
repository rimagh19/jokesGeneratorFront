import { useNavigate } from "react-router-dom"; 
import "./style/App.css";

function App() {
  const navigate = useNavigate();

  const handleStartButtonClick = () => {
    navigate('/jokes'); 
  };
  const handleAddButtonClick = () =>{
    navigate('/add'); 
  }

  return (
    <>
      <div className="inner inner-right">
        <h1 id="title">نـــكـتـــة</h1>
        <p id="desc">في <span className="name">نـكـتــة</span> تقدر شوف نكت الناس وتقيمها!</p>
        <div id="btn-main-holder">
          <button className="btn-main start-btn" onClick={handleStartButtonClick}> 
            يلا نبدأ 
          </button> 

          <button className="btn-main add-btn" onClick={handleAddButtonClick}>
            اضيف نكتة
          </button>
        </div>
      </div>
      <div className="inner inner-left">
        <img className="img-boy" src="../bg.png"></img>
      </div>
    </>
  );
}

export default App;