import * as React from "react";
import YouTube from "react-youtube";

export default function Youtube() {
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
}
