# Control BLE device over 4G network using WebRTC and WebBluetooth using any smartphone android or ios

### Gmaps project:

https://console.cloud.google.com/google/maps-apis/credentials?project=ble-blos

# TODO

- Make static ✅
- release to githubpages ✅
- create BLE mobile page ✅
- implement web-rtc ✅
  - crete test web-rtc page✅
    - receiver✅
    - transmitter✅
  - create BLE mobile page ✅
- send commands from web to mobile to bt
- send video from mobile to web ✅
- create web control page ✅
  - send command from p2 to p1✅
  - forward command from p1 to ble ✅

try free TURN server from https://xirsys.com/ (100 connections per day)
or https://dev.to/aprogrammer22/list-of-free-stun-and-turn-servers-open-relay-project-3a70

# DONE

- add speed control ✅
- add battery level ✅
- test status store ✅
- refactor lastCommand store as statusStore ✅
- find why commands are sent 4 times in a row or received 4 times ✅?
- send info object from peer1 to peer 2 ✅
- gps ✅
- battery phone ✅
- battery controller ✅

- refactor stores to be shared between peer 1 and 2 ✅
- find bug that sends commands continuously, it should only be sent once every 0.4s or so ✅
  - add store for keys down send if at least one key is down ✅
  - on keys up send stop command ✅

TODO:

- fix joystick component.✅
- add x box controller! 🎉 ✅
- fix disable drive on no command or disconnect. todo on BLE decive not here...
- hold command for more than 0.5s // will not happend with gamepad ever...
- add horn and lights ✅

## controller & car related

- use right stick to set diff between left and right motor speed for stearing and use left stick to set speed
- add speed modes

## pper 2 peer related

- fix page unresponsive on mobile IDK why
- fix polling system between peers
- fix compass value being 0 always
- fix device orientation not working on mobile -> map
- refactor ble device since types are messed up. class ? or return device on connect. why did i want to do this ?
