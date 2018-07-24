import Parser from 'html-react-parser';
import React, {Component} from 'react';
import './App.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

//python manage.py runserver --settings=bc.production_settings


class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    lidarPoints: Array(360)
                }
            ],
            stepNumber: 0,
            maximumStepNumber: 0,

        };
        // let poitns = Array(360).fill(350);
        //
        // this.state.history =this.state.history.concat([
        //         {
        //             lidarPoints: poitns
        //         }
        //     ])
        // let poitns2 = Array(360).fill(280);
        //
        // this.state.history =this.state.history.concat([
        //     {
        //         lidarPoints: poitns2
        //     }
        // ]);
    }

    componentDidMount() {

        // fetch('http://127.0.0.1:8000/datastored')
        //   .then(response => response.json() )
        //   .then(data => this.setState({ lidarPoint: data }));
        fetch('http://127.0.0.1:8000/datastored')
            .then(response => response.json())
            .then(data => {
                for (var i = 0; i < data.length; i++) {
                    this.state.history = this.state.history.concat([
                        {
                            lidarPoints: data[i]
                        }
                    ]);
                }
                this.state.maximumStepNumber = i;
            });

        this.checkMax();
        //     this.setState({
        //       history:  [{
        //           lidarPoints: data
        //           }]
        //    })
        // );
    }

    checkMax() {
        if (this.state.maximumStepNumber != this.state.history.length) {
            this.state.maximumStepNumber = this.state.history.length;
        }
        return this.state.maximumStepNumber;
    }

    lidarPoint(props, index) {
        if (props == null) {
            return;
        }
        let xPoint, yPoint;
        xPoint = parseInt(props * Math.cos((index + 270) * Math.PI / 180) + 400)
        yPoint = parseInt(props * Math.sin((index + 270) * Math.PI / 180) + 350)
        let data = "";
        data = data.concat("<rect  key=");
        data = data.concat(index + " ");
        data = data.concat(" x=");
        data = data.concat(xPoint.toString());
        data = data.concat(" y=");
        data = data.concat(yPoint.toString());
        data = data.concat(" width=" + 5 + " height=" + 5 + "> </rect>");
        return (

            JSON.stringify(data)

        );
    }

    renderLidarData() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const point = current.lidarPoints.slice();
        var data = "";
        for (let i = 0; i < 360; i++) {
            data = data.concat(this.lidarPoint(point[i], i))
        }
        return (
            data
        );

    }


    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        var value = 0;


        return (

            <div className={"CanvasBC"}>

                <svg height="700" width="800">
                    <circle cx="400" cy="350" r={10} fill="red"/>
                    {Parser(this.renderLidarData())}
                </svg>

                <Slider step={1} max={this.state.maximumStepNumber} onChange={(value) => (this.jumpTo(value))}/>
            </div>





        );
    }

    jumpTo(step) {
        if (this.state.stepNumber != step) {
            this.setState({
                stepNumber: step
            });
        }
    }

}


export default Canvas;
