import React from "react";
import Page from "../Shared/Page";
import PriceGrid from "./PriceGrid";
import CoinSpootlight from "./CoinSpootlight";
import styled from "styled-components";
import PriceChart from "./PriceChart";

const ChartGrid = styled.div`
    display: grid;
    margin-top: 50px;
    grid-gap: 15px;
    grid-template-columns: 1fr 3fr;
`

export default function(){
    return <Page name="dashboard">         
            <PriceGrid />
            <ChartGrid>
                <CoinSpootlight />
                <PriceChart />
            </ChartGrid>
          </Page>
}
