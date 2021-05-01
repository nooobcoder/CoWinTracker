import './App.css';
import axios from "axios";
import {useState} from "react";
import ReactJson from 'react-json-view'
import React from "react";
import GitHubButton from 'react-github-btn';
import {Card, CardHeader, CardBody, CardFooter} from 'react-simple-card';

function App() {
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

    const renderCards = () => {
        var cards = []
        for (let center of centers) {
            const copySessions = center.sessions;
            const builder = [];
            for (let session of copySessions) {
                const {date, slots} = session;
                builder.push({date, slots})
            }
            cards.push(<Card style={{marginBottom: '50px', boxShadow: '10px 10px 5px #aaaaaa', borderRadius: '8px'}}>
                <CardHeader style={{fontSize: '33px', fontFamily: 'arial'}} key={center.center_id}>CENTER
                    NAME: {center.name}</CardHeader>
                <CardBody style={{
                    fontSize: '25px',
                    fontFamily: 'arial'
                }}>Address: {center.block_name}, {center.district_name}, {center.state_name}- {center.pincode}
                    <ReactJson style={{fontSize: '18px', marginTop: '10px', borderRadius: '8px', padding: '10px'}}
                               src={builder} theme="paraiso" name="Schedules" iconStyle={"circle"}
                               displayDataTypes={false} sortKeys={true} collapsed={2} displayArrayKey={false}/>
                </CardBody>
                <CardFooter style={{fontSize: '18px', fontFamily: 'arial'}}>FROM: {center.from} TO: {center.to}
                </CardFooter>
            </Card>)
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
                <p>&#169; All data are served by the CoWIN Portal of India and it's API. Refer to <a href="https://apisetu.gov.in/public/marketplace/api/cowin/">API</a> docs for more information</p>
                <p></p>
            </footer>
        </div>
    )
        ;
}

export default App;
