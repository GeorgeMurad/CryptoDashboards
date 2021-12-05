import React from "react";
import styled, {css} from "styled-components";
import { AppContext } from "./AppProvider";

const Logo = styled.div`
 font-size: 1.9em;
 color: white;
`
const Bar = styled.div`
display: grid;
margin-bottom: 40px;
grid-template-columns: 180px auto 100px 100px;
`
const ConttrolButtonElem = styled.div`
cursor: pointer;
${props => props.active && css`
   text-shadow: 0px 0px 60px rgb(255, 255, 255);
`}
${props => props.hidden && css`
  display: none;
`}
`
function toProperCase(lower){
    return lower.charAt(0).toUpperCase() + lower.substr(1);
}
function ControlButton({name}){
    return(
        <AppContext.Consumer>
            {({firstVisit, page, setPage}) => (
            <ConttrolButtonElem 
              active={page === name}
              onClick={()=> setPage(name)}
              hidden={firstVisit && name === 'dashboard'} 
              >
                {toProperCase(name)}
            </ConttrolButtonElem>)}
        </AppContext.Consumer>
    );
}

export default function(){
    return(
        <Bar>
            <Logo>CryptoDash</Logo>
            <div/>
            <ControlButton active name="dashboard"/>
            <ControlButton  name="seetings"/>
        </Bar>
    );
}