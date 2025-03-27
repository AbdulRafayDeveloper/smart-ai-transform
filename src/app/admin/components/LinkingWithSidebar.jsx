import React from 'react'
import Sidebar from './Sidebar';

function LinkingWithSidebar() {
    return (
        <div>
            <Sidebar
                dashboard="../../admin/dashboard"
                speechmaker="../../admin/speechmaker"
                videorevoice="../../admin/videorevoice"
                users="../../admin/users/list"
            />
        </div>
    )
}

export default LinkingWithSidebar;
