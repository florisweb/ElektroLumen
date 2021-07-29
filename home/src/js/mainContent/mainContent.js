import '../../css/mainContent/mainContent.css';
// import PairPage from './pairPage';
import Page from './page';

const MainContent = new function() {
  // this.pairPage = PairPage;

  this.render = function() {
    return (
      <div id='mainContent'>
        <Page/>
      </div>
    );
  }
}

export default MainContent;