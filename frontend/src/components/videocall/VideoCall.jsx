import Peer from 'peer.js';
import { useEffect, useState } from 'react';

function VideoCall(){
    const[userId, setPeerId] = useState(null)

    useEffect(() => {
        const peer  = new Peer();
        
        peer.on('open', function(id){
            setPeerId(id);
        });
    }, [])

    const call = {remotePeerId} => {
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        getUserMedia({video:call('another-peers-id',)

        })

    }

}
export default VideoCall;