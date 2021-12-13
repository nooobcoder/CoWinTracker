import axios from "axios";
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import GitHubButton from "react-github-btn";
import ReactJson from "react-json-view";
import { Card, CardBody, CardFooter, CardHeader } from "react-simple-card";
import YouTube from "react-youtube";
import "styled-components";
// import UserAgent from "user-agents";
import "./App.css";

function App() {
  // const [open, setOpen] = useState(false);

  /* const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false); */

  const renderYoutubeVideo = () => {
    const opts = {
      height: "320",
      width: "570",
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 0,
      },
    };

    return (
      <div className="header mainheader">
        <YouTube videoId="TyenPPblNro" opts={opts} />
      </div>
    );
  };

  const renderTable = (center) => {
    // console.log(center.length) // Number of rows
    let maxColumns = 0;
    let columns = [
      {
        name: `Date`,
        selector: `date`,
        center: true,
        width: "160px",
        sortable: true,
      },
      {
        name: `Vacancy`,
        selector: `vacancy`,
        center: true,
        width: "80px",
        sortable: true,
      },
      {
        name: `Age`,
        width: "125px",

        selector: `age`,
        center: true,
        sortable: true,
      },
    ];
    const data = [
      // {id: 1, date: 'Conan the Barbarian', year: '1982'},
      // {id: 2, date: 'Conan the Barbarian', year: '1982'}
    ];

    for (const [index, entry] of center.entries()) {
      maxColumns =
        entry.slots.length > maxColumns ? entry.slots.length : maxColumns;
      data.push({
        id: index,
        date: entry.date,
        vacancy: entry.available_capacity,
        age: entry.min_age_limit,
      });
      for (const [i, e] of entry.slots.entries()) {
        const keyname = `slot${i + 1}`;
        data[index][keyname] = e;
      }
    }

    for (let a = 0; a < maxColumns; ++a) {
      columns.push({
        center: true,
        width: "auto",
        name: `Slot ${a + 1}`,
        selector: `slot${a + 1}`,
      });
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

    const conditionalRowStyles = [
      {
        when: (row) => row.vacancy >= 45,
        style: {
          backgroundColor: "rgba(169, 252, 144)",
          color: "black",
          "&:hover": {
            // cursor: 'pointer',
          },
        },
      },
      {
        when: (row) => row.vacancy >= 10 && row.vacancy < 45,
        style: {
          backgroundColor: "rgba(245, 208, 164)",
          color: "black",
          "&:hover": {
            // cursor: 'pointer',
          },
        },
      },
      {
        when: (row) => row.vacancy < 10,
        style: {
          backgroundColor: "rgba(255, 110, 110)",
          color: "black",
          "&:hover": {
            // cursor: 'not-allowed',
          },
        },
      },
    ];

    return (
      <DataTable
        responsive={true}
        title={center.name}
        columns={columns}
        data={data}
        conditionalRowStyles={conditionalRowStyles}
      />
    );
  };

  let response;
  const [pinCode, updatePinCode] = useState(0);
  const [centers, updateCenters] = useState([]);
  const [message, updateMessage] = useState("");
  const getInfo = async (e) => {
    e.preventDefault();
    /* const obj = new Date();
    let config = {
      headers: {
        "Access-Control-Allow-Origin": "localhost",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, Accept, Accept-Language, X-Authorization",
      },
    }; */

    try {
      const obj = new Date();
      let MyDateString;
      obj.setDate(obj.getDate());
      MyDateString =
        ("0" + obj.getDate()).slice(-2) +
        "-" +
        ("0" + (obj.getMonth() + 1)).slice(-2) +
        "-" +
        obj.getFullYear();

      // const userAgent = new UserAgent();
      //{deviceCategory:'desktop'}
      // config.headers['User-Agent'] = userAgent.data.userAgent;

      response = await axios.get(
        `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pinCode}&date=${MyDateString}`
      );
      updateCenters(response.data.centers);
      // console.log(response);
      updateMessage(`No vaccination centers found in ${pinCode}`);
    } catch (error) {
      console.clear();
    }
    // console.log(response.data)
  };

  function tConvert(time) {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
  }

  const renderCards = () => {
    var cards = [];
    for (let center of centers) {
      const copySessions = center.sessions;
      const builder = [];
      for (let session of copySessions) {
        const { date, min_age_limit, vaccine, available_capacity } = session; // slots,date,
        builder.push({ date, min_age_limit, vaccine, available_capacity });
      }
      const FeeTypeColor = center.fee_type === "Free" ? "#4CAF50" : "#FF4500";
      // console.log(FeeTypeColor)
      cards.push(
        <Card
          style={{
            marginBottom: "50px",
            boxShadow: "10px 10px 5px #aaaaaa",
            borderRadius: "8px",
          }}
          key={center.center_id}
        >
          <CardHeader
            style={{ fontSize: "33px", fontFamily: "arial" }}
            key={center.center_id}
          >
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${center.lat},${center.long}`}
              rel="noreferrer"
              target="_blank"
            >
              <img
                src="https://www.pinclipart.com/picdir/middle/61-5612244_map-pin-icon-green-green-map-pin-png.png"
                height="30px"
                alt="image_img"
                width="30px"
              />
            </a>
            CENTER NAME: {center.name}
            <a
              href="#"
              target="#"
              className="tag"
              rel="noreferrer"
              onClick={(e) => {
                e.preventDefault();
              }}
              style={{
                background: FeeTypeColor,
              }}
              title={"VACCINATION TYPE: " + center.fee_type.toUpperCase()}
            >
              {center.fee_type}
            </a>
          </CardHeader>
          <CardBody
            style={{
              fontSize: "25px",
              fontFamily: "arial",
            }}
          >
            Address: {center.block_name}, {center.district_name},{" "}
            {center.state_name}- {center.pincode}
            {renderTable(center.sessions)}
            <ReactJson
              style={{
                fontSize: "12px",
                marginTop: "10px",
                borderRadius: "8px",
                padding: "10px",
              }}
              src={builder}
              theme="paraiso"
              name="Information"
              iconStyle={"triangle"}
              displayDataTypes={false}
              sortKeys={true}
              collapsed={true}
              displayArrayKey={false}
            />
          </CardBody>
          <CardFooter
            style={{
              fontSize: "18px",
              fontFamily: "arial",
            }}
          >
            FROM: {tConvert(center.from)} TO: {tConvert(center.to)}
          </CardFooter>
        </Card>
      );
    }
    return cards;
  };

  return (
    <div className="formfield">
      <h1 className="header mainheader">CoWIN Tracker by Ankur Paul</h1>
      <GitHubButton href="https://github.com/nooobcoder">
        Follow me @nooobcoder
      </GitHubButton>
      {renderYoutubeVideo()}
      <h2 htmlFor="input1" className="header">
        PIN CODE / POSTAL CODE (required)
      </h2>
      <form onSubmit={getInfo} className="formfield">
        <input
          id="input1"
          name="Name"
          onChange={async (event) => {
            await updatePinCode(event.target.value);
          }}
        />
        <br />
        <button id="btn1" name="submit" type="submit">
          SUBMIT
        </button>
      </form>
      {renderCards()}

      {centers.length > 0 ? (
        <div>
          <h3 className="header">Entire Metadata (JSON)</h3>
          <ReactJson src={centers} theme="monokai" collapsed={true} />
        </div>
      ) : (
        <h2 className="header " style={{ color: "red" }}>
          {message}
        </h2>
      )}

      <footer>
        <p>
          Designer: Ankur Paul{" "}
          <a href="mailto:ankurpaulin2019@gmail.com">
            ankurpaulin2019@gmail.com
          </a>
        </p>
        <p>
          &#169; All data are served by the CoWIN Portal of India and it's API.
          Refer to{" "}
          <a href="https://apisetu.gov.in/public/marketplace/api/cowin/">API</a>{" "}
          docs for more information
        </p>
        <p></p>
      </footer>
    </div>
  );
}

export default App;
