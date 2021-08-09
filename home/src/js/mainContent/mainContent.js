import '../../css/mainContent/mainContent.css';
import PairMenu from './pairMenu';
import Page from './page';

const MainContent = new function() {
  this.pairMenu = PairMenu;

  this.render = function() {
    return (
      <div id='mainContent'>
        <Page/>

        <Page>
        </Page>
        <PairMenu.render/>
      </div>
    );
  }
}

export default MainContent;