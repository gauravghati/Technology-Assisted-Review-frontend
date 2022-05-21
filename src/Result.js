import React, { useState, useEffect } from 'react';
import { LABELS, BASE_URL_BACKEND } from './variables'
import { Chart } from "react-google-charts";

export default function Result() {
    var [classCnt, setClassCnt] = useState([ 10, 10, 10, 10 ]);
    var [reviewCnt, setReviewCnt] = useState([ 10,10 ]);
    var [ classAcc, setClassAcc ] = useState([ 0, 0, 0, 0 ]);
    var [ totalAcc, setTotAcc ] = useState(0);

    async function fetchtheAPI() {
        const url = BASE_URL_BACKEND + "mainapp/documentlist/";
        var response = await fetch(url);
        var jsondata = await response.json();

        var one = 0, two = 0, three = 0, four = 0, isRev = 0, notRev = 0;
        for( let i = 0; i < jsondata.length; i++ ) {
            var main_label = ( jsondata[i].is_reviewed ) ? jsondata[i].reviewed_label_name : jsondata[i].predicted_label_name;

            if( jsondata[i].is_reviewed )
                isRev++;
            else notRev++;

            if( main_label === LABELS.LABEL0 )
                one++;
            else if ( main_label === LABELS.LABEL1 )
                two++;
            else if ( main_label === LABELS.LABEL2 )
                three++;
            else if ( main_label === LABELS.LABEL3 )
                four++;
        }

        setClassCnt( [one, two, three, four] );
        setReviewCnt([isRev, notRev]);
    }

    async function calAcc() {
        const url = BASE_URL_BACKEND + "mainapp/calacc";
        var response = await fetch(url);
        var jsondata = await response.json();
        var accArr = jsondata['accArr'];
        var totacc = jsondata['acc'];
        setClassAcc([ accArr[0], accArr[1], accArr[2], accArr[3] ]);
        setTotAcc( totacc * 100 ); 
    }

    const accData = [
        ["Labels", "Accuracy"],
        [LABELS.LABEL0, classAcc[0] * 100 ],
        [LABELS.LABEL1, classAcc[1] * 100 ],
        [LABELS.LABEL2, classAcc[2] * 100 ],
        [LABELS.LABEL3, classAcc[3] * 100 ],
    ];

    useEffect(() => {
        fetchtheAPI();
        calAcc();
    }, []);

    const accBar = {
        chart: { title: "Accuracy Per class" },
        legend: { position: "none" },
    };
    const classCntPie = {
        title: "Label Distribution : ",
        is3D: true,
    };
    const reviewPie = {
        title: "Review status : ",
        is3D: true,
    };

    return (
        <div>
            <div className='twopie' >
                <Chart
                    chartType="PieChart"
                    data={ [
                            ["Label", "Percentage"],
                            ["Label 0", classCnt[0]],
                            ["Label 1", classCnt[1]],
                            ["Label 2", classCnt[2]],
                            ["Label 3", classCnt[3]],
                        ] 
                    } 
                    options={classCntPie}
                    width={"1000px"}
                    height={"430px"}
                />
                <Chart
                    chartType="PieChart"
                    data={ [
                            ["is Reviewed", "count"],
                            ["Reviewed", reviewCnt[0]],
                            ["Not Reviewed", reviewCnt[1]],
                        ]
                    }
                    options={reviewPie}
                    width={"1000px"}
                    height={"430px"}
                />
            </div>

            <div className='histo'>
                <Chart
                    chartType="Bar"
                    data={accData}
                    options={accBar}
                    width={"700px"}
                    height={"400px"}
                /> 
            </div>

            <div className='resultDetails' >
                Overall Accuracy : { totalAcc.toFixed(2) } % <br/>
                Majority Label : Label 0 <br/>
                Documents Reviewed : { reviewCnt[0] } <br/>
                Documents Not Reviewed : { reviewCnt[1] } <br/>
            </div>
        </div>
    )
}
