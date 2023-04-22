// @ts-ignore
import styled from "styled-components";
const loaderIcon = require('../images/loader.svg');

interface ILoader {
    size?: number
}
const Loader = styled.div<ILoader>`
  background-image: url(${loaderIcon});
  width: ${p => p.size ? `${p.size}px` : '50px'};
  height: ${p => p.size ? `${p.size}px` : '50px'};
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
`;

enum LoaderState {
    LOADED,
    LOADING,
    ERROR
}

export {
    Loader,
    LoaderState
}