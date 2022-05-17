import  {
  useState,
 
  useEffect,
} from 'react';
import {
  json,
 
} from 'd3';
const jsonUrl ='https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

export const useData = ()=>{
const [data, setData] = useState(null);
  if(data){
    console.log(data[0])
  }

  useEffect(() => {
    const row = (d) => {
    d['Total Dead and Missing'] = +d['Total Dead and Missing']
      d['Reported Date'] = new Date(d['Reported Date'] )
      return d;
    };
    json(jsonUrl).then(data=>data.data ).then(setData);
  }, []);
return data
}