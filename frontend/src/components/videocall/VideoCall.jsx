import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';

function VideoCall() {
  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const currentCall = useRef(null); // Ref để lưu trữ cuộc gọi hiện tại


    useEffect(() => {
      const peer = new Peer();

    peer.on('open', (id) => {
      setPeerId(id) //Save PeerId
    });

    peer.on('call', (call) => {
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        getUserMedia({ video: true, audio: true }, (mediaStream) => {
              currentUserVideoRef.current.srcObject = mediaStream;
              currentUserVideoRef.current.oncanplay = () => {
              currentUserVideoRef.current.play();
            };
            call.answer(mediaStream)


            call.on('stream', function(remoteStream) {
              remoteVideoRef.current.srcObject = remoteStream
              remoteVideoRef.current.oncanplay = () => {
              remoteVideoRef.current.play();
            };
        });
        // Lưu trữ cuộc gọi hiện tại vào ref
        currentCall.current = call;
      });
    })

    peerInstance.current = peer;
  }, [])

    const call = (remotePeerId) => {
      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, (mediaStream) => {

        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();

        const call = peerInstance.current.call(remotePeerId, mediaStream)

        call.on('stream', (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream
          remoteVideoRef.current.play();

      });
      // Lưu trữ cuộc gọi hiện tại vào ref
      currentCall.current = call;
    });
  };

  const endCall = () => {
    if (currentCall.current) {
      currentCall.current.close(); // Đóng cuộc gọi hiện tại

      // Tắt video của người dùng hiện tại và từ xa
      if (currentUserVideoRef.current.srcObject) {
        currentUserVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
        currentUserVideoRef.current.srcObject = null;
      }
      if (remoteVideoRef.current.srcObject) {
        remoteVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
        remoteVideoRef.current.srcObject = null;
      }

      currentCall.current = null; // Đặt lại ref của cuộc gọi hiện tại
    }
  };
    return(
        <div className="container">
            <div id='callvideo' className="chat-box ">
              <div className="divVideoCall">
                {/* bang ma phong */}
                <div className="getStringRoom">
                  <h1 className='titleNameH1'>Mã phòng cuộc gọi:</h1>
                  <input type="text" className='inputStringRoom' value={peerId}/>
                  {/* bang nhap ma phong */}
                  <h1 className='titleNameH1'>Nhập mã tham gia phòng:</h1>
                  <input type="text"  className='inputStringRoom' value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)} />
                  <button onClick={() => call(remotePeerIdValue)}>Call</button>
                  <button onClick={endCall}>End Call</button>
                </div>

                {/* bang video */}
                <div className="videocallRoom">
                  <div className="videocallRoom1">
                      <video ref={currentUserVideoRef} />
                  </div>
                  <div className="videocallRoom2">
                      <video ref={remoteVideoRef} />
                  </div>
                </div>
              </div>
            </div>
        </div>
    )

}
export default VideoCall;