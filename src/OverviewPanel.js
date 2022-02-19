import React, {useState, useEffect} from 'react'
import LaunchIcon from '@mui/icons-material/Launch';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';
import ReviewerScreen from './ReviewerScreen';
import { Multiselect } from "multiselect-react-dropdown";

const BASE_URL_BACKEND = "http://localhost:8000/"
const BASE_URL_FRONTEND = "http://localhost:3000/"


export default function OverviewPanel() {
    var [documents, setDocuments] = useState();
    var [open, setOpen] = useState(false);
    var [currDoc, setCurrDoc] = useState();

    var labelArr = ["Label 0", "Label 1", "Label 2", "Label 3"];
    var statusArr = ["Manually Reviewer", "Auto Reviewer"];
    var docTypeArr = ["PDF", "Picture", "Text File"];
    var sortByArr = ["By Name", "By Uncertainity Score", "By Document Size"];

    var [type, setType] = useState([]);
    var [label, setLabel] = useState([]);
    var [status, setStatus] = useState("NULL");
    var [sortby, setSortBy] = useState("NULL");

    async function fetchtheAPI() {
        const url = BASE_URL_BACKEND + "mainapp/documentlist/";
        var response = await fetch(url);
        var jsondata = await response.json();




        // if( type !== "NULL" )\
        //     jsondata = jsondata.filter( (doc) => doc.document_type === type )

        // if( label !== "NULL" ) 
        //     jsondata = jsondata.filter( (doc) => (doc.reviewed_label_name === label) )

        if( status !== "NULL" ) {
            var check = Boolean( status === "Manually Reviewer" );
            jsondata = jsondata.filter( (doc) => doc.is_reviewed === check )
        }    

        if( sortby !== "NULL" ) {
            if( sortby === "By Uncertainity Score" ) {
                jsondata = jsondata.sort(function(doc1, doc2){
                    return doc2.uncertainity_score - doc1.uncertainity_score;
                })    
            } 

            else if( sortby === "By Name" ) {
                jsondata = jsondata.sort( (doc1 , doc2) => {
                    return doc1.document_name - doc2.document_name;
                } )
            }

            else if( sortby === "By Document Size" ) {
                jsondata = jsondata.sort( (doc1 , doc2) => {
                    return doc1.document_size - doc2.document_size;
                } )
            }
        }
        setDocuments(jsondata);
    }

    function changeType( event ) {
        setType( event.target.value );
    }
    
    function changeSortBy( event ) {
        setSortBy( event.target.value );
    }

    function changeStatus( event ) {
        setStatus( event.target.value );
    }
    
    function changeLabel( event ) {
        setLabel( event.target.value );
    }

    function resetFilters() {
        setType("NULL");
        setStatus("NULL");
        setSortBy("NULL");
        setLabel("NULL");
    }

    function linkButtonClicked( num ) {
        setOpen(!open);
        setCurrDoc(num);
        // localStorage.setItem( 'documentid', num );
        // const url = BASE_URL_FRONTEND + 'reviewer/1';
        // window.open(url, '_blank');
    }

    useEffect(() => {
        fetchtheAPI();
    }, [type, status, sortby, label]);

    if(!documents) return (<> Loading... </>);

    var multiselectcss = {
        multiselectContainer: {
            'width': '250px',
            'float': 'left',
            'padding': '5px 10px',
        },
    }

    return (
        <div>
            <div className="filter-dropdowns">
                <div className="search">
                    <input type="text" placeholder="Search Documents" />
                    <div className="pickrandom" >
                        <button onClick={ () => linkButtonClicked( "3" ) } >
                            <ShuffleIcon/>
                            <font className="textpickrandom" >Pick Random</font>
                        </button>
                    </div>
                    <div className="resetbutton" >
                        <button onClick={resetFilters} >
                            <RestartAltIcon/>
                            <font className="textpickrandom" >Reset Filters</font>
                        </button>
                    </div>
                </div>

                <div className='filterdrop'>
                    <p> Filters: </p>

                    <Multiselect style={multiselectcss}
                        showArrow 
                        placeholder="Document Type"
                        options={ docTypeArr }
                        isObject={false} 
                    />

                    <Multiselect style={multiselectcss}
                        showArrow 
                        placeholder="Choose Labels"
                        options={ labelArr }
                        isObject={false} 
                    />

                    <Multiselect style={multiselectcss}
                        placeholder="Choose status"
                        options={ statusArr }
                        singleSelect = {true}
                        isObject={false} 
                    />

                    <Multiselect style={multiselectcss}
                        placeholder="Sort By"
                        options={ sortByArr }
                        singleSelect = {true}
                        isObject={false} 
                    />

                    {/* <select className='selectsoflow' onChange={ changeStatus } value={ status } >
                        <option value="NULL" disabled hidden >Review Status</option>
                        <option value="Manually Reviewer" >Manually Reviewed</option>
                        <option value="Auto Reviewer" >Auto Reviewed</option>
                    </select>

                    <select className='selectsoflow' onChange={ changeSortBy } value={ sortby } >
                        <option value="NULL" disabled hidden >Sort By</option>
                        <option value="By Name" >Name</option>
                        <option value="By Uncertainity Score" >Uncertainity Level</option>
                        <option value="By Document Size" >Document Size</option>
                    </select>

                    <select className='selectsoflow' onChange={ changeType } value={ type } >
                        <option value="NULL" disabled hidden >Document Type</option>
                        <option value="PDF" >PDF</option>
                        <option value="Picture" >Picture</option>
                        <option value="Text File" >Text File</option>
                    </select>

                    <select className='selectsoflow' onChange={ changeLabel } value={ label } >
                        <option value="NULL" disabled hidden >Label</option>
                        <option value="Label 0" >Label 0</option>
                        <option value="Label 1" >Label 1</option>
                        <option value="Label 2" >Label 2</option>
                        <option value="Label 3" >Label 3</option>
                    </select> */}

                </div>

                <div className='filterbutton' >
                    {
                        ( type === "NULL" ) ?
                        <></> :
                        <button onClick={ () => setType( "NULL" ) } className='filterlabelbutton'>
                            { type }
                            <CloseIcon/>
                        </button>
                    }

                    {
                        ( status === "NULL" ) ?
                        <></> :
                        <button onClick={ () => setStatus( "NULL" ) } className='filterlabelbutton'>
                            { status }
                            <CloseIcon/>
                        </button>                        
                    }

                    {
                        ( label === "NULL" ) ?
                        <></> :
                        <button onClick={ () => setLabel( "NULL" ) } className='filterlabelbutton'>
                            { label }
                            <CloseIcon/>
                        </button>                        
                    }

                    {
                        ( sortby === "NULL" ) ?
                        <></> :
                        <button onClick={ () => setSortBy( "NULL" ) } className='filterlabelbutton'>
                            { sortby }
                            <CloseIcon />
                        </button>                        
                    }

                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Type</th>
                        <th>Document Name</th>
                        <th>Review Status</th>
                        <th>Label</th>
                        <th>Uncertainity</th>
                        <th>Links</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        documents.map( (doc, i) => {
                            return <tr key={i} className={ (currDoc === doc.id ) ? "rowShow" : "" } >
                                <td> { i + 1 } </td>

                                <td> { 
                                    ( doc.document_type === "PDF" ) ?  <PictureAsPdfIcon/> :
                                    ( ( doc.document_type === "Picture" ) ? <InsertPhotoIcon/> : <TextSnippetIcon/> )
                                } </td>

                                <td>{ 
                                    doc.document_name 
                                } </td>

                                <td> {
                                    (doc.is_reviewed) ? <DoneOutlineIcon/> : "-" 
                                } </td>

                                <td>{
                                    ( doc.is_reviewed ) ? 
                                    doc.reviewed_label_name : "-"
                                } </td>

                                <td> {
                                    ( doc.is_reviewed ) ? "-" : doc.uncertainity_score
                                } </td>

                                <td> 
                                    <Button onClick={ () => linkButtonClicked( doc.id ) } >
                                    {
                                        ( doc.is_reviewed ) ? <EditIcon/> : <LaunchIcon/>
                                    }
                                    </Button>
                                </td>
                            </tr>
                        } )
                    }
                </tbody>
            </table>

            {
                ( open ) ? 
                <div className={ (open) ? "modal open" : "modal" }>
                    <div className="modal-overlay" onClick={ () => setOpen(!open) } ></div>
                    <div className="modal-card">
                        <div className="modal-body">
                        <div className="modal-content">
                            <ReviewerScreen document_id={ currDoc } />
                        </div>
                        </div>
                    </div>
                </div> : <div></div>
            }

        </div>
    )
}