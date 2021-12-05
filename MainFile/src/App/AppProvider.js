import React from "react";
import _ from "lodash";
import moment from "moment";

const cc = require('cryptocompare')
//cc.setApiKey('0a10e1e82ae92e446a6741ef0812da2f52573c05993739d1036772f52569e980');


export const AppContext = React.createContext();

const TIME_UNITS = 10;
const MAX_FAVORITES = 10;

export class AppProvider extends React.Component {
    constructor(props){
          super(props);
            this.state = {
                page: 'dashbpard',
                favorites: ['BTC', 'ETH', 'XMR', 'DOGE'],
                timeInterval: 'months',
                ...this.savedSettings(),
                setPage: this.setPage,
                addCoin:   this.addCoin,
                removeCoin:  this.removeCoin,
                isInFavorites: this.isInFavorites,
                confirmFavorites: this.confirmFavorites,
                setCurrentFavorite:   this.setCurrentFavorite,
                setFilteredCoins:   this.setFilteredCoins,
                changeChartSelect: this.changeChartSelect            
            }   
    }

    componentDidMount = () => {
        this.fetchCoins();
        this.fetchPrices();
        this.fetchHistorical();
    }

    fetchCoins = async () => {
        let coinList = (await cc.coinList()).Data;
        this.setState({coinList});
    }

    fetchPrices = async () => {
        if(this.state.firstVisit) return;
        let prices = await this.prices();
        this.setState({prices});
    }

    fetchHistorical = async () => 
        {
        if(this.state.firstVisit) return; 
        let results = await this.historical();
        let historical = 
        [
            {
                name: this.state.currentFavorite,
                data: results.map((ticker, index) => [
                moment().subtract({[this.state.timeInterval]: TIME_UNITS - index}).valueOf(),
                    ticker.USD
                ])
            }
        ]
               this.setState({historical});
        }
        

    prices = async () => {
          let returnData = [];
          for(let i = 0; i < this.state.favorites.length; i++){
              try {
                  let priceData = await cc.priceFull(this.state.favorites[i], 'USD');
                  returnData.push(priceData);
              } catch (e){
                  console.warn('Fetch price error: ', e);
              }
          } 
          return returnData;
      }

    historical = () => {
          let promises = [];
          for (let units = TIME_UNITS; units > 0; units--){
              promises.push(
                  cc.priceHistorical(
                      this.state.currentFavorite,
                      ['USD'],
                      moment()
                      .subtract({[this.state.timeInterval]: units})
                      .toDate()
                  )
              )
          }
          return Promise.all(promises);
      }

    addCoin = Key => {
        let favorites = [...this.state.favorites];
        if(favorites.length < MAX_FAVORITES){
            favorites.push(Key);
            this.setState({favorites});
        }
    }

    removeCoin = Key => {
        let favorites = [...this.state.favorites];
        this.setState({favorites: _.pull(favorites, Key)})
    }

    isInFavorites = Key => _.includes(this.state.favorites, Key)

    confirmFavorites = () => {
        let currentFavorite = this.state.favorites[0];
       this.setState({
           firstVisit: false,
           page: 'dashboard',
           currentFavorite,
           prices: null,
           historical:null
       }, () => {

        this.fetchPrices();
        this.fetchHistorical();
       });
       localStorage.setItem('cryptoDash', JSON.stringify({
           favorites: this.state.favorites,
           currentFavorite
       }));
    }

    setCurrentFavorite = (sym) => {
        this.setState({
            currentFavorite: sym,
            historical: null
        },  this.fetchHistorical);

        localStorage.setItem('cryptoDash', JSON.stringify({
            ...JSON.parse(localStorage.getItem('cryptoDash')),
            currentFavorite: sym
        }))
    }

    savedSettings(){
        let cryptoDashData = JSON.parse(localStorage.getItem('cryptoDash'));
        if (!cryptoDashData){
            return {page: 'settings', firstVisit: true}
        }
        let {favorites, currentFavorite} = cryptoDashData;
        return{favorites,currentFavorite};   
    }

    setPage = page => this.setState({page});

    setFilteredCoins = (filteredCoins) => this.setState({filteredCoins})

    changeChartSelect = (value) => {
        this.setState({timeInterval: value, historical: null}, this.fetchHistorical);
    }

    render(){
        return(
            <AppContext.Provider value={this.state}>
                {this.props.children}
            </AppContext.Provider>
        );
    }
}