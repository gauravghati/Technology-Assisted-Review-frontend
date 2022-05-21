import React, {useState, useEffect, useRef} from 'react';
import LaunchIcon from '@mui/icons-material/Launch';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';
import ReviewerScreenModal from './ReviewerScreenModal';
import { Multiselect } from "multiselect-react-dropdown";
import Pagination from './components/pagination.js'
import { STATUS, LABELS, TYPES, SORT_BY, BASE_URL_BACKEND } from './variables'

export default function OverviewPanel() {
    var [documents, setDocuments] = useState();
    var [modalOpen, setModalOpen] = useState(false);
    var [currDocId, setCurrDocId] = useState();
    var [currDocIndex, setCurrDocIndex] = useState();
    var [ddChanged, setddChanged] = useState(true);
    var [pageOfItems, setPageOfItems] = useState([]);
    var [documentIndexList, setDocumentIndexList] = useState([]);

    const labelArr = [LABELS.LABEL0, LABELS.LABEL1, LABELS.LABEL2, LABELS.LABEL3];
    const statusArr = [STATUS.MANUALLY_REVIEWED, STATUS.AUTO_REVIEWED];
    const docTypeArr = [TYPES.PDF, TYPES.PIC, TYPES.TEXT];
    const sortByArr = [SORT_BY.NAME, SORT_BY.UNCERTAINITY_SCORE, SORT_BY.DOCUMENT_SIZE];

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
                var showLabel = ( doc.is_reviewed ) ? doc.reviewed_label_name : doc.predicted_label_name;
                if( label.includes( showLabel ) )
                    return doc;
            })
        }

        if( status.length === 1 ) {
            var check = Boolean( status[0] === STATUS.MANUALLY_REVIEWED );
            jsondata = jsondata.filter( (doc) => doc.is_reviewed === check )
        }    

        if( sortby.length === 1 ) {
            if( sortby[0] === SORT_BY.UNCERTAINITY_SCORE ) {
                jsondata = jsondata.sort( function(doc1, doc2) {
                    return doc2.uncertainity_score - doc1.uncertainity_score;
                })
            } 

            else if( sortby[0] === SORT_BY.NAME ) {
                jsondata = jsondata.sort( (doc1 , doc2) => {
                    return doc1.document_name - doc2.document_name;
                } )
            }

            else if( sortby[0] === SORT_BY.DOCUMENT_SIZE ) {
                jsondata = jsondata.sort( (doc1 , doc2) => {
                    return doc1.document_size - doc2.document_size;
                } )
            }
        }

        // creating documentIndexList to pass it to Reviewer's screen
        var docIdxList = [];
        for( let i = 0; i < jsondata.length; i++ ) {
            var temp_id = jsondata[i].auto_id;
            docIdxList.push( temp_id );
        }

        setDocumentIndexList( docIdxList );
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
    
    function updateLabelAfterModelClose() {
        setddChanged(!ddChanged);
        setModalOpen(!modalOpen);
    }

    function linkButtonClicked( num ) {
        setModalOpen(!modalOpen);
        var temp_idx = documents.findIndex((doc) => {
            return (doc.auto_id === num);
        });
        setCurrDocId( num );
        setCurrDocIndex( temp_idx )
    }

    useEffect(() => {
        fetchtheAPI();
    }, [ddChanged]);

    if(!documents) return (<> Loading... </>);

    var multiselectcss = {
        multiselectContainer: {
            'width': '250px',
            'float': 'left',
            'padding': '5px 10px'
        },
    }

    return (
        <div>
            <div className="filterAndSearch">
                <div className="search_box">
                    <input className='search_input' type="text" placeholder="Search Documents" />
                    <button className='overviewButtons' onClick={ () => linkButtonClicked( Math.floor( Math.random() * documentIndexList.length ) ) } >
                        <ShuffleIcon/>
                        <font className="textpickrandom" >Pick Random</font>
                    </button>
                    <button className='overviewButtons' onClick={resetFilters} >
                        <RestartAltIcon/>
                        <font className="textpickrandom" >Reset Filters</font>
                    </button>
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
                        <th> Review </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        pageOfItems.slice(0, 10).map( (doc, i) => {
                            return <tr key={i} className={ (currDocId === doc.auto_id ) ? "rowShow" : "" } >
                                <td> { i + 1 } </td>

                                <td> { 
                                    ( doc.document_type === TYPES.PDF ) ?  <PictureAsPdfIcon/> :
                                    ( ( doc.document_type === TYPES.PIC ) ? <InsertPhotoIcon/> : <TextSnippetIcon/> )
                                } </td>

                                <td>{ 
                                    doc.document_name 
                                } </td>

                                <td> {
                                    (doc.is_reviewed) ? <DoneOutlineIcon/> : "-" 
                                } </td>

                                <td>{
                                    ( doc.is_reviewed ) ?
                                    doc.reviewed_label_name : doc.predicted_label_name
                                } </td>

                                <td> {
                                    ( doc.is_reviewed ) ? "-" : doc.uncertainity_score.toFixed(2)
                                } </td>

                                <td> 
                                    <Button onClick={ () => linkButtonClicked( doc.auto_id ) } > {
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
                <Pagination items={ documents } onChangePage={ onChangePage } pageSize="10"  />
            </div>

            {
                ( modalOpen ) ? 
                <div className={ (modalOpen) ? "modal open" : "modal" }>
                    <div className="modal-overlay" onClick={ () => updateLabelAfterModelClose() } ></div>
                    <div className="modal-card">
                        <div className="modal-body">
                        <div className="modal-content">
                            <ReviewerScreenModal
                                documentIndexList={ documentIndexList }
                                currDocIdx = { currDocIndex }
                                closeModal={ () => setModalOpen(!modalOpen) }
                                setCurrDocIdx = { (num) => setCurrDocIndex(num) }
                                refreshPage = { () => setddChanged( !ddChanged ) }
                            />
                        </div>
                        </div>
                    </div>
                </div> : <div></div>
            }
        </div>
    )
}