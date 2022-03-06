import React from 'react'

export default function Nav() {
    var num = "1";
    if( localStorage.getItem('navnum') ) {
        num = localStorage.getItem('navnum');
        localStorage.removeItem('navnum');
    }

    var base = "w3-bar-item w3-button";
    var active = " w3-button-active";
    var veritasWide = base + " w3-wide"; 

    var activeAdmin = base.concat( (num==='1') ? active : "" );
    var activeReviewerOne = base.concat( (num==='2') ? active : "" );
    var activeReviewerTwo = base.concat( (num==='3') ? active : "" );

    function changeNum( num ) {
        console.log( num );
        localStorage.setItem( 'navnum', num );
    }

    return (
        <nav className="w3-top">
            <div className="w3-white w3-card" id="myNavbar">
                <a href={process.env.PUBLIC_URL + '/'} className={ veritasWide }> VERITAS </a>
                <div className="w3-right w3-hide-small">                    
                    <a href={process.env.PUBLIC_URL + '/admin/1'} onClick={ () => changeNum("1") } className = { activeAdmin } >
                        ADMIN 
                    </a>
                    
                    <a href={process.env.PUBLIC_URL + '/reviewer/1'} onClick={ () => changeNum("2") } className = { activeReviewerOne } >
                        MANUAL REVIEWER 
                    </a>
                    
                    <a href={process.env.PUBLIC_URL + '/reviewer/2'} onClick={ () => changeNum("3") } className = { activeReviewerTwo } >
                        OVERVIEW PANEL 
                    </a>
                </div>
            </div>
        </nav>
    )
}