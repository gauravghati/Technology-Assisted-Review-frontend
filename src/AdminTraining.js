import React, { useState, useEffect } from 'react'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import LaunchIcon from '@mui/icons-material/Launch';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';

export default function AdminTraining() {
    var [files, setFiles] = useState([]);
    var [changeed, setChanged] = useState(false);

    function handleFile(e) {
        var arr = Array.from( e.target.files );
        setFiles( arr );
    }

    function removeEle( idx ) {
        var temp = files;
        temp.splice(idx, 1);
        setFiles( temp );
        setChanged( !changeed );
    }

    useEffect(() => {
        console.log( "useeffect called!" );
    }, [changeed]);

    return (
        <div>
            <div className="filterAndSearch">
                <input className='chooseFolder'
                    directory=""
                    webkitdirectory=""
                    type="file"
                    onChange={ handleFile }
                />
            </div>

            <table>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Type</th>
                        <th>Document Name</th>
                        <th>Size</th>
                        <th>View</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody> {
                    files.map( (file, i) => {
                        return <tr key={i} >
                            <td> { i + 1 } </td>
                            <td> {
                                <PictureAsPdfIcon/>
                            } </td>

                            <td>{ 
                                file.name
                            } </td>

                            <td>{ 
                                file.size
                            } </td>

                            <td>
                                <Button > {
                                    <LaunchIcon/>
                                } </Button>
                            </td>

                            <td>
                                <Button onClick={ (i) => removeEle(i) } > {
                                        <DeleteIcon/>
                                } </Button>
                            </td>

                        </tr>
                    })
                }
                </tbody>
            </table>
            
            <div className="admin-upload-button">
                <button className='buttonNext' >
                    Upload
                </button>
            </div>

        </div>
    )
}