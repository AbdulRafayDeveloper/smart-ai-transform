import React from 'react'
import Sidebar from '../Sidebar';

function SecondLayerSidebar() {
    return (
        <div>
            <Sidebar
                dashboard="../../../admin/dashboard"
                addProjects="../../../admin/projects/add"
                projects="../../../admin/projects/list"
                speechmaker="../../../admin/speechmaker"
                videorevoice="../../../admin/videorevoice"
                users="../../../admin/users/list"
            
            ></Sidebar>
        </div >
    )
}

export default SecondLayerSidebar