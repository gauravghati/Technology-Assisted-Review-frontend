import React, {useState, useEffect } from 'react'
import PdfViewer from './components/PdfViewer';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Chart } from "react-google-charts";

const BASE_URL_BACKEND = "http://localhost:8000/"

export default function ReviewerScreen( props ) {    
    var documentIndexList = props.documentIndexList;
    var currDocIdx = props.currDocIdx;

    var document_id = documentIndexList[ currDocIdx ];

    const pieOptions = {
        title: "Model Predictions",
        is3D: true,        
    };

    var [document, setDocument] = useState();
    var [label, setLabel] = useState("NULL");

    async function fetchtheAPI() {
        const speURL = BASE_URL_BACKEND + "mainapp/getspecificdoc/"
        // const uncerURL = BASE_URL_BACKEND + "mainapp/getmostuncertaindoc/"

        var requestOptions = {
            method : 'POST',
            headers : { 
                'Content-Type': 'application/json' 
            },
            body : JSON.stringify({ 
                "document_id" : document_id
            })
        }

        var doc = await fetch(speURL, requestOptions);
        // if( document_id !== "NULL" )
        //     doc = await fetch(speURL, requestOptions);
        // else doc = await fetch(uncerURL);

        var jsondoc = await doc.json();
        if( jsondoc.is_reviewed )
            setLabel( jsondoc.reviewed_label_name );

        console.log( jsondoc.length );
        setDocument(jsondoc);
    }    

    async function updateDatabase() {
        const updateURL = BASE_URL_BACKEND + "mainapp/updatedoc/";

        var requestOptions = {
            method : 'POST',
            headers : { 
                'Content-Type': 'application/json' 
            },
            body : JSON.stringify({ 
                "document_id" : document_id,
                "reviewed_label_name" : label
            })
        }
        await fetch(updateURL, requestOptions);
    }

    function changeLabel( event ) {
        setLabel(event.target.value);
    }

    useEffect(() => {
        fetchtheAPI();
    }, [currDocIdx]);

    function navPage( val ) {
        if( label !== "NULL" ) {
            updateDatabase();
            setLabel("NULL");
            val ? ++currDocIdx : --currDocIdx;
            props.setCurrDocIdx( currDocIdx );
        }
        else {
            // havn't thought yet
        }
    }

    function submitAndClose() {
        if( label !== "NULL" ) {
            updateDatabase();
            setLabel("NULL");
            props.closeModal();
            props.refreshPage();
        }
        else {
            // havn't thought yet
        }
    }

    if(!document) return (<> Loading... </>);

    return (
        <div>
            <div className="top-next-prev-button">
                <font className='document-name' > File Name : { document.document_name } </font>
                <div className="inner-top-next-prev-button">
                    <button className='buttonNext' onClick={ (val) => navPage(false) } >
                        <NavigateBeforeIcon/>
                        Back
                    </button>
                    <button className='buttonNext' onClick={ (val) => navPage(true) } >
                        Next
                        <NavigateNextIcon/>
                    </button>
                </div>
            </div>

            <div className="reviewer-dropdown">                
                <div>
                    Model Uncertainity Score : { document.uncertainity_score } % <br/>
                    Document Word Count : { document.word_count } <br/>
                    Document Page Count : { document.page_count } <br/>
                </div>

                { document.is_reviewed ? 
                    <font>This document is Already Reviewed</font> : 
                    <Chart
                        chartType="PieChart"
                        data={ [
                                ["Label", "Percentage"],
                                ["Label 1", document.class_a_predit_percentage],
                                ["Label 2", document.class_b_predit_percentage],
                                ["Label 3", document.class_c_predit_percentage],
                                ["Label 4", document.class_d_predit_percentage],
                            ] 
                        }
                        options={pieOptions}
                        width={"100%"}
                        height={"450px"}
                    />
                }
                <font> <br/> Choose Lable: </font>
                <select className='selectsoflow' onChange={ changeLabel } value={ label } id="labeldropdown">
                    <option value="NULL" disabled hidden > Select Label : </option>
                    <option value="Label 0" >Label 0</option>
                    <option value="Label 1" >Label 1</option>
                    <option value="Label 2" >Label 2</option>
                    <option value="Label 3" >Label 3</option>
                </select>
            </div>

            <div className='pdf-container' >
                <PdfViewer sourceDocument = { document.document_file } />
            </div>


            <div className="bottom-submit-button">
                <div className="inner-top-next-prev-button">
                    <button className='buttonNext' onClick={ submitAndClose } >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}