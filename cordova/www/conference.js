var room = null;
var button = null;

function showVolume(el, volume) {
    if (!el) return;
    if (volume < -45) volume = -45; // -45 to -20 is
    if (volume > -20) volume = -20; // a good range
    el.value = volume;
}

var conferenceInit = function(roomName) {
    room = roomName;
    button = $("#screenShareButton");

    // create our webrtc connection
    var webrtc = new SimpleWebRTC({
        // the id/element dom element that will hold "our" video
        localVideoEl: "localVideo",
        // the id/element dom element that will hold remote videos
        remoteVideosEl: '',
        // immediately ask for camera access
        autoRequestMedia: true,
        debug: false,
        detectSpeakingEvents: true,
        autoAdjustMic: false,
        url: "http://localhost:8888"
    });

    // when it's ready, join if we got a room from the URL
    webrtc.on('readyToCall', function () {
        console.log("webrtc.readyToCall");
        if (room) webrtc.joinRoom(room);
    });

    // we got access to the camera
    webrtc.on('localStream', function (stream) {
        console.log("webrtc.localStream");
        $("#localVolume").show();
    });
    // we did not get access to the camera
    webrtc.on('localMediaError', function (err) {
        console.log("webrtc.localMediaError", err);
    });

    // local screen obtained
    webrtc.on('localScreenAdded', function (video) {
        console.log("webrtc.localScreenAdded");
        video.onclick = function () {
            video.style.width = video.videoWidth + 'px';
            video.style.height = video.videoHeight + 'px';
        };
        document.getElementById('localScreenContainer').appendChild(video);
        $('#localScreenContainer').show();
    });
    
    // local screen removed
    webrtc.on('localScreenRemoved', function (video) {
        console.log("webrtc.localScreenRemoved");
        document.getElementById('localScreenContainer').removeChild(video);
        $('#localScreenContainer').hide();
    });

    // a peer video has been added
    webrtc.on('videoAdded', function (video, peer) {
        console.log("webrtc.videoAdded", peer);
        var remotes = document.getElementById('remotes');
        if (remotes) {
            var container = document.createElement('div');
            container.className = 'videoContainer';
            container.id = 'container_' + webrtc.getDomId(peer);
            container.appendChild(video);

            // suppress contextmenu
            video.oncontextmenu = function () { return false; };

            // resize the video on click
            video.onclick = function () {
                container.style.width = video.videoWidth + 'px';
                container.style.height = video.videoHeight + 'px';
            };

            // show the remote volume
            var vol = document.createElement('meter');
            vol.id = 'volume_' + peer.id;
            vol.className = 'volume';
            vol.min = -45;
            vol.max = -20;
            vol.low = -40;
            vol.high = -25;
            container.appendChild(vol);

            // show the ice connection state
            if (peer && peer.pc) {
                var connstate = document.createElement('div');
                connstate.className = 'connectionstate';
                container.appendChild(connstate);
                peer.pc.on('iceConnectionStateChange', function (event) {
                    switch (peer.pc.iceConnectionState) {
                    case 'checking':
                        connstate.innerText = 'Connecting to peer...';
                        break;
                    case 'connected':
                    case 'completed': // on caller side
                        $(vol).show();
                        connstate.innerText = 'Connection established.';
                        break;
                    case 'disconnected':
                        connstate.innerText = 'Disconnected.';
                        break;
                    case 'failed':
                        connstate.innerText = 'Connection failed.';
                        break;
                    case 'closed':
                        connstate.innerText = 'Connection closed.';
                        break;
                    }
                });
            }
            remotes.appendChild(container);
        }
    });
    // a peer was removed
    webrtc.on('videoRemoved', function (video, peer) {
        console.log("webrtc.videoRemoved", peer);
        var remotes = document.getElementById('remotes');
        var el = document.getElementById(peer ? 'container_' + webrtc.getDomId(peer) : 'localScreenContainer');
        if (remotes && el) {
            remotes.removeChild(el);
        }
    });

    // local volume has changed
    webrtc.on('volumeChange', function (volume, treshold) {
        //console.log("webrtc.volumeChange");
        showVolume(document.getElementById('localVolume'), volume);
    });
    // remote volume has changed
    webrtc.on('remoteVolumeChange', function (peer, volume) {
        //console.log("webrtc.remoteVolumeChange");
        showVolume(document.getElementById('volume_' + peer.id), volume);
    });

    // local p2p/ice failure
    webrtc.on('iceFailed', function (peer) {
        console.log("webrtc.iceFailed");
        var connstate = document.querySelector('#container_' + webrtc.getDomId(peer) + ' .connectionstate');
        console.log('local fail', connstate);
        if (connstate) {
            connstate.innerText = 'Connection failed.';
            fileinput.disabled = 'disabled';
        }
    });

    // remote p2p/ice failure
    webrtc.on('connectivityError', function (peer) {
        var connstate = document.querySelector('#container_' + webrtc.getDomId(peer) + ' .connectionstate');
        console.log("webrtc.connectivityError", connstate);
        if (connstate) {
            connstate.innerText = 'Connection failed.';
            fileinput.disabled = 'disabled';
        }
    });

    webrtc.on('localScreenRemoved', function () {
        console.log("webrtc.localScreenRemoved");
        setButton(true);
    });

    // Since we use this twice we put it here
    function setRoom(name) {
        $("#roomTitle").html("Room: " + name);
        $("roomSubTitle").html("Link to join: " + location.href);
        $("body").addClass('active');
    }

    var setButton = function (bool) {
        //button.innerText = bool ? 'share screen' : 'stop sharing';
    };

    /*
    button.onclick = function () {
        if (webrtc.getLocalScreen()) {
            webrtc.stopScreenShare();
            setButton(true);
        } else {
            webrtc.shareScreen(function (err) {
                if (err) {
                    setButton(true);
                } else {
                    setButton(false);
                }
            });

        }
    };
    */
    if (!webrtc.capabilities.screenSharing) {
        //button.disabled = 'disabled';
    }
    setButton(true);
    if (room) {
        setRoom(room);
    } else {
        webrtc.createRoom("connectedMD", function (err, name) {
            console.log(' create room cb', arguments);
            //var newUrl = location.pathname + '?' + name;
            if (!err) {
                //history.replaceState({foo: 'bar'}, null, newUrl);
                setRoom(name);
            } else {
                console.log(err);
            }
        });
    }
};