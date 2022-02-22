import React, {useState, useEffect, useRef} from 'react'
import LaunchIcon from '@mui/icons-material/Launch';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';
import ReviewerScreen from './ReviewerScreen';
import { Multiselect } from "multiselect-react-dropdown";
import Pagination from './components/pagination.js'

const BASE_URL_BACKEND = "http://localhost:8000/"
const BASE_URL_FRONTEND = "http://localhost:3000/"


export default function OverviewPanel() {
    var [documents, setDocuments] = useState();
    var [modalOpen, setModalOpen] = useState(false);
    var [currDoc, setCurrDoc] = useState();
    var [ddChanged, setddChanged] = useState(true);
    var [pageOfItems, setPageOfItems] = useState([]);

    const labelArr = ["Label 0", "Label 1", "Label 2", "Label 3"];
    const statusArr = ["Manually Reviewer", "Auto Reviewer"];
    const docTypeArr = ["PDF", "Picture", "Text File"];
    const sortByArr = ["By Name", "By Uncertainity Score", "By Document Size"];

    var reftype = useRef();
    var reflabel = useRef();
    var refstatus = useRef();
    var refsortby = useRef();

    async function fetchtheAPI() {
        const url = BASE_URL_BACKEND + "mainapp/documentlist/";
        var response = await fetch(url);
        var jsondata = await response.json();

        var type = ( reftype.current ) ? reftype.current.getSelectedItems() : [];
        var label = ( reflabel.current ) ? reflabel.current.getSelectedItems() : [];
        var sortby = ( refsortby.current ) ? refsortby.current.getSelectedItems() : [];
        var status = ( refstatus.current ) ? refstatus.current.getSelectedItems() : [];

        if( type.length !== 0 ) {
            jsondata = jsondata.filter( (doc) => {
                if( type.includes( doc.document_type ) )
                    return doc;
            })
        }

        if( label.length !== 0 ) {
            jsondata = jsondata.filter( (doc) => {
                if( label.includes( doc.reviewed_label_name ) )
                    return doc;
            })
        }

        if( status.length === 1 ) {
            var check = Boolean( status[0] === "Manually Reviewer" );
            jsondata = jsondata.filter( (doc) => doc.is_reviewed === check )
        }    

        if( sortby.length === 1 ) {
            if( sortby[0] === "By Uncertainity Score" ) {
                jsondata = jsondata.sort(function(doc1, doc2){
                    return doc2.uncertainity_score - doc1.uncertainity_score;
                })    
            } 

            else if( sortby[0] === "By Name" ) {
                jsondata = jsondata.sort( (doc1 , doc2) => {
                    return doc1.document_name - doc2.document_name;
                } )
            }

            else if( sortby[0] === "By Document Size" ) {
                jsondata = jsondata.sort( (doc1 , doc2) => {
                    return doc1.document_size - doc2.document_size;
                } )
            }
        }
        setDocuments(jsondata);
    }

    function onSelect( selectedList, selectedItem ) {
        setddChanged( !ddChanged );
    }

    function onRemove( selectedList, removedItem ) {
        setddChanged( !ddChanged );
    }

    function resetFilters() {
        reftype.current.resetSelectedValues();
        reflabel.current.resetSelectedValues();
        refsortby.current.resetSelectedValues();
        refstatus.current.resetSelectedValues();
        setddChanged( !ddChanged );
    }

    function onChangePage(pageOfItems) {
        setPageOfItems(pageOfItems);
    }

    function linkButtonClicked( num ) {
        setModalOpen(!modalOpen);
        setCurrDoc(num);
    }

    useEffect(() => {
        fetchtheAPI();
    }, [ddChanged]);

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
                        ref={ reftype }
                        onSelect={ onSelect }
                        onRemove={ onRemove }
                        placeholder="Document Type"
                        options={ docTypeArr }
                        isObject={false} 
                    />

                    <Multiselect style={multiselectcss}
                        showArrow 
                        ref = { reflabel }
                        onSelect={ onSelect }
                        onRemove={ onRemove }
                        placeholder="Choose Labels"
                        options={ labelArr }
                        isObject={false} 
                    />

                    <Multiselect style={multiselectcss}
                        ref = { refstatus }
                        onSelect={ onSelect }
                        onRemove={ onRemove }
                        placeholder="Choose status"
                        options={ statusArr }
                        singleSelect = {true}
                        isObject={false} 
                    />

                    <Multiselect style={multiselectcss}
                        ref = { refsortby }
                        onSelect={ onSelect }
                        onRemove={ onRemove }
                        placeholder="Sort By"
                        options={ sortByArr }
                        singleSelect = {true}
                        isObject={false} 
                    />
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
                        pageOfItems.map( (doc, i) => {
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
            
            <div className='paging'>
                <Pagination items={ documents } onChangePage={ onChangePage } />
            </div>

            {
                ( modalOpen ) ? 
                <div className={ (modalOpen) ? "modal open" : "modal" }>
                    <div className="modal-overlay" onClick={ () => setModalOpen(!modalOpen) } ></div>
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