import React, { useState } from 'react'
import styled from 'styled-components';
import useSortableData from './useSortableData';


const Table = styled.table`
 background: #f5ffff;
  border-collapse: collapse;
  text-align: left;
  margin-right: 50px;
  
  th{
    border-top: 1px solid #777777;	
  border-bottom: 1px solid #777777; 
  box-shadow: inset 0 1px 0 #999999, inset 0 -1px 0 #999999;
  background: linear-gradient(#9595b6, #5a567f);
  color: white;
  padding: 10px 15px;
  position: relative;
  width: 73px;
  button{
      background: linear-gradient(#9595b6, #5a567f);
      color: whitesmoke;
      display:flex;
      cursor: pointer;
  }
  }
  th button.ascending::after {
  content: '👇';
  display: inline-block;
  margin-left: 1em;
}
th button.descending::after {
  content: '☝️';
  display: inline-block;
  margin-left: 1em;
}
  th:after{
    content: "";
  display: block;
  position: absolute;
  left: 0;
  top: 25%;
  height: 25%;
  width: 100%;
  background: linear-gradient(rgba(255, 255, 255, 0), rgba(255,255,255,.08));
  }
  tr:nth-child(odd){
    background: #ebf3f9;
  }
  th:first-child{
    border-left: 1px solid #777777;	
  border-bottom:  1px solid #777777;
  box-shadow: inset 1px 1px 0 #999999, inset 0 -1px 0 #999999;
  }
  th:last-child {
  border-right: 1px solid #777777;
  border-bottom:  1px solid #777777;
  box-shadow: inset -1px 1px 0 #999999, inset 0 -1px 0 #999999;
}
td {
  border: 1px solid #e3eef7;
  padding: 10px 15px;
  position: relative;
  transition: all 0.5s ease;
  width:70px;
}
tbody{
    max-height: 200px;
  overflow-y: scroll;
  position: absolute;
}
tbody:hover td {
  color: transparent;
  text-shadow: 0 0 3px #a09f9d;
}
tbody:hover tr:hover td {
  color: #444444;
  text-shadow: none;
}
`
const Div = styled.div`
display: flex;
form{
    position: absolute;
    max-height: 250px;
    h3{
    background: linear-gradient(#9595b6, #5a567f);
    color: whitesmoke;}
    background: #ebf3f9;
    margin: 15px auto;
}
`

const Main = (props) => {

    const { record, requestSort, apiLoaded, sortConfig, onScroll, containerRef } = useSortableData(props);

    const [filteredExecutor, setFilteredExecutor] = useState('Все');
    const [filteredGenre, setFilteredGenre] = useState('Все');
    const [filteredYear, setFilteredYear] = useState('Все')

    const getClassNamesFor = (name) => {
        if (!sortConfig) {
            return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };

    //Удаляем повторяющиеся элементы из фильтра
    const executorArr = new Set(record.map(item => item.исполнитель))
    const backToExecutorArr = [...executorArr]

    let genreArr = new Set(record.map(item => item.жанр))
    const backToGenreArr = [...genreArr]

    let yearArr = new Set(record.map(item => item.год))
    const backToYearArr = [...yearArr]

    const changeExecutor = (event) => {
        setFilteredYear('Все')
        setFilteredGenre('Все')
        setFilteredExecutor(event.target.value)
    }
    const changeGenre = (event) => {
        setFilteredYear('Все')
        setFilteredExecutor('Все')
        setFilteredGenre(event.target.value)
    }
    const changeYear = (event) => {
        setFilteredExecutor('Все')
        setFilteredGenre('Все')
        setFilteredYear(event.target.value)
    }


    let filteredExecutors = record.filter(rec => rec.исполнитель === filteredExecutor)
    let filteredGenres = record.filter(rec => rec.жанр === filteredGenre)
    let filteredYears = record.filter(rec => rec.год === Number(filteredYear))

    let Allstates = [filteredExecutor, filteredGenre, filteredYear]
    let states = Allstates.filter(item => item !== 'Все')

    const helper = () => {
        if (filteredExecutor.includes(states)) {
            return filteredExecutors
        } else if (filteredGenre.includes(states)) {
            return filteredGenres
        } else {
            return filteredYears
        }
    }

    let filteredRecords = filteredExecutor === 'Все' && filteredGenre === 'Все' && filteredYear === 'Все' ? record : helper()

    return (
        <>
            <Div>
                <Table>
                    <caption>Плейлист</caption>
                    <thead>
                        <tr>
                            <th>
                                id
                        </th>
                            <th>
                                <button type="button" onClick={() => requestSort('исполнитель')} className={getClassNamesFor('исполнитель')}>
                                    Исполнитель
                        </button>
                            </th>
                            <th>
                                <button type="button" onClick={() => requestSort('песня')} className={getClassNamesFor('песня')}>
                                    Песня
                    </button>
                            </th>
                            <th>
                                <button type="button" onClick={() => requestSort('жанр')} className={getClassNamesFor('жанр')}>
                                    Жанр
                    </button>
                            </th>
                            <th>
                                <button type="button">
                                    Год
                    </button>
                            </th>
                        </tr>
                    </thead>
                    {apiLoaded ?
                        <tbody ref={containerRef} onScroll={onScroll}>
                            {
                                filteredRecords.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.исполнитель}</td>
                                        <td>{item.песня}</td>
                                        <td>{item.жанр}</td>
                                        <td>{item.год}</td>
                                    </tr>
                                ))
                            }

                        </tbody>
                        :
                        <caption>Loading...</caption>}
                </Table>
                {apiLoaded ?
                    <div>
                        <form>
                            <h3>Исполнитель</h3>
                            <select value={filteredExecutor} onChange={changeExecutor}>
                                <option value="Все">Все</option>
                                {backToExecutorArr.map(item => (
                                    <option value={item} key={item}>{item}</option>
                                ))}
                            </select>
                            <h3>Жанр</h3>
                            <select value={filteredGenre} onChange={changeGenre}>
                                <option value="Все">Все</option>
                                {backToGenreArr.map(item => (
                                    <option value={item} key={item}>{item}</option>
                                ))}
                            </select>
                            <h3>Год</h3>
                            <select value={filteredYear} onChange={changeYear}>
                                <option value="Все">Все</option>
                                {backToYearArr.map(item => (
                                    <option value={item} key={item}>{item}</option>
                                ))}
                            </select>
                        </form>
                    </div>
                    :
                    <div>Loading...</div>}
            </Div>

        </>
    )
}

export default Main
