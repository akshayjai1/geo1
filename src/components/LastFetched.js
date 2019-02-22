import React from 'react';
import Moment from 'react-moment';

const LastFetched = (props) => {
    return (
        <p>
            Last fetched: <Moment interval={10000} fromNow>{props.mapTimeStamp}</Moment>
        </p>
    )
}

export default LastFetched;