import { createGlobalStyle } from 'styled-components';
import GmarketSansTTFBold from '../fonts/GmarketSansTTFBold.ttf';
import GmarketSansTTFMedium from '../fonts/GmarketSansTTFMedium.ttf';
import GmarketSansTTFLight from '../fonts/GmarketSansTTFLight.ttf';

const GlobalStyle = createGlobalStyle`
  @font-face {
        font-family: 'GmarketSansTTFBold';
        src: local('GmarketSansTTFBold'), local('GmarketSansTTFBold');
        font-style: normal;
        src: url(${GmarketSansTTFBold}) format('truetype');
  }
  @font-face {
        font-family: 'GmarketSansTTFMedium';
        src: local('GmarketSansTTFMedium'), local('GmarketSansTTFMedium');
        font-style: normal;
        src: url(${GmarketSansTTFMedium}) format('truetype');
  }
  @font-face {
        font-family: 'GmarketSansTTFLight';
        src: local('GmarketSansTTFLight'), local('GmarketSansTTFLight');
        font-style: normal;
        src: url(${GmarketSansTTFLight}) format('truetype');
  }