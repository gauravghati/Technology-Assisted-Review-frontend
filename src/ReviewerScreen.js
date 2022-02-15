import React, {useState, useEffect} from 'react'
import PdfViewer from './components/PdfViewer';

const BASE_URL_BACKEND = "http://localhost:8000/"

export default function ReviewerScreen( { document_id = "NULL" } ) {
    var [document, setDocument] = useState();
    var [label, setLabel] = useState( { value : "NULL" } );
    var [change, setChange] = useState(true);

    if( localStorage.getItem('documentid') ) {
        document_id = localStorage.getItem('documentid');
        localStorage.removeItem('documentid');
    }

    async function fetchtheAPI() {
        const speURL = BASE_URL_BACKEND + "mainapp/getspecificdoc/"
        const uncerURL = BASE_URL_BACKEND + "mainapp/getmostuncertaindoc/"

        var requestOptions = {
            method : 'POST',
            headers : { 
                'Content-Type': 'application/json' 
            },
            body : JSON.stringify({ 
                "document_id" : document_id
            })
        }

        var doc;
        if( document_id !== "NULL" )
            doc = await fetch(speURL, requestOptions);
        else doc = await fetch(uncerURL);

        var jsondoc = await doc.json();
        setDocument(jsondoc);
    }

    async function updateDatabase() {
        const updateURL = BASE_URL_BACKEND + "mainapp/updatedoc/";

        console.log( document_id );

        var requestOptions = {
            method : 'POST',
            headers : { 
                'Content-Type': 'application/json' 
            },
            body : JSON.stringify({ 
                "document_id" : document_id,
                "reviewed_label_name" : label.value
            })
        }
        await fetch(updateURL, requestOptions);
    }

    function changeLabel( event ) {
        setLabel( { value : event.target.value } );
    }

    useEffect(() => {
        fetchtheAPI();
    }, [change]);

    function nextPage() {
        if( label.value !== "NULL" ) {
            updateDatabase();
            setChange(!change);
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
                    <button className="button button1" onClick={ nextPage } >
                        Next Document
                    </button>
                </div>
            </div>

            <div className="reviwer-dropdown">
                <font> Choose Lable: </font>
                <select className='selectsoflow' onChange={ changeLabel } value={ label.value } id="labeldropdown">
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
                    <button className="button button1" onClick={ nextPage } >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}