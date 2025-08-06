import React from 'react'
import Sidebar from './Sidebar';

function LinkingWithSidebar() {
    return (
        <div>
            <Sidebar
                dashboard="../../admin/dashboard"
                users="../../admin/users/list"
                texttovideomakers="../../admin/text-to-video-makers/list"
                texttovoicemakers="../../admin/text-to-voice-makers/list"
                texttoimagemakers="../../admin/text-to-image-makers/list"
                imagetotextmakers="../../admin/image-to-text-makers/list"
                voicetotextmakers="../../admin/voice-to-text-makers/list"
            />
        </div>
    )
}

export default LinkingWithSidebar;
