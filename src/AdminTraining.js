import React, { useState, useEffect } from 'react'
import { BASE_URL_BACKEND } from './variables'

export default function AdminTraining() {

    var [currDataset, setCurrDataset] = useState("");
    var [mainProjectPath, setProjectPath] = useState("");
    var [intialEpochs, setInitialEpochs] = useState(0);
    var [incrementalEpochs, setIncrementalEpochs] = useState(0);
    var [inqueMaxLen, setInqueMaxLen] = useState(0);
    var [batchSize, setBatchSize] = useState(0);

    var [datasetList, setDatasetList] = useState();

    var [modalOpenAddDataset, setModalOpenAddDataset] = useState(false);
    var [modalOpenImportDoc, setModalOpenImportDoc] = useState(false);
 
    var [startEndDataset, setStartEndDataset] = useState([0, 100]);

    // new dataset
    var [datasetName, setDatasetName] = useState("");
    var [labelName, setLabelName] = useState(["", "", "", ""]);
    var [tokenSize, setTokenSize] = useState(0);
    var [initTrainDoc, setInitTrainDoc] = useState(0);

    async function fetchVarAPI() {
        const url = BASE_URL_BACKEND + "mainapp/getvariables/";
        var response = await fetch(url);
        var jsondata = await response.json();

        setProjectPath( jsondata.main_project_location );
        setIncrementalEpochs( jsondata.increment_epochs );
        setInitialEpochs( jsondata.intial_epochs );
        setInqueMaxLen( jsondata.inque_maxlen );
        setBatchSize( jsondata.batch_size );
        setCurrDataset( jsondata.curr_dataset );
    }

    async function fetchDatasetsList() {
        const url = BASE_URL_BACKEND + "mainapp/alldatasets/";
        var response = await fetch(url);
        var jsondata = await response.json();
        setDatasetList( jsondata );
    }

    async function predictDocuments() {
        const url = BASE_URL_BACKEND + "mainapp/predictdocs/";
        await fetch(url);
        alert("Documents predicted");
    }

    async function createPDFs() {
        var url = BASE_URL_BACKEND + 'mainapp/createpdf/';
        var requestOptions = {
            method : 'POST',
            headers : { 
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                "startIdx" : startEndDataset[0],
                "endIdx" : startEndDataset[1]
            })
        };
        await fetch(url, requestOptions);
    }

    async function createDataSet() {
        var url = BASE_URL_BACKEND + 'mainapp/createdataset/';
        var requestOptions = {
            method : 'POST',
            headers : { 
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                "datasetName" : datasetName,
                "label1Name" : labelName[0],
                "label2Name" : labelName[1],
                "label3Name" : labelName[2],
                "label4Name" : labelName[3],
                "tokenSize" : tokenSize,
                "initialDoc" : initialDoc
            })
        };
        await fetch(url, requestOptions);
    }

    async function updateVars() {
        var url = BASE_URL_BACKEND + 'mainapp/updatevars/';
        var requestOptions = {
            method : 'POST',
            headers : { 
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                "main_project_location" : mainProjectPath,
                "intial_epochs" : intialEpochs,
                "increment_epochs" : incrementalEpochs,
                "inque_maxlen" : inqueMaxLen,
                "batch_size" : batchSize,
                "curr_dataset_name" : currDataset,
            })
        };
        await fetch(url, requestOptions);
    }

    function handleStartIdxChange(e) { setStartEndDataset( [e.target.value, startEndDataset[1] ]); }
    function handleEndIdxChange(e) { setStartEndDataset( [ startEndDataset[0], e.target.value ]); }
    function handleDatasetNameChange(e) { setDatasetName(e.target.value); }
    function handleDatasetLabel0NameChange(e) { setLabelName( [ e.target.value, labelName[1], labelName[2], labelName[3] ] ); }
    function handleDatasetLabel1NameChange(e) { setLabelName( [ labelName[0], e.target.value, labelName[2], labelName[3] ] ); }
    function handleDatasetLabel2NameChange(e) { setLabelName( [ labelName[0], labelName[1], e.target.value, labelName[3] ] ); }
    function handleDatasetLabel3NameChange(e) { setLabelName( [ labelName[0], labelName[1], labelName[2], e.target.value ] ); }
    function handleProjectPath(e) { setProjectPath( e.target.value ); }
    function handleIncrementalEpochs(e) { setIncrementalEpochs( e.target.value ); }
    function handleInitialEpochs(e) { setInitialEpochs( e.target.value ); }
    function handleInQueMaxLen(e) { setInqueMaxLen( e.target.value ); }
    function handlebatchSize(e) { setBatchSize( e.target.value ); }
    function handleTokenSize(e) { setTokenSize( e.target.value ); }
    function changeDataset(e) { setCurrDataset( e.target.value ); }
    function handleInitTrainDoc(e) { setInitTrainDoc( e.traget.value ); }
    
    useEffect(() => {
        fetchVarAPI();
        fetchDatasetsList();
    }, []);

    if(!datasetList) return (<> Loading... </>);

    return (
        <div>
			<div className="container py-5">
				<form>
                    <div className="form-group">
						<label>Select the Dataset You want to work on : </label>
						<select className="form-control" onChange={ changeDataset } value={ currDataset } required>
                            {
                                datasetList.map( (dataset, i) => {
                                    return <option value={ dataset.dataset_name } >{ dataset.dataset_name }</option>;
                                } )
                            }
						</select>
					</div>

					<div className="form-group">
						<label>Enter Main Project Path: </label>
						<input
							type="text"
							className="form-control"
							placeholder="Enter Main Project Path"
							name="mainProjectPath"
                            value = { mainProjectPath }
                            onChange = { handleProjectPath }
							required
						/>
					</div>

					<div className="form-group">
						<label>Enter Initial Epochs: </label>
						<input
							type="text"
							className="form-control"
							placeholder="Enter Main Project Path"
							name="initialEpochs"
                            value = { intialEpochs }
                            onChange = { handleInitialEpochs }
							required
						/>
					</div>

					<div className="form-group">
						<label>Enter Incremental Epochs: </label>
						<input
							type="text"
							className="form-control"
							placeholder="Enter Main Project Path"
							name="incrementalEpochs"
                            value = { incrementalEpochs }
                            onChange = { handleIncrementalEpochs }
							required
						/>
					</div>

					<div className="form-group">
						<label>Enter Inque Maximum size : </label>
						<input
							type="text"
							className="form-control"
							placeholder="Enter Inque Maximum size"
							name="inqueMaxLen"
                            value = { inqueMaxLen }
                            onChange = { handleInQueMaxLen }
							required
						/>
					</div>

					<div className="form-group">
						<label>Enter Batch Size : </label>
						<input
							type = "text"
							className = "form-control"
							placeholder = "Enter Batch Size"
							name = "batchSize"
                            value = { batchSize }
                            onChange = { handlebatchSize }
							required
						/>
					</div>
					<input type="submit" onClick={ updateVars } className="btn btn-primary" value="Update" />
				</form>
            </div>

            <div className='adminBtns' >
                <button className="btn btn-primary" onClick={ predictDocuments }>
                    Predict Documents
                </button>
                <button className="btn btn-primary" onClick={ () => setModalOpenAddDataset( !modalOpenAddDataset ) } >
                    Add Dataset
                </button>
                <button className="btn btn-primary" onClick={ () => setModalOpenImportDoc( !modalOpenImportDoc ) } >
                    Import Documents
                </button>
            </div>

            {
                ( modalOpenAddDataset ) ? 
                <div className={ (modalOpenAddDataset) ? "modal open" : "modal" }>
                    <div className="modal-overlay" onClick={ () => setModalOpenAddDataset( !modalOpenAddDataset ) } ></div>
                    <div className="modal-card">
                        <div className="modal-body">
                        <div className="modal-content">
                            <div className="container py-5">
                                <form>
                                    <div className="form-group">
                                        <label>Enter Dataset Name : </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Dataset Name"
                                            name="datasetName"
                                            value = { datasetName }
                                            onChange = { handleDatasetNameChange }
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Enter Label 1 Name : </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Label 1 Name"
                                            name="label1name"
                                            value = { labelName[0] }
                                            onChange = { handleDatasetLabel0NameChange }
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Enter Label 2 Name : </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Label 2 Name"
                                            name="label2name"
                                            value = { labelName[1] }
                                            onChange = { handleDatasetLabel1NameChange }
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Enter Label 3 Name : </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Label 3 Name"
                                            name="label3name"
                                            value = { labelName[2] }
                                            onChange = { handleDatasetLabel2NameChange }
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Enter Label 4 Name : </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Label 4 Name"
                                            name="label4name"
                                            value = { labelName[3] }
                                            onChange = { handleDatasetLabel3NameChange }
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Enter Maximum length of a Document in the Dataset ( can we approx maximum lenght ) : </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Label 4 Name"
                                            name="label4name"
                                            value = { tokenSize }
                                            onChange = { handleTokenSize }
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Enter Number of Documents used for Initial Training : </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Label 4 Name"
                                            name="label4name"
                                            value = { initTrainDoc }
                                            onChange = { handleInitTrainDoc }
                                            required
                                        />
                                    </div>

                                    <input type="submit" onClick={ createDataSet } className="btn btn-primary" value="Add Dataset" />
                                </form>
                            </div>
                        </div>
                        </div>
                    </div>
                </div> : <div></div>
            }

            {
                ( modalOpenImportDoc ) ? 
                <div className={ (modalOpenImportDoc) ? "modal open" : "modal" }>
                    <div className="modal-overlay" onClick={ () => setModalOpenImportDoc( !modalOpenImportDoc ) } ></div>
                    <div className="modal-card">
                        <div className="modal-body">
                        <div className="modal-content">
                            <div className="container py-5">
                                <form>
                                    <div className="form-group">
                                        <label>Enter starting index of Dataset : </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter starting index of Dataset"
                                            name="startIdx"
                                            value = { startEndDataset[0] }
                                            onChange= { handleStartIdxChange }
                                            required
                                        />
                                    </div>
                
                                    <div className="form-group">
                                        <label>Enter ending index of Dataset : </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter ending index of Dataset"
                                            name="endIdx"
                                            value = { startEndDataset[1] }
                                            onChange = { handleEndIdxChange }
                                            required
                                        />
                                    </div>

                                    <input type="submit" onClick={ createPDFs } className="btn btn-primary" value="Import Documents" />
                                </form>
                            </div>
                        </div>
                        </div>
                    </div>
                </div> : <div></div>
            }
        </div>
    )
}