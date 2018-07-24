import React from 'react'
import ReactDOM from 'react-dom'

const CanvasBC1 = ({data}) =>
    <div>
        <h1>Featured Players</h1>

        {data.map(data =><h1>{data}</h1>)}

    </div>


ReactDOM.render(
    React.createElement(CanvasBC1, window.props),    // gets the props that are passed in the template
    window.react_mount,                                // a reference to the #react div that we render to
)