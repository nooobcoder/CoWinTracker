import './App.css';
import axios from "axios";
import {useState} from "react";
import ReactJson from 'react-json-view'
import React from "react";
import GitHubButton from 'react-github-btn';
import {Card, CardHeader, CardBody, CardFooter} from 'react-simple-card';
import "styled-components";
import DataTable from 'react-data-table-component';


function App() {

    const renderTable = (center) => {
        console.log(center.length) // Number of rows
        let maxColumns = 0;
        let columns = [{
            name: `Date`,
            selector: `date`,
            center: true,
            sortable: true,
        }];
        const data = [
            // {id: 1, date: 'Conan the Barbarian', year: '1982'},
            // {id: 2, date: 'Conan the Barbarian', year: '1982'}
        ];

        for (const [index, entry] of center.entries()) {

            maxColumns = entry.slots.length > maxColumns ? entry.slots.length : maxColumns;
            data.push({
                id: index, date: entry.date,
            })
            for (const [i, e] of entry.slots.entries()) {
                const keyname = `slot${i + 1}`;
                data[index][keyname] = e
            }
        }
        console.log('MAX COLS', data)
        for (let a = 0; a < maxColumns; ++a) {
            columns.push({
                center: true,
                name: `Slot ${a + 1}`,
                selector: `slot${a + 1}`
            })
        }

        for (const ctr of center) {
            console.log('DATE', ctr.date, ctr.length)
        }

        /*  columns = [
             {
                 name: 'Date',
                 selector: 'date',
                 sortable: true,
             },
             {
                 name: 'Year',
                 selector: 'year',
                 sortable: true,
                 right: true,
             }, {
                 name: 'Year2',
                 selector: 'year2',
                 sortable: true,
                 right: true,
             }, {
                 name: 'Year',
                 selector: 'year3',
                 sortable: true,
                 right: true,
             }
         ];*/

        return <DataTable
            title={center.name}
            columns={columns}
            data={data}
        />
    }

    let response;
    const [pinCode, updatePinCode] = useState(0);
    const [centers, updateCenters] = useState([]);
    const [message, updateMessage] = useState('');
    const getInfo = async () => {
        const obj = new Date();
        const config = {
            method: 'get',
        };
        try {
            response = await axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pinCode}&date=${obj.getDate()}-${obj.getMonth() + 1}-${obj.getFullYear()}`
                , config)
            updateCenters(response.data.centers)
            updateMessage(`No centers found in ${pinCode}`)

        } catch (error) {
            console.clear()
        }
        // console.log(response.data)
    }

    function tConvert(time) {
        // Check correct time format and split into components
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) { // If time format correct
            time = time.slice(1);  // Remove full string match value
            time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join(''); // return adjusted time or original string
    }

    const renderCards = () => {
        var cards = []
        for (let center of centers) {
            const copySessions = center.sessions;
            const builder = [];
            for (let session of copySessions) {
                const {date, min_age_limit, vaccine, available_capacity} = session; // slots,date,
                builder.push({date, min_age_limit, vaccine, available_capacity, })
            }
            cards.push(<Card style={{marginBottom: '50px', boxShadow: '10px 10px 5px #aaaaaa', borderRadius: '8px'}}>
                    <CardHeader style={{fontSize: '33px', fontFamily: 'arial'}} key={center.center_id}>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${center.lat},${center.long}`}
                           target='_blank'>
                            <img
                                src='https://www.pinclipart.com/picdir/middle/561-5612244_map-pin-icon-green-green-map-pin-png.png'
                                height='30px' width='30px'/>
                        </a>
                        CENTER NAME: {center.name}
                        <a href="https://www.kwernerdesign.com/blog/tag/birthday-cards/"
                           className="tag"
                           title={'VACCINATION TYPE: ' + center.fee_type.toUpperCase()}>{center.fee_type}</a>
                    </CardHeader>
                    <CardBody style={{
                        fontSize: '25px',
                        fontFamily: 'arial'
                    }}>Address: {center.block_name}, {center.district_name}, {center.state_name}- {center.pincode}
                        {renderTable(center.sessions)}
                        <ReactJson style={{fontSize: '18px', marginTop: '10px', borderRadius: '8px', padding: '10px'}}
                                   src={builder} theme="paraiso" name="Schedules" iconStyle={"circle"}
                                   displayDataTypes={false} sortKeys={true} collapsed={1} displayArrayKey={false}/>
                    </CardBody>
                    <CardFooter style={{
                        fontSize: '18px',
                        fontFamily: 'arial'
                    }}>FROM: {tConvert(center.from)} TO: {tConvert(center.to)}
                    </CardFooter>

                </Card>
            )
        }
        return cards;
    }

    return (

        <div className="formfield"><h1 className="header mainheader">CoWIN Tracker by Ankur Paul</h1><GitHubButton
            href="https://github.com/nooobcoder">Follow me @nooobcoder</GitHubButton>
            <h2 htmlFor="input1" className="header">
                PIN CODE (required)
            </h2>
            <input id="input1" name="Name" onChange={async (event) => {
                await updatePinCode(event.target.value)
            }}/>
            <button id="btn1" name="submit" onClick={() => {
                getInfo();

            }}>SUBMIT
            </button>
            {renderCards()}{
                centers.length > 0 ? <div>
                        <h3 className="header">Entire Metadata (JSON)</h3>
                        <ReactJson src={centers} theme="monokai" collapsed={1}/></div> :
                    <h3>{message}</h3>
            }
            <footer>
                <p>Designer: Ankur Paul <a href="mailto:ankurpaulin2019@gmail.com">ankurpaulin2019@gmail.com</a></p>
                <p>&#169; All data are served by the CoWIN Portal of India and it's API. Refer to <a
                    href="https://apisetu.gov.in/public/marketplace/api/cowin/">API</a> docs for more information</p>
                <p></p>
            </footer>
        </div>
    )
        ;
}

export default App;
