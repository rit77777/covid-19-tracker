import React, { useEffect, useState } from 'react';
import './App.css';
import {
  MenuItem,
  FormControl,
  Select,
  CardContent,
  Card,
} from '@material-ui/core';

import InfoBox from './components/InfoBox';
import Map from './components/Map';
import Table from './components/Table';
import { sortData, prettyPrintStat } from './utils/util';
import 'leaflet/dist/leaflet.css';
import logo from './images/covid.png';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('global');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
  const [zoom, setZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    setLoading(true);
    const countryCode = e.target.value;

    setCountry(countryCode);

    const url =
      countryCode === 'global'
        ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setLoading(false);
        // console.log([data.countryInfo.lat, data.countryInfo.long]);
        countryCode === 'global'
          ? setMapCenter([20.5937, 78.9629])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setZoom(4);
      });

    console.log(countryInfo);
  };

  return (
    <main>
      <div className='stats'>
        <div className='header'>
          <div className='header-name'>
            <img className='logo' src={logo} alt='logo'></img>
            <h1>Covid-19 tracker</h1>
          </div>
          <FormControl className='dropdown'>
            <Select
              variant='outlined'
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value='global'>Global</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className='stats-card'>
          <InfoBox
            isRed
            active={casesType === 'cases'}
            onClick={(e) => setCasesType('cases')}
            title='Total Cases'
            total={prettyPrintStat(countryInfo.cases)}
            cases={prettyPrintStat(countryInfo.todayCases)}
            isloading={isLoading}
          />
          <InfoBox
            active={casesType === 'recovered'}
            onClick={(e) => setCasesType('recovered')}
            title='Recovered'
            total={prettyPrintStat(countryInfo.recovered)}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            isloading={isLoading}
          />
          <InfoBox
            isGrey
            active={casesType === 'deaths'}
            onClick={(e) => setCasesType('deaths')}
            title='Deaths'
            total={prettyPrintStat(countryInfo.deaths)}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            isloading={isLoading}
          />
        </div>
        <Card>
          <CardContent>
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
          </CardContent>
        </Card>
      </div>

      <Map
        countries={mapCountries}
        center={mapCenter}
        zoom={zoom}
        casesType={casesType}
      />
    </main>
  );
}

export default App;
